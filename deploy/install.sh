#!/usr/bin/env bash
# Install Hyper-CSR (csrlinux) on Debian 12/13 directly from GitHub.
#
# Usage (all variables optional):
#   curl -fsSL https://raw.githubusercontent.com/vishn2015stp/csrlinux/main/deploy/install.sh | sudo bash
#   sudo APP_DIR=/opt/csrlinux APP_PORT=3001 WITH_NGINX=1 DOMAIN=csr.example.com bash deploy/install.sh
#
# Safe to re-run: existing .env and database data are preserved.
set -Eeuo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

REPO_URL="${REPO_URL:-https://github.com/vishn2015stp/csrlinux.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-/opt/csrlinux}"
APP_USER="${APP_USER:-csrlinux}"
APP_PORT="${APP_PORT:-3001}"
DB_NAME="${DB_NAME:-csrlinux}"
DB_USER="${DB_USER:-csrlinux}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
WITH_NGINX="${WITH_NGINX:-0}"
DOMAIN="${DOMAIN:-_}"
SERVICE_NAME="${SERVICE_NAME:-csrlinux}"

log()  { printf '\n[csrlinux] %s\n' "$*"; }
die()  { printf '\n[csrlinux][ERROR] %s\n' "$*" >&2; exit 1; }
trap 'die "Installation failed at line $LINENO. See output above."' ERR

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

[[ "$(id -u)" -eq 0 ]] || die "Run this installer as root (sudo bash install.sh)."

[[ "$DB_USER" =~ ^[A-Za-z][A-Za-z0-9_]*$ ]] || die "DB_USER may only contain letters, digits and underscores."
[[ "$DB_NAME" =~ ^[A-Za-z][A-Za-z0-9_]*$ ]] || die "DB_NAME may only contain letters, digits and underscores."
[[ "$APP_PORT" =~ ^[0-9]+$ ]] || die "APP_PORT must be a number."

if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    log "Detected: ${PRETTY_NAME:-unknown}"
else
    die "Cannot read /etc/os-release — this installer targets Debian."
fi

# ------------------------------------------------------------------ packages
log "Installing system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
    ca-certificates curl gnupg git openssl util-linux \
    postgresql postgresql-client
if [[ "$WITH_NGINX" == "1" ]]; then
    apt-get install -y --no-install-recommends nginx
fi

install_node() {
    if command -v node >/dev/null 2>&1; then
        local major
        major="$(node -p 'process.versions.node.split(".")[0]')"
        if [[ "$major" -ge 20 ]]; then
            log "Node.js $(node -v) already installed."
            return
        fi
        log "Node.js $(node -v) is too old; upgrading to Node.js 22."
    else
        log "Node.js not found; installing Node.js 22 from NodeSource."
    fi
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y --no-install-recommends nodejs
}
install_node
log "Using Node.js $(node -v) and npm $(npm -v)."

# ------------------------------------------------------------------ app user
if ! id -u "$APP_USER" >/dev/null 2>&1; then
    log "Creating system user '$APP_USER'..."
    useradd --system --no-create-home --home-dir "$APP_DIR" --shell /bin/bash "$APP_USER"
fi

# ------------------------------------------------------------------ source
if [[ -d "$APP_DIR/.git" ]]; then
    log "Repository already present at $APP_DIR (run deploy/update.sh to update it)."
else
    if [[ -d "$APP_DIR" ]]; then
        if [[ -f "$APP_DIR/package.json" ]] || [[ -d "$APP_DIR/src" ]]; then
            die "$APP_DIR is not empty and is not a git repository. Move it aside first."
        fi
        log "Cleaning up uninitialized/skeleton directory $APP_DIR..."
        rm -rf "$APP_DIR"
    fi
    log "Cloning $REPO_URL (branch: $BRANCH) into $APP_DIR..."
    git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$APP_DIR"
fi
chown -R "$APP_USER:$APP_USER" "$APP_DIR"
git config --global --add safe.directory "$APP_DIR" >/dev/null 2>&1 || true

# ------------------------------------------------------------------ database
log "Waiting for PostgreSQL..."
for _ in $(seq 1 30); do
    pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1 && break
    sleep 1
