# Checklist déploiement Sudoku Quest

## 1. GitHub

1. Pousser le code sur `https://github.com/hrahier07-hash/Leaapp`
2. Vérifier que la CI passe (lint + tests)

## 2. Vercel

1. Importer le repo sur [vercel.com/new](https://vercel.com/new)
2. Framework : Next.js
3. Build command : `prisma generate && prisma migrate deploy && next build`

## 3. Base de données

1. Ajouter **Vercel Postgres** (ou Neon) depuis le dashboard Vercel
2. Copier `DATABASE_URL` dans les variables d'environnement

## 4. Redis

1. Ajouter **Upstash Redis** depuis le marketplace Vercel
2. Copier `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`

## 5. Variables d'environnement

Configurer en Production et Preview :

- `DATABASE_URL`
- `NEXTAUTH_URL` (URL Vercel)
- `NEXTAUTH_SECRET` (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY` / `EMAIL_FROM`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CRON_SECRET`

## 6. Migrations et seed

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## 7. Cron Vercel

Ajouter dans `vercel.json` :

```json
{
  "crons": [
    { "path": "/api/cron/leagues", "schedule": "0 6 * * 1" },
    { "path": "/api/cron/streak-reminder", "schedule": "0 20 * * *" }
  ]
}
```

## 8. Vérifications post déploiement

- [ ] Landing `/` OK
- [ ] Dashboard `/app` OK
- [ ] Jeu `/app/jouer` OK
- [ ] API `/api/health` OK
- [ ] Migrations appliquées
