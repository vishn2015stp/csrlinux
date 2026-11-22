#!/usr/bin/env bash
# Pull the latest version from GitHub, rebuild, and restart the service.
# A database dump is taken first; any failure rolls back to the previous commit.
#
# Usage:
#   sudo /opt/csrlinux/deploy/update.sh
#   FORCE=1 sudo /opt/csrlinux/deploy/update.sh   # rebuild/restart even if unchanged
set -Eeuo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

APP_DIR="${APP_DIR:-/opt/csrlinux}"
CONF="$APP_DIR/deploy/install.conf"

log()  { printf '\n[csrlinux-update] %s\n' "$*"; }
die()  { printf '\n[csrlinux-update][ERROR] %s\n' "$*" >&2; exit 1; }

run_as() {
    local target_user="$1"
    shift
    if command -v runuser >/dev/null 2>&1; then
        runuser -u "$target_user" -- "$@"
    elif [[ -x /usr/sbin/runuser ]]; then
        /usr/sbin/runuser -u "$target_user" -- "$@"
    elif [[ -x /sbin/runuser ]]; then
        /sbin/runuser -u "$target_user" -- "$@"
    elif command -v su >/dev/null 2>&1; then
        su -s /bin/bash "$target_user" -c 'exec "$@"' _ "$@"
    else
        die "Neither runuser nor su is available."
    fi
}

[[ "$(id -u)" -eq 0 ]] || die "Run as root (sudo $0)."
[[ -f "$CONF" ]] || die "Configuration not found at $CONF. Run deploy/install.sh first."
# shellcheck source=/dev/null
source "$CONF"

git config --global --add safe.directory "$APP_DIR" >/dev/null 2>&1 || true

BACKUP_DIR="${BACKUP_DIR:-/var/backups/csrlinux}"
FORCE="${FORCE:-0}"
OLD_SHA=""
BACKUP_FILE=""

rollback() {
    trap - ERR
    log "Something failed — rolling back to $OLD_SHA..."
    git -C "$APP_DIR" reset --hard "$OLD_SHA" >/dev/null 2>&1 || true
    run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm ci" >/dev/null 2>&1 || true
    run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm run build" >/dev/null 2>&1 || true
    systemctl restart "$SERVICE_NAME" >/dev/null 2>&1 || true
    die "Update failed and was rolled back to $OLD_SHA. Database backup: $BACKUP_FILE"
}
trap 'log "ERROR at line $LINENO"; rollback' ERR

cd "$APP_DIR"
[[ -d .git ]] || die "$APP_DIR is not a git repository."

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
    die "Local source changes detected. Commit, stash or discard them before updating."
fi

OLD_SHA="$(git rev-parse HEAD)"
log "Current version: $(git rev-parse --short HEAD) $(git log -1 --format=%s)"

log "Fetching $BRANCH from origin..."
git fetch --tags origin "$BRANCH"
NEW_SHA="$(git rev-parse "origin/$BRANCH")"

if [[ "$OLD_SHA" == "$NEW_SHA" && "$FORCE" != "1" ]]; then
    log "Already up to date ($(git rev-parse --short HEAD)). Nothing to do."
    exit 0
fi
log "Updating to: $(git rev-parse --short "$NEW_SHA") $(git log -1 --format=%s "$NEW_SHA")"

# ---------------------------------------------------------------- backup
umask 077
install -d -m 700 -o postgres -g postgres "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$(date +%Y%m%d_%H%M%S).dump"
log "Backing up database '$DB_NAME' to $BACKUP_FILE..."
run_as postgres pg_dump -Fc -f "$BACKUP_FILE" "$DB_NAME"

# Keep the 5 most recent dumps.
find "$BACKUP_DIR" -maxdepth 1 -type f -name "${DB_NAME}_*.dump" -printf '%T@ %p\n' \
    | sort -nr | tail -n +6 | cut -d' ' -f2- | xargs -r rm -f

# ---------------------------------------------------------------- update
log "Applying the new source and rebuilding..."
git reset --hard "$NEW_SHA"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"
run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm ci"
run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm run build"
[[ -f "$APP_DIR/dist/index.html" ]] || die "Build did not produce dist/index.html."

log "Restarting $SERVICE_NAME..."
systemctl restart "$SERVICE_NAME"

healthy=0
for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:$APP_PORT/api/settings" >/dev/null 2>&1; then
        healthy=1
        break
    fi
    sleep 1
done
[[ "$healthy" -eq 1 ]] || die "App did not become healthy after restart."

log "Update complete: $(git rev-parse --short HEAD) is now running."
log "Database backup: $BACKUP_FILE"
