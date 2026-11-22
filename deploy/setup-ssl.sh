#!/usr/bin/env bash
# ==============================================================================
# Hyper-CSR SSL/HTTPS Setup Script for Debian / Ubuntu
# ==============================================================================
# Enables strict HTTPS for Hyper-CSR:
#  - Generates a SAN (Subject Alternative Name) SSL certificate for your LAN IP / domain
#    (or runs certbot for public domains)
#  - Configures Nginx reverse proxy with HTTP (port 80) -> HTTPS (port 443) redirect
#  - Enables modern TLS 1.2/1.3, ciphers, and security headers (HSTS)
#  - Opens firewall ports (80/443) in UFW
#  - Restarts Hyper-CSR and Nginx
#
# Usage:
#   sudo /opt/csrlinux/deploy/setup-ssl.sh              # Auto-detects LAN IP (e.g. 192.168.1.111)
#   sudo /opt/csrlinux/deploy/setup-ssl.sh 192.168.1.111 # Specific IP
#   sudo /opt/csrlinux/deploy/setup-ssl.sh mydomain.com  # Domain name
# ==============================================================================
set -Eeuo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

log()  { printf '\n[csrlinux-ssl] %s\n' "$*"; }
die()  { printf '\n[csrlinux-ssl][ERROR] %s\n' "$*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Run as root (sudo $0)."

APP_DIR="${APP_DIR:-/opt/csrlinux}"
CONF="$APP_DIR/deploy/install.conf"

if [[ -f "$CONF" ]]; then
    # shellcheck source=/dev/null
    source "$CONF"
fi

APP_USER="${APP_USER:-csrlinux}"
SERVICE_NAME="${SERVICE_NAME:-csrlinux}"
APP_PORT="${APP_PORT:-3001}"
SSL_DIR="/etc/ssl/csrlinux"

# Detect default LAN IP
DETECTED_IP="$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1")"
TARGET_HOST="${1:-$DETECTED_IP}"

log "Configuring HTTPS for: $TARGET_HOST"
log "Application port: $APP_PORT"

# Ensure openssl and nginx are installed
if ! command -v openssl >/dev/null 2>&1; then
    log "Installing openssl..."
    apt-get update -qq && apt-get install -y -qq openssl
fi

if ! command -v nginx >/dev/null 2>&1; then
    log "Installing nginx..."
    apt-get update -qq && apt-get install -y -qq nginx
fi

# Create SSL directory
mkdir -p "$SSL_DIR"
chmod 700 "$SSL_DIR"

CERT_FILE="$SSL_DIR/server.crt"
KEY_FILE="$SSL_DIR/server.key"

# Check if target is an IP or domain
IS_IP=0
if [[ "$TARGET_HOST" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    IS_IP=1
fi

OPENSSL_CONF="$SSL_DIR/openssl.cnf"
cat > "$OPENSSL_CONF" <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext
x509_extensions = v3_ca

[dn]
C = IN
ST = State
L = City
O = Hyper-CSR
OU = Production
CN = $TARGET_HOST

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[alt_names]
IP.1 = $DETECTED_IP
IP.2 = 127.0.0.1
DNS.1 = localhost
DNS.2 = $(hostname)
EOF

if [[ "$IS_IP" -eq 1 && "$TARGET_HOST" != "$DETECTED_IP" ]]; then
    echo "IP.3 = $TARGET_HOST" >> "$OPENSSL_CONF"
elif [[ "$IS_IP" -eq 0 ]]; then
    echo "DNS.3 = $TARGET_HOST" >> "$OPENSSL_CONF"
fi

log "Generating 2048-bit RSA SAN SSL certificate (valid for 10 years)..."
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -config "$OPENSSL_CONF" >/dev/null 2>&1

chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"
log "Certificate generated:"
log "  Certificate: $CERT_FILE"
log "  Private Key: $KEY_FILE"

# ------------------------------------------------------------------ NGINX CONFIG
log "Configuring Nginx reverse proxy for strict HTTPS..."
NGINX_CONF_AVAILABLE="/etc/nginx/sites-available/$SERVICE_NAME"
NGINX_CONF_ENABLED="/etc/nginx/sites-enabled/$SERVICE_NAME"
TPL="$APP_DIR/deploy/nginx-ssl.conf.tpl"

[[ -f "$TPL" ]] || die "Template $TPL not found."

sed -e "s|__DOMAIN__|_|g" \
    -e "s|__SSL_CERT__|$CERT_FILE|g" \
    -e "s|__SSL_KEY__|$KEY_FILE|g" \
    -e "s|__APP_PORT__|$APP_PORT|g" \
    "$TPL" > "$NGINX_CONF_AVAILABLE"

ln -sfn "$NGINX_CONF_AVAILABLE" "$NGINX_CONF_ENABLED"

# Remove default site to avoid port conflicts if present
if [[ -L /etc/nginx/sites-enabled/default ]]; then
    rm -f /etc/nginx/sites-enabled/default
fi

log "Testing Nginx configuration..."
nginx -t

# ------------------------------------------------------------------ FIREWALL
if command -v ufw >/dev/null 2>&1 && ufw status | grep -qw "active"; then
    log "Configuring UFW firewall rules for HTTP (80) and HTTPS (443)..."
    ufw allow 80/tcp >/dev/null 2>&1 || true
    ufw allow 443/tcp >/dev/null 2>&1 || true
fi

# ------------------------------------------------------------------ .ENV UPDATE
ENV_FILE="$APP_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
    log "Enforcing FORCE_HTTPS=1 in $ENV_FILE..."
    if grep -q "^FORCE_HTTPS=" "$ENV_FILE"; then
        sed -i 's/^FORCE_HTTPS=.*/FORCE_HTTPS=1/' "$ENV_FILE"
    else
        echo "FORCE_HTTPS=1" >> "$ENV_FILE"
    fi
fi

# ------------------------------------------------------------------ RESTART
log "Restarting $SERVICE_NAME and Nginx..."
systemctl restart "$SERVICE_NAME"
systemctl restart nginx

log "Verifying HTTPS endpoint..."
healthy=0
for _ in $(seq 1 15); do
    if curl -fsSL -k "https://127.0.0.1/api/settings" >/dev/null 2>&1; then
        healthy=1
        break
    fi
    sleep 1
done

if [[ "$healthy" -eq 1 ]]; then
    log "HTTPS reverse proxy verified successfully!"
else
    log "Warning: Health check did not respond immediately, check 'systemctl status nginx' and 'journalctl -u $SERVICE_NAME -n 30'."
fi

cat <<EOF

======================================================================
  [csrlinux] HTTPS SETUP COMPLETE
======================================================================
  HTTPS URL      : https://$TARGET_HOST
  Local Fallback : https://127.0.0.1
  HTTP (Port 80) : Automatically redirects (301) to HTTPS (Port 443)
  SSL Certificate: $CERT_FILE
  SSL Key        : $KEY_FILE

  NOTE FOR BROWSERS ON LAN (e.g., Chrome / Edge):
  Because this is a private LAN IP certificate, Chrome may show:
  "Your connection is not private" on first visit.
  - Simply click "Advanced" -> "Proceed to $TARGET_HOST (unsafe)".
  - Or download / copy '$CERT_FILE' to your PC and import it into
    "Trusted Root Certification Authorities" to get a clean green lock!
======================================================================
EOF
