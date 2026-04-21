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