done
pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1 \
    || die "PostgreSQL is not accepting connections on $DB_HOST:$DB_PORT."

if [[ -f "$APP_DIR/.env" ]]; then
    log "Existing .env found — database credentials and settings preserved."
else
    [[ -n "$DB_PASSWORD" ]] || DB_PASSWORD="$(openssl rand -hex 24)"

    log "Creating PostgreSQL role '$DB_USER' and database '$DB_NAME'..."
    if [[ "$(run_as postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER';")" == "1" ]]; then
        run_as postgres psql -v ON_ERROR_STOP=1 -c \
            "ALTER ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';"
    else
        run_as postgres psql -v ON_ERROR_STOP=1 -c \
            "CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';"
    fi

    if [[ "$(run_as postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';")" != "1" ]]; then
        run_as postgres createdb -O "$DB_USER" "$DB_NAME"
    fi

    umask 077
    cat > "$APP_DIR/.env" <<EOF
# Generated by deploy/install.sh on $(date -u +%Y-%m-%dT%H:%M:%SZ)
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
DB_SSL=0
DB_POOL_MAX=5
PORT=${APP_PORT}
NODE_ENV=production
EOF
    chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    log "Wrote $APP_DIR/.env (database password generated automatically)."
fi

# Remember the install choices for deploy/update.sh (gitignored).
cat > "$APP_DIR/deploy/install.conf" <<EOF
APP_DIR="$APP_DIR"
APP_USER="$APP_USER"
BRANCH="$BRANCH"
APP_PORT="$APP_PORT"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
SERVICE_NAME="$SERVICE_NAME"
EOF
chown "$APP_USER:$APP_USER" "$APP_DIR/deploy/install.conf"
chmod 600 "$APP_DIR/deploy/install.conf"

# ------------------------------------------------------------------ build
log "Installing npm dependencies and building the React frontend..."
run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm ci"
run_as "$APP_USER" bash -c "cd \"$APP_DIR\" && npm run build"
[[ -f "$APP_DIR/dist/index.html" ]] || die "Frontend build did not produce dist/index.html."

# ------------------------------------------------------------------ service
log "Installing the systemd service..."
sed -e "s|__APP_USER__|$APP_USER|g" -e "s|__APP_DIR__|$APP_DIR|g" \
    "$APP_DIR/deploy/csrlinux.service.tpl" > "/etc/systemd/system/$SERVICE_NAME.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

if [[ "$WITH_NGINX" == "1" ]]; then
    log "Configuring nginx reverse proxy (server_name: $DOMAIN)..."
    sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__APP_PORT__|$APP_PORT|g" \
        "$APP_DIR/deploy/nginx.conf.tpl" > "/etc/nginx/sites-available/$SERVICE_NAME"
    ln -sfn "/etc/nginx/sites-available/$SERVICE_NAME" "/etc/nginx/sites-enabled/$SERVICE_NAME"
    nginx -t
    systemctl enable nginx
    systemctl restart nginx
fi

# ------------------------------------------------------------------ verify
log "Waiting for the application to answer..."
healthy=0
for _ in $(seq 1 30); do
    if curl -fsSL -k "http://127.0.0.1:$APP_PORT/api/settings" >/dev/null 2>&1; then
        healthy=1
        break
    fi
    sleep 1
done
[[ "$healthy" -eq 1 ]] || die "App did not become healthy. Check: journalctl -u $SERVICE_NAME -n 50"

cat <<EOF

[csrlinux] INSTALL COMPLETE
  App directory : $APP_DIR
  Local URL     : http://$(hostname):$APP_PORT
$(if [[ "$WITH_NGINX" == "1" ]]; then printf '  Proxy URL     : http://%s (server_name: %s)\n' "$DOMAIN" "$DOMAIN"; fi)
  Service       : $SERVICE_NAME (systemctl status $SERVICE_NAME)
  Logs          : journalctl -u $SERVICE_NAME -f
  Updates       : sudo $APP_DIR/deploy/update.sh
  Enable HTTPS  : sudo $APP_DIR/deploy/setup-ssl.sh

  Default login : admin / password123
  >>> Change this password immediately in Settings -> Password. <<<
EOF
