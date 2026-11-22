# csrlinux — Hyper-CSR

A customer service / repair request tracker: React + Vite single-page app, Express REST API, and PostgreSQL database. This repository contains everything needed to install it on a Debian server directly from GitHub and keep it updated.

**Tested target:** Debian 12/13, 1 CPU / 2 GB RAM (Node 22 + PostgreSQL use roughly 300–500 MB RAM; the build step peaks higher but completes fine).

## Architecture

```
Browser ── nginx (optional, port 80) ── Express :3001 ── PostgreSQL 15 (local)
                                          │
                                          └── serves built React app from dist/
```

- `src/` — React frontend. All API calls are same-origin under `/api` (`src/lib/api.js`).
- `server/` — Express API (port `3001`, configurable with `PORT`), also serves `dist/`.
- `deploy/` —Debian installer, updater, systemd unit template, nginx template.
- `main.go`, `api/`, `migrations/`, `pb_data/` — alternative Vercel/PocketBase experiments; not used by the Debian install.

## Install on Debian (from GitHub)

Run as root on a fresh Debian server:

```bash
curl -fsSL https://raw.githubusercontent.com/vishn2015stp/csrlinux/main/deploy/install.sh | sudo bash
```

Or clone the script first to review it:

```bash
git clone https://github.com/vishn2015stp/csrlinux.git
cd csrlinux
sudo bash deploy/install.sh
```

The installer:

1. Installs `git`, PostgreSQL, Node.js 22 (NodeSource) and optional nginx.
2. Creates a `csrlinux` system user and clones the repo into `/opt/csrlinux`.
3. Creates a PostgreSQL role + database with a randomly generated password, and writes `/opt/csrlinux/.env`.
4. Runs `npm ci` and `npm run build` (the frontend is **not** committed to Git, so it must be built on the server).
5. Installs and starts a systemd service (`csrlinux`) and optionally configures nginx.
6. Waits for `/api/settings` to answer before reporting success.

Default login: **admin / password123**. Change it immediately under **Settings → Password**.

### Options

Set environment variables before the command:

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_DIR` | `/opt/csrlinux` | Install directory |
| `APP_USER` | `csrlinux` | System user that runs the app |
| `APP_PORT` | `3001` | Port Express listens on |
| `BRANCH` | `main` | Git branch to install |
| `REPO_URL` | `https://github.com/vishn2015stp/csrlinux.git` | Source repository (use your fork here) |
| `DB_NAME` / `DB_USER` | `csrlinux` | PostgreSQL database / role |
| `DB_PASSWORD` | random | Override the generated database password |
| `WITH_NGINX` | `0` | Set to `1` to install an nginx reverse proxy |
| `DOMAIN` | `_` | `server_name` for the nginx config (e.g. `csr.example.com`) |

Example with nginx:

```bash
sudo WITH_NGINX=1 DOMAIN=csr.example.com bash deploy/install.sh
```

The installer is safe to re-run: it keeps the existing `.env`, database contents, and any local source changes.

After install, open `http://<server-ip>:3001` (or port 80 if nginx was enabled). The Express server creates all required tables on first start.

## Updates

The update script pulls the newest commit from GitHub, rebuilds the frontend, and restarts the service. It dumps the database first and automatically rolls back if the build or health check fails.

```bash
sudo /opt/csrlinux/deploy/update.sh
```

Options: `FORCE=1` rebuilds/restarts even when there are no new commits; `BACKUP_DIR=/path` changes where database dumps are stored. Local source edits block the update (`git status` must be clean).

Optional automatic nightly updates:

```bash
sudo tee /etc/cron.d/csrlinux-update >/dev/null <<'EOF'
0 4 * * * root /opt/csrlinux/deploy/update.sh >> /var/log/csrlinux-update.log 2>&1
EOF
```

## Operations

```bash
# Service
sudo systemctl status csrlinux
sudo systemctl restart csrlinux
sudo journalctl -u csrlinux -f

# Manual database backup / restore
sudo runuser -u postgres -- pg_dump -Fc -f /root/csrlinux.dump csrlinux
sudo runuser -u postgres -- pg_restore -c -d csrlinux /root/csrlinux.dump

# Where things live
/opt/csrlinux/.env                       # DB credentials and port (mode 600)
/opt/csrlinux/deploy/install.conf        # Choices remembered by update.sh
/var/backups/csrlinux/                   # Automatic pre-update dumps (last 5)
```

To use an existing Supabase database instead of local PostgreSQL, point `DATABASE_URL` in `.env` at it and set `DB_SSL=1`, then `sudo systemctl restart csrlinux`. Nothing else changes.

## Security notes

- The app stores passwords in plaintext and has client-side-only role checks — this is inherited from the existing codebase. Do not expose it directly to the public internet without additional hardening; put it behind nginx + HTTPS and restrict access to trusted staff.
- `GET /api/download-db` exports all tables, including users and password hashes-in-plain-sight. Restrict network access accordingly.
- Change the default admin password after the first login and keep `.env` private.

## Moving data from the Windows development copy

The old `database.sqlite` files are **not** used by the Express backend. To migrate real data, use **Settings → Download Backup** in the old running app (produces a JSON export), then import it into the new database with a small `psql`/node script. The installer starts with a clean, empty schema.

## Other clients

The Android WebView app (`app-debug.apk`, not committed) points to the hardcoded URL `https://csr.hypertechdigital.com`. To use the Debian server with the app, either point that DNS name at the server with a valid HTTPS certificate, or change the URL in `android_app/lib/main.dart` and rebuild the APK.
