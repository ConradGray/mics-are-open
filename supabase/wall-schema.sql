-- The Mics Are Open — The Wall schema
-- Adds: posts, replies, and emoji reactions.
-- All tables prefixed `tmao_` per project convention.
--
-- Run this in the Supabase SQL Editor AFTER the initial schema.

-- -----------------------------------------------------------------
-- 1. tmao_posts — the main Wall feed
-- -----------------------------------------------------------------
create table if not exists public.tmao_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null
                references auth.users(id) on delete cascade,
  body        text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Explicit FK to tmao_profiles so Supabase PostgREST can resolve joins
-- (the auth.users FK alone isn't enough — PostgREST needs a direct path)
alter table public.tmao_posts
  drop constraint if exists tmao_posts_author_profile_fk;
alter table public.tmao_posts
  add constraint tmao_posts_author_profile_fk
  foreign key (author_id) references public.tmao_profiles(id) on delete cascade;

-- body must be 1–280 characters
alter table public.tmao_posts
  drop constraint if exists tmao_posts_body_length;
alter table public.tmao_posts
  add constraint tmao_posts_body_length
  check (char_length(body) between 1 and 280);

-- index for feed queries (approved, newest first)
create index if not exists tmao_posts_feed_idx
  on public.tmao_posts (status, created_at desc);

-- auto-touch updated_at (reuse existing tmao_touch_updated_at function)
drop trigger if exists tmao_posts_touch_updated_at on public.tmao_posts;
create trigger tmao_posts_touch_updated_at
  before update on public.tmao_posts
  for each row execute function public.tmao_touch_updated_at();

-- RLS
alter table public.tmao_posts enable row level security;

drop policy if exists "TMAO approved posts are viewable by everyone" on public.tmao_posts;
create policy "TMAO approved posts are viewable by everyone"
  on public.tmao_posts for select
  using (status = 'approved');

drop policy if exists "TMAO authors can view their own posts" on public.tmao_posts;
create policy "TMAO authors can view their own posts"
  on public.tmao_posts for select
  using (auth.uid() = author_id);

drop policy if exists "TMAO authenticated users can create posts" on public.tmao_posts;
create policy "TMAO authenticated users can create posts"
  on public.tmao_posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "TMAO authors can delete their own posts" on public.tmao_posts;
create policy "TMAO authors can delete their own posts"
  on public.tmao_posts for delete
  using (auth.uid() = author_id);


-- -----------------------------------------------------------------
-- 2. tmao_replies — threaded replies on posts
-- -----------------------------------------------------------------
create table if not exists public.tmao_replies (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.tmao_posts(id) on delete cascade,
  author_id   uuid not null
                references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz default now()
);

-- Explicit FK to tmao_profiles for PostgREST join resolution
alter table public.tmao_replies
  drop constraint if exists tmao_replies_author_profile_fk;
alter table public.tmao_replies
  add constraint tmao_replies_author_profile_fk
  foreign key (author_id) references public.tmao_profiles(id) on delete cascade;

alter table public.tmao_replies
  drop constraint if exists tmao_replies_body_length;
alter table public.tmao_replies
  add constraint tmao_replies_body_length
  check (char_length(body) between 1 and 280);

create index if not exists tmao_replies_post_idx
  on public.tmao_replies (post_id, created_at asc);

-- RLS
alter table public.tmao_replies enable row level security;

drop policy if exists "TMAO replies are viewable by everyone" on public.tmao_replies;
create policy "TMAO replies are viewable by everyone"
  on public.tmao_replies for select
  using (true);

drop policy if exists "TMAO authenticated users can reply" on public.tmao_replies;
create policy "TMAO authenticated users can reply"
  on public.tmao_replies for insert
  with check (auth.uid() = author_id);

drop policy if exists "TMAO authors can delete their own replies" on public.tmao_replies;
create policy "TMAO authors can delete their own replies"
  on public.tmao_replies for delete
  using (auth.uid() = author_id);


-- -----------------------------------------------------------------
-- 3. tmao_reactions — emoji reactions on posts AND replies
-- -----------------------------------------------------------------
create table if not exists public.tmao_reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  post_id     uuid references public.tmao_posts(id) on delete cascade,
  reply_id    uuid references public.tmao_replies(id) on delete cascade,
  emoji       text not null,
  created_at  timestamptz default now(),

  -- must react to exactly one thing (post or reply, not both)
  constraint tmao_reactions_target_check
    check (
      (post_id is not null and reply_id is null) or
      (post_id is null and reply_id is not null)
    ),
  -- one reaction type per user per target
  constraint tmao_reactions_unique_post
    unique (user_id, post_id, emoji),
  constraint tmao_reactions_unique_reply
    unique (user_id, reply_id, emoji)
);

-- constrain emoji to a curated set
alter table public.tmao_reactions
  drop constraint if exists tmao_reactions_emoji_set;
alter table public.tmao_reactions
  add constraint tmao_reactions_emoji_set
  check (emoji in ('❤️', '🔥', '😂', '🎯', '💯', '🙌'));

create index if not exists tmao_reactions_post_idx
  on public.tmao_reactions (post_id) where post_id is not null;
create index if not exists tmao_reactions_reply_idx
  on public.tmao_reactions (reply_id) where reply_id is not null;

-- RLS
alter table public.tmao_reactions enable row level security;

drop policy if exists "TMAO reactions are viewable by everyone" on public.tmao_reactions;
create policy "TMAO reactions are viewable by everyone"
  on public.tmao_reactions for select
  using (true);

drop policy if exists "TMAO authenticated users can react" on public.tmao_reactions;
create policy "TMAO authenticated users can react"
  on public.tmao_reactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "TMAO users can remove their own reactions" on public.tmao_reactions;
create policy "TMAO users can remove their own reactions"
  on public.tmao_reactions for delete
  using (auth.uid() = user_id);
