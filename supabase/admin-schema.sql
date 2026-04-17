-- The Mics Are Open — Admin / Crew schema additions
-- Adds: is_crew flag on profiles + RLS policies for crew moderation.
--
-- Run this in the Supabase SQL Editor AFTER the wall-schema.sql.

-- -----------------------------------------------------------------
-- 1. Add is_crew flag to tmao_profiles
-- -----------------------------------------------------------------
alter table public.tmao_profiles
  add column if not exists is_crew boolean not null default false;

-- -----------------------------------------------------------------
-- 2. Crew can view ALL posts (including pending + rejected)
-- -----------------------------------------------------------------
drop policy if exists "TMAO crew can view all posts" on public.tmao_posts;
create policy "TMAO crew can view all posts"
  on public.tmao_posts for select
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- -----------------------------------------------------------------
-- 3. Crew can update post status (approve / reject)
-- -----------------------------------------------------------------
drop policy if exists "TMAO crew can update post status" on public.tmao_posts;
create policy "TMAO crew can update post status"
  on public.tmao_posts for update
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- -----------------------------------------------------------------
-- 4. Crew can delete any post
-- -----------------------------------------------------------------
drop policy if exists "TMAO crew can delete any post" on public.tmao_posts;
create policy "TMAO crew can delete any post"
  on public.tmao_posts for delete
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- -----------------------------------------------------------------
-- 5. Crew can delete any reply (moderation)
-- -----------------------------------------------------------------
drop policy if exists "TMAO crew can delete any reply" on public.tmao_replies;
create policy "TMAO crew can delete any reply"
  on public.tmao_replies for delete
  using (
    exists (
      select 1 from public.tmao_profiles
      where id = auth.uid() and is_crew = true
    )
  );

-- -----------------------------------------------------------------
-- After running this, flag yourself as crew:
--
--   update tmao_profiles
--   set is_crew = true
--   where username = 'your_username_here';
-- -----------------------------------------------------------------
