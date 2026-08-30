# Sudoku Quest

Application web de Sudoku gamifiée, inspirée de Duolingo : parcours pédagogique de techniques de résolution, XP, streaks, ligues et mascotte.

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| UI | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| State client | Zustand |
| Base de données | PostgreSQL (Vercel Postgres / Neon) + Prisma |
| Auth | Auth.js (NextAuth v5) — Google + magic link |
| Cache / temps réel | Upstash Redis |
| Tests | Vitest (logique) + Playwright (E2E) |
| Déploiement | Vercel |

## Prérequis

- Node.js 20+
- npm 10+
- Compte PostgreSQL (local, Neon ou Vercel Postgres)

## Installation locale

```bash
git clone <url-du-repo> sudoku-quest
cd sudoku-quest
npm install
cp .env.example .env.local
# Renseigner les variables dans .env.local
npx prisma generate
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et renseignez les valeurs :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL (`postgresql://...`) |
| `NEXTAUTH_URL` | URL de l'app (`http://localhost:3000` en dev) |
| `NEXTAUTH_SECRET` | Secret pour signer les sessions (générer avec `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `EMAIL_SERVER` | SMTP ou API email (magic link) |
| `EMAIL_FROM` | Adresse expéditeur |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST Upstash Redis |

## Commandes

```bash
npm run dev          # Serveur de développement (Turbopack)
npm run build        # Build production
npm run start        # Démarrer le build production
npm run lint         # ESLint
npm run db:generate  # Générer le client Prisma
npm run db:migrate   # Appliquer les migrations (dev)
npm run db:studio    # Interface Prisma Studio
npm run test         # Tests Vitest (étape 1+)
npm run test:e2e     # Tests Playwright (étape 13)
```

## Structure du projet

```
app/
  (marketing)/     # Landing, login, onboarding
  (app)/           # App authentifiée (dashboard, jeu, profil)
  api/             # Routes API
components/
  ui/              # shadcn/ui
  game/            # Grille Sudoku
  gamification/    # XP, streak, mascotte
lib/
  sudoku/          # Moteur Sudoku
  gamification/    # Logique XP, ligues
  db/              # Client Prisma
prisma/
  schema.prisma
store/             # Stores Zustand
types/
```

## Déploiement Vercel

1. Pousser le code sur GitHub
2. Importer le repo dans Vercel
3. Provisionner **Vercel Postgres** et **Upstash Redis** depuis le dashboard
4. Configurer toutes les variables d'environnement (Production + Preview)
5. Build command : `prisma generate && prisma migrate deploy && next build`

Voir `CHECKLIST_DEPLOIEMENT.md` (étape 13) pour le guide détaillé.

## Licence

Projet privé — tous droits réservés.
