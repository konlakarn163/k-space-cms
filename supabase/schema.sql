create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin', 'super_admin')),
  updated_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'admin', 'super_admin'));

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  image_url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_tags_gin_idx on public.posts using gin(tags);
create index if not exists comments_post_idx on public.comments(post_id, created_at asc);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;

create policy "profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "user can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "user can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "posts view for everyone"
on public.posts for select
using (true);

create policy "members create own posts"
on public.posts for insert
with check (auth.uid() = author_id);

create policy "owners update own posts"
on public.posts for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "owners delete own posts"
on public.posts for delete
using (auth.uid() = author_id);

create policy "comments read for everyone"
on public.comments for select
using (true);

create policy "members create own comments"
on public.comments for insert
with check (auth.uid() = user_id);

create policy "owners update own comments"
on public.comments for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "owners delete own comments"
on public.comments for delete
using (auth.uid() = user_id);

create policy "votes read for everyone"
on public.votes for select
using (true);

create policy "members vote as self"
on public.votes for insert
with check (auth.uid() = user_id);

create policy "members update own vote"
on public.votes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "members delete own vote"
on public.votes for delete
using (auth.uid() = user_id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, username, avatar_url)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update
    set username = excluded.username,
        avatar_url = excluded.avatar_url,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

-- ---------------------------------------------------------
-- Storage bucket + RLS (post-images)
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

drop policy if exists "public can read post images" on storage.objects;
create policy "public can read post images"
on storage.objects for select
using (bucket_id = 'post-images');

drop policy if exists "authenticated users upload own folder" on storage.objects;
create policy "authenticated users upload own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (auth.uid())::text
);

drop policy if exists "authenticated users update own folder" on storage.objects;
create policy "authenticated users update own folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (auth.uid())::text
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (auth.uid())::text
);

drop policy if exists "authenticated users delete own folder" on storage.objects;
create policy "authenticated users delete own folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (auth.uid())::text
);

-- ─── Master Tags ─────────────────────────────────────────────────────────────
create table if not exists public.master_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  constraint master_tags_name_unique unique (name)
);

alter table public.master_tags enable row level security;

-- everyone can read
drop policy if exists "Anyone can read tags" on public.master_tags;
create policy "Anyone can read tags"
  on public.master_tags for select
  using (true);

-- authenticated users can insert
drop policy if exists "Auth users can create tags" on public.master_tags;
create policy "Auth users can create tags"
  on public.master_tags for insert
  to authenticated
  with check (true);

-- authenticated users can update
drop policy if exists "Auth users can update tags" on public.master_tags;
create policy "Auth users can update tags"
  on public.master_tags for update
  to authenticated
  using (true);

-- authenticated users can delete
drop policy if exists "Auth users can delete tags" on public.master_tags;
create policy "Auth users can delete tags"
  on public.master_tags for delete
  to authenticated
  using (true);

