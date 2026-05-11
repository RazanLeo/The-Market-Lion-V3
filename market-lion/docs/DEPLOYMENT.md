# Deploying to Digital Ocean (App Platform or Droplet)

There are two recommended paths.

## Option A — App Platform (easiest, recommended)
1. Push this repo to GitHub: https://github.com/RazanLeo/The-Market-Lion-V3
2. In Digital Ocean → **Apps → Create App**, choose this GitHub repo, branch `main`.
3. App Spec (auto-detected: Next.js / Node 22). Build: `npm ci && npm run build`. Run: `npm start`.
4. Add a managed Postgres database in the same app and set:
   - `DATABASE_URL` = (the connection string DO gives you)
   - `NEXTAUTH_SECRET` = a long random string
   - `NEXTAUTH_URL` = `https://YOUR-APP-DOMAIN`
5. Run: `npx prisma migrate deploy`.

## Option B — Droplet + Nginx + PM2 (existing droplet)
SSH into the droplet:
```bash
ssh root@YOUR_DROPLET_IP
apt-get update && apt-get install -y nodejs npm git nginx postgresql certbot python3-certbot-nginx
npm i -g pm2

# clean any old app
mkdir -p /var/www && cd /var/www
rm -rf market-lion
git clone https://github.com/RazanLeo/The-Market-Lion-V3 market-lion
cd market-lion/market-lion
cp .env.example .env  # then edit DATABASE_URL + NEXTAUTH_SECRET
npm ci
npx prisma migrate deploy
npm run build
pm2 start npm --name market-lion -- start
pm2 save && pm2 startup

# nginx
cat >/etc/nginx/sites-available/market-lion <<'NGX'
server {
  server_name themarketlion.com www.themarketlion.com;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; }
}
NGX
ln -s /etc/nginx/sites-available/market-lion /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d themarketlion.com -d www.themarketlion.com --redirect
```
