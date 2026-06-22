# YouGC Summer Camp

Cahier de vacances interactif pour les élèves YouGC Academy.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database

## Lancer le projet

```bash
npm install
npm run dev
```

## Variables d'environnement

Copier `.env.example` vers `.env.local` puis renseigner :

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase

Exécuter le fichier SQL suivant dans Supabase :

```text
supabase/schema.sql
```

L'authentification V1 utilise un lien de connexion par email.
