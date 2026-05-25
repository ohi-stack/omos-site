# OMOS Deployment

## Runtime

This repository uses a lightweight Express runtime.

## Commands

npm install
npm run start
npm run smoke

## Hosting Targets

- VPS
- Railway
- Render
- Hostinger VPS
- Docker runtime

## Reverse Proxy

Recommended:
- NGINX
- Cloudflare proxy

## SSL

Use HTTPS only in production.

## Production Checklist

- Configure OMOS_API_KEY
- Enable logging
- Verify /health
- Verify /manifest
- Verify /dashboard
- Verify public routes
- Connect WordPress plugin manifest sync
- Connect commerce links
- Configure analytics

## Canonical Domain

https://omos.onegodian.com
