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

-- -----------------------------------------------------------------
-- 5. Open Mic slice — posts, replies, reactions
-- -----------------------------------------------------------------

-- is_crew flag on profiles (crew members can approve/reject posts)
alter table public.tmao_profiles
  add column if not exists is_crew boolean not null default false;

-- -----------------------------------------------------------------
-- 5a. tmao_posts
-- -----------------------------------------------------------------
create table if not exists public.tmao_posts (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid not null,
  body           text not null,
  status         text not null default 'pending',
  is_hot_take    boolean not null default false,
  hot_take_votes integer not null default 0,
  created_at     timestamptz not null default now(),

  constraint tmao_posts_author_profile_fk
    foreign key (author_id) references public.tmao_profiles(id) on delete cascade,
  constraint tmao_posts_body_length
    check (char_length(body) between 1 and 280),
  constraint tmao_posts_status_values
    check (status in ('pending', 'approved', 'rejected'))
);

alter table public.tmao_posts enable row level security;

drop policy if exists "TMAO posts viewable by public or own pending" on public.tmao_posts;
drop policy if exists "TMAO authenticated users can post"            on public.tmao_posts;
drop policy if exists "TMAO crew can update post status"             on public.tmao_posts;

create policy "TMAO posts viewable by public or own pending"
  on public.tmao_posts for select
  using (
    status = 'approved'
    or (auth.uid() = author_id)
  );

create policy "TMAO authenticated users can post"
  on public.tmao_posts for insert
  with check (
    auth.uid() is not null
    and auth.uid() = author_id
    and status = 'pending'
  );

create policy "TMAO crew can update post status"
  on public.tmao_posts for update
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- -----------------------------------------------------------------
-- 5b. tmao_replies
-- -----------------------------------------------------------------
create table if not exists public.tmao_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null,
  author_id  uuid not null,
  body       text not null,
  created_at timestamptz not null default now(),

  constraint tmao_replies_post_fk
    foreign key (post_id) references public.tmao_posts(id) on delete cascade,
  constraint tmao_replies_author_profile_fk
    foreign key (author_id) references public.tmao_profiles(id) on delete cascade,
  constraint tmao_replies_body_length
    check (char_length(body) between 1 and 280)
);

alter table public.tmao_replies enable row level security;

drop policy if exists "TMAO replies are publicly viewable" on public.tmao_replies;
drop policy if exists "TMAO authenticated users can reply" on public.tmao_replies;

create policy "TMAO replies are publicly viewable"
  on public.tmao_replies for select
  using (true);

create policy "TMAO authenticated users can reply"
  on public.tmao_replies for insert
  with check (
    auth.uid() is not null
    and auth.uid() = author_id
  );

-- -----------------------------------------------------------------
-- 5c. tmao_reactions
-- -----------------------------------------------------------------
create table if not exists public.tmao_reactions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid,
  reply_id   uuid,
  user_id    uuid not null,
  emoji      text not null,
  created_at timestamptz not null default now(),

  constraint tmao_reactions_post_fk
    foreign key (post_id) references public.tmao_posts(id) on delete cascade,
  constraint tmao_reactions_reply_fk
    foreign key (reply_id) references public.tmao_replies(id) on delete cascade,
  constraint tmao_reactions_user_fk
    foreign key (user_id) references public.tmao_profiles(id) on delete cascade,
  constraint tmao_reactions_unique
    unique (post_id, reply_id, user_id, emoji),
  constraint tmao_reactions_target_check
    check (
      (post_id is not null or reply_id is not null)
      and not (post_id is not null and reply_id is not null)
    )
);

alter table public.tmao_reactions enable row level security;

drop policy if exists "TMAO reactions are publicly viewable" on public.tmao_reactions;
drop policy if exists "TMAO users can add reactions"         on public.tmao_reactions;
drop policy if exists "TMAO users can remove own reactions"  on public.tmao_reactions;

create policy "TMAO reactions are publicly viewable"
  on public.tmao_reactions for select
  using (true);

create policy "TMAO users can add reactions"
  on public.tmao_reactions for insert
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
  );

create policy "TMAO users can remove own reactions"
  on public.tmao_reactions for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------
-- 5d. Hot Take vote function
--     Increments hot_take_votes; caller supplies post_id only.
--     Rate-limiting / dedup should be handled at the app layer.
-- -----------------------------------------------------------------
create or replace function public.tmao_vote_hot_take(p_post_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.tmao_posts
  set hot_take_votes = hot_take_votes + 1
  where id = p_post_id and status = 'approved';
end;
$$;

-- -----------------------------------------------------------------
-- 6. Episode Threads slice
-- -----------------------------------------------------------------

-- 6a. tmao_threads — one per episode, created by crew
create table if not exists public.tmao_threads (
  id           uuid primary key default gen_random_uuid(),
  episode_num  integer,
  title        text not null,
  description  text,
  embed_url    text,         -- SoundCloud / Spotify / etc.
  published_at timestamptz not null default now(),
  created_by   uuid not null,
  created_at   timestamptz not null default now(),

  constraint tmao_threads_creator_fk
    foreign key (created_by) references public.tmao_profiles(id) on delete set null
);

alter table public.tmao_threads enable row level security;

drop policy if exists "TMAO threads are publicly viewable"  on public.tmao_threads;
drop policy if exists "TMAO crew can create threads"        on public.tmao_threads;
drop policy if exists "TMAO crew can update threads"        on public.tmao_threads;

create policy "TMAO threads are publicly viewable"
  on public.tmao_threads for select
  using (true);

create policy "TMAO crew can create threads"
  on public.tmao_threads for insert
  with check (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

create policy "TMAO crew can update threads"
  on public.tmao_threads for update
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- 6b. tmao_thread_replies — community replies on a thread
create table if not exists public.tmao_thread_replies (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null,
  author_id  uuid not null,
  body       text not null,
  created_at timestamptz not null default now(),

  constraint tmao_thread_replies_thread_fk
    foreign key (thread_id) references public.tmao_threads(id) on delete cascade,
  constraint tmao_thread_replies_author_fk
    foreign key (author_id) references public.tmao_profiles(id) on delete cascade,
  constraint tmao_thread_replies_body_length
    check (char_length(body) between 1 and 280)
);

alter table public.tmao_thread_replies enable row level security;

drop policy if exists "TMAO thread replies are publicly viewable" on public.tmao_thread_replies;
drop policy if exists "TMAO users can reply to threads"           on public.tmao_thread_replies;

create policy "TMAO thread replies are publicly viewable"
  on public.tmao_thread_replies for select
  using (true);

create policy "TMAO users can reply to threads"
  on public.tmao_thread_replies for insert
  with check (
    auth.uid() is not null
    and auth.uid() = author_id
  );
