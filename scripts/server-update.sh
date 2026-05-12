#!/usr/bin/env bash
# Run this on the server to update and rebuild the Market Lion app
# Usage: bash /var/www/market-lion/scripts/server-update.sh
set -euo pipefail

APP_DIR="/var/www/market-lion"
echo "==> Pulling latest code..."
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main

echo "==> Rebuilding app container..."
docker compose build --no-cache app

echo "==> Restarting..."
docker compose up -d --remove-orphans

echo "==> Migrations..."
sleep 8
docker compose exec -T app sh -c 'npx prisma migrate deploy 2>/dev/null || npx prisma db push 2>/dev/null || true'

echo "==> Health check..."
sleep 3
curl -sf http://127.0.0.1/api/health && echo " healthy"
echo "==> Done! http://161.35.192.36"
