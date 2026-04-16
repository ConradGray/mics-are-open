# The Mics Are Open

A listener community platform for the TMAO podcast. Listeners make profiles, post on The Wall, respond to episodes, and shoutout people in their lives.

**This first slice:** authentication + listener profiles. Everything else is scaffolded in the brief and will be layered on iteratively.

## Tech stack

- **Next.js 14** (App Router, JavaScript)
- **Supabase** for auth, database, and avatar storage — sharing the existing **StudioOS** project (free-tier slot constraint)
- **Tailwind CSS** for styling (warm "cozy living room" palette)

## Sharing the StudioOS Supabase project

TMAO is piggy-backing on the StudioOS Supabase project because the free tier is capped at two projects (the other is G-MONEY). To keep the two apps from stepping on each other:

- All TMAO tables are prefixed `tmao_` (e.g. `tmao_profiles`)
- The avatar storage bucket is `tmao-avatars`
- Trigger and function names are prefixed `tmao_` as well
- StudioOS tables, triggers, and buckets are left completely alone

One thing to be aware of: `auth.users` is shared. If you sign up for TMAO, that same email/password works against StudioOS's auth, and vice versa. That's actually fine — one listener identity, two apps — but it's worth knowing.

## What works so far

- Email + password signup and login
- Session handling via Supabase SSR cookies
- Protected routes (middleware redirects unauthenticated users to `/login`)
- Profile setup: name, username, location, photo, one-line bio
- Public profile pages at `/u/<username>`
- `/me` redirects to your own profile (or to setup if you haven't made one)

## Get it running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Grab the StudioOS anon key

1. Open the StudioOS project in the Supabase dashboard:
   [https://supabase.com/dashboard/project/tqepekykjwrcefqnsyrw/settings/api](https://supabase.com/dashboard/project/tqepekykjwrcefqnsyrw/settings/api)
2. Copy the **anon public** API key. (The URL is already pre-filled in `.env.local.example`.)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste the anon key in.

### 4. Apply the TMAO schema

1. In the StudioOS Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` and run it.

The SQL is idempotent and prefixed, so running it won't touch any existing StudioOS tables. It creates:

- `public.tmao_profiles`
- `tmao_touch_updated_at()` and its trigger on `tmao_profiles`
- `tmao_handle_new_user()` + `on_auth_user_created_tmao` trigger on `auth.users`
- RLS policies scoped to `tmao_profiles`
- The public `tmao-avatars` storage bucket and its policies

### 5. (Optional) Turn off email confirmation for faster local dev

1. In Supabase, go to **Authentication → Providers → Email**.
2. Toggle **"Confirm email"** off.
3. You can now sign up and be logged in immediately — no email round-trip.

This is a project-wide setting, so it affects StudioOS too. Flip it back on before you ship anything for real.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder shape

```
app/
  layout.jsx              root layout + nav + footer
  page.jsx                landing page
  globals.css             Tailwind + fonts + design tokens
  signup/page.jsx         email/password signup
  login/page.jsx          email/password login
  auth/callback/route.js  handles email-confirmation redirects
  me/page.jsx             redirects to your own public profile
  profile/setup/          profile create/edit form
  u/[username]/           public profile page
components/
  Nav.jsx                 top navigation (server component)
  SignOutButton.jsx       client button that signs out
lib/
  supabase/
    client.js             browser Supabase client
    server.js             server Supabase client (RSCs, route handlers)
    middleware.js         session refresh + route guards
middleware.js             Next.js middleware entrypoint
supabase/
  schema.sql              one-shot SQL to set up the TMAO tables
```

## Next up (per the project brief)

1. ~~Authentication and profiles~~ ← you are here
2. **The Wall** — a rolling listener feed (will be `tmao_posts`)
3. **Episode threads** — per-episode discussion pages (`tmao_episodes` + `tmao_comments`)
4. **Message to the Crew** — private submission form (`tmao_crew_messages`)
5. **Shoutouts Board** — public wall of appreciation (`tmao_shoutouts`)
6. **Admin dashboard** — crew tools for curating submissions

Every new table will keep the `tmao_` prefix so StudioOS stays untouched.

## Design notes

The palette is warm and community-feeling: cream backgrounds, clay accents (the rust-orange), sage greens as a secondary. Fraunces (display serif) for headlines, Inter for body. The whole thing should feel more like a living room than a dashboard.
