# K-Space CMS

Modern community CMS built with Next.js + Supabase + Node.js Express API.

The API may experience latency due to the use of an online database, which might involve sleep intervals while waiting for processes to complete.
DEMO https://k-space-cms.konlakarn.space/

## Features

- Authentication: Email/Password + Google + GitHub OAuth via Supabase
- Profile auto-sync: first login syncs `display name` and `avatar` to `profiles`
- Email conflict guard: checks email uniqueness across signup and OAuth users
- Role-based content: public read, member create/comment/vote, owner edit/delete
- Feed UX: search + tag filter + infinite scroll + optimistic vote/comment
- Rich content: Tiptap editor for post body
- Media handling: cover/inline upload via backend API (service role) to Supabase Storage + `next/image` optimization

## Project Structure

- `src/` → Next.js frontend
- `backend/` → Node.js Express API (`routes/controllers/services`)
- `supabase/schema.sql` → database schema + RLS + profile trigger

## 1) Supabase Setup

1. Create a Supabase project
2. Enable Auth providers: Email, Google, GitHub
3. Create storage bucket: `post-images` (public bucket)
4. Run SQL from `supabase/schema.sql`

### Storage Unauthorized (RLS) fix

Upload now goes through backend (`POST /api/storage/upload`) with `requireAuth` + service role,
so it no longer depends on client-side `storage.objects` RLS policy correctness.

If you still get `Unauthorized`, check:

1. Access token is valid (re-login)
2. Backend is running and reachable from frontend
3. `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `backend/.env`

## 2) Environment Variables

### Frontend (`.env.local`)

Use `.env.example` as template:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)

Use `backend/.env.example` as template:

```bash
API_PORT=4000
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STORAGE_BUCKET=post-images
```

## 3) Run Locally

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`

## 4) Deployment (Vercel + Subdomain)

1. Push repository to GitHub
2. Import project to Vercel
3. Add frontend env vars in Vercel project settings
4. Deploy backend separately (Railway/Render/Fly/VM) and set `NEXT_PUBLIC_API_URL`
5. Add custom domain `community.konlakarn.space` in Vercel
6. Point DNS CNAME for `community` to Vercel target

## API Notes

- `GET /api/auth/check-email?email=...` → used before signup to avoid duplicate email
- `POST /api/profile/sync` → sync profile from current auth user
- `GET/POST/PATCH/DELETE /api/posts` + comments + votes endpoints for feed CRUD
- `POST /api/storage/upload` → authenticated image upload proxy to Supabase Storage

## Validation

- Frontend lint: `npm run lint`
- Backend requires env vars to start (`SUPABASE_URL`, keys, etc.)
