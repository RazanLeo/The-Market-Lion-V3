#!/usr/bin/env bash
# One-shot deployment script for The Market Lion on a fresh Ubuntu+Docker droplet.
# Run as root (DO Web Console is root).
set -euo pipefail

REPO_URL="https://github.com/RazanLeo/The-Market-Lion-V3.git"
APP_DIR="/var/www/market-lion"

echo "==> 1) Updating apt and ensuring docker + compose are present"
apt-get update -y
apt-get install -y git curl ca-certificates
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
docker --version
docker compose version || apt-get install -y docker-compose-plugin

echo "==> 2) Cleaning old deployments"
mkdir -p /var/www
rm -rf "$APP_DIR"
# Best-effort cleanup of older containers
docker ps -a --format '{{.Names}}' | grep -E 'market[-_]?lion' | xargs -r docker rm -f || true

echo "==> 3) Cloning the latest code from GitHub"
git clone --depth=1 "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "==> 4) Generating a random NEXTAUTH_SECRET"
SECRET=$(openssl rand -hex 32)
sed -i "s|change_this_to_a_long_random_string_in_production|${SECRET}|g" docker-compose.yml

echo "==> 5) Building & starting the stack (this can take 3-5 minutes the first time)"
docker compose up -d --build

echo "==> 6) Running database migrations"
sleep 8
docker compose exec -T app sh -lc 'npx prisma migrate deploy || npx prisma db push' || true

echo "==> 7) Health check"
sleep 2
curl -sf http://127.0.0.1/api/health && echo " ✅ healthy"

PUBLIC_IP=$(curl -s ifconfig.me || echo "your-droplet-ip")
echo
echo "==================================================="
echo "🦁  The Market Lion is now live at: http://${PUBLIC_IP}"
echo "    Admin:     http://${PUBLIC_IP}/admin"
echo "    Dashboard: http://${PUBLIC_IP}/dashboard"
echo "==================================================="
