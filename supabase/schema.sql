-- The Mics Are Open — initial schema
-- This project SHARES a Supabase instance with StudioOS CRM.
-- Everything here is prefixed `tmao_` (tables, triggers, functions, bucket)
-- so it won't collide with StudioOS's own tables.
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

-- -----------------------------------------------------------------
-- 1. tmao_profiles table
-- -----------------------------------------------------------------
create table if not exists public.tmao_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  location      text,
  bio           text,          -- "why did you find TMAO?"
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- username constraint: 3–24 chars, lowercase alphanumerics + underscore
alter table public.tmao_profiles
  drop constraint if exists tmao_profiles_username_format;
alter table public.tmao_profiles
  add constraint tmao_profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,24}$');

-- auto-touch updated_at (TMAO-scoped function name to avoid collisions)
create or replace function public.tmao_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tmao_profiles_touch_updated_at on public.tmao_profiles;
create trigger tmao_profiles_touch_updated_at
  before update on public.tmao_profiles
  for each row execute function public.tmao_touch_updated_at();

-- -----------------------------------------------------------------
-- 2. auto-create a tmao_profiles row whenever a new auth user signs up
--
-- NOTE: auth.users is shared across all apps in this Supabase project.
-- StudioOS may already have its own on-signup trigger — leave it alone,
-- ours uses a distinct name and only touches tmao_profiles.
-- -----------------------------------------------------------------
create or replace function public.tmao_handle_new_user()
returns trigger as $$
begin
  insert into public.tmao_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created_tmao on auth.users;
create trigger on_auth_user_created_tmao
  after insert on auth.users
  for each row execute function public.tmao_handle_new_user();

-- -----------------------------------------------------------------
-- 3. Row-level security
-- -----------------------------------------------------------------
alter table public.tmao_profiles enable row level security;

drop policy if exists "TMAO profiles are viewable by everyone" on public.tmao_profiles;
drop policy if exists "TMAO users can insert their own profile" on public.tmao_profiles;
drop policy if exists "TMAO users can update their own profile" on public.tmao_profiles;

create policy "TMAO profiles are viewable by everyone"
  on public.tmao_profiles for select
  using (true);

create policy "TMAO users can insert their own profile"
  on public.tmao_profiles for insert
  with check (auth.uid() = id);

create policy "TMAO users can update their own profile"
  on public.tmao_profiles for update
  using (auth.uid() = id);

-- -----------------------------------------------------------------
-- 4. Avatar storage bucket (tmao-avatars, separate from any StudioOS bucket)
-- -----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('tmao-avatars', 'tmao-avatars', true)
on conflict (id) do nothing;

drop policy if exists "TMAO avatar images are publicly accessible" on storage.objects;
drop policy if exists "TMAO users can upload their own avatar"    on storage.objects;
drop policy if exists "TMAO users can update their own avatar"    on storage.objects;

create policy "TMAO avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'tmao-avatars');

create policy "TMAO users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'tmao-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "TMAO users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'tmao-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
