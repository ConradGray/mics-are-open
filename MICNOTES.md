# The Mics Are Open — Site Notes

## Overview
Full-stack community platform for The Mics Are Open podcast.
Built with Next.js 14 (App Router), Supabase (auth + database), Vercel (hosting), Tailwind CSS.

---

## Infrastructure

### Supabase
- Project lives under **StudioOs-crm** org (not a standalone project)
- Database: `tmao_profiles`, `tmao_posts`, `tmao_threads` tables
- RLS (Row Level Security) enabled on all tables
- Auth: email/password with confirmation email flow
- Service role key stored in Vercel as `SUPABASE_SERVICE_ROLE_KEY` (needed for admin user deletion and email lookup)

### Vercel
- Project: `mics-are-open` under `conradgrays-projects`
- Auto-deploys on push to `main`
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`

### Cloudflare Turnstile (CAPTCHA)
- Widget name: "Mics Are Open"
- Hostname: `themicsareopen.com`
- Mode: Managed (Recommended)
- Active on: Signup page and Open Mic PostComposer
- Only enforced when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (gracefully skipped in dev)

---

## Key Decisions & Architecture

### Photo naming (important!)
The host photo filenames were historically swapped:
- `public/hosts/andy2.jpg` = G Money's photo
- `public/hosts/andy3.jpg` = Andy's photo (headphones, sunglasses, gold chain)
Be careful if adding new host photos — don't rely on the filename to know whose photo it is.

### Git workflow
A `push-andy.sh` script in the project root handles git lock file issues.
Always update it before pushing a new set of changes:
```bash
bash push-andy.sh
```
The script clears `.git/*.lock` files before committing, which prevents "Another git process is running" errors.

### Admin panel
- Located at `/admin` — crew-only (requires `is_crew = true` in `tmao_profiles`)
- Uses server-side Supabase client for data fetching
- Admin client (`lib/supabase/admin.js`) uses service role key for privileged operations
- API routes for admin actions: `app/api/admin/delete-user/` and `app/api/admin/get-user-email/`

### CAPTCHA architecture
- `components/Turnstile.jsx` — client widget (loads Cloudflare script dynamically, no npm package)
- `app/api/verify-captcha/route.js` — server-side token verification
- Both signup and Open Mic verify the token server-side before any DB write

---

## Features Built

- Member signup with email confirmation
- Profile setup flow
- Open Mic — post, react, reply, Hot Take toggle
- Episode Threads — discussion per episode
- Admin dashboard:
  - Post moderation queue (pending/approved/rejected)
  - Hot Takes management with winner selection
  - Thread creation and management
  - Members list with email reveal and remove
  - Crew management (grant/revoke admin access)
- Privacy Policy page (`/privacy`) — compliant with Kenya Data Protection Act 2019
- Cloudflare Turnstile CAPTCHA on signup and Open Mic
- 7th anniversary callout on homepage

---

## Pending / Future Work

- Newsletter integration (recommended: Resend — resend.com)
  - Low complexity, ~2-3 hours
  - Need: subscriber table or opt-in flag, Resend API key, send-from-admin UI
- Consider adding email to members CSV export for competitions

---

## Contact
Site built by Conrad Gray — info@conradgray.com
