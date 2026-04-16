import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';

export default async function Nav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('tmao_profiles')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <header className="w-full border-b border-cream-200 bg-cream-50/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-bold text-ink-800 tracking-tight"
        >
          The Mics Are Open
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/me" className="btn-ghost text-sm">
                {profile?.display_name || 'My profile'}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                Join TMAO
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
