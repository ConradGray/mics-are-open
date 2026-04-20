import Link from 'next/link';
import Image from 'next/image';
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
      .select('username, display_name, avatar_url, is_crew')
      .eq('id', user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <header className="w-full border-b-2 border-clay-500 bg-cream-50/95 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-6 h-16">

        {/* Logos */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo-tmao.png"
            alt="The Mics Are Open"
            width={220}
            height={50}
            className="h-11 w-auto"
            priority
          />
          <span className="w-px h-6 bg-cream-200 hidden sm:block" />
          <Image
            src="/logo-tgc.png"
            alt="The Good Company"
            width={80}
            height={40}
            className="h-7 w-auto opacity-70 hover:opacity-100 transition hidden sm:block"
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link href="/about" className="btn-ghost text-sm py-2 px-4">About</Link>
          <Link href="/open-mic" className="btn-ghost text-sm py-2 px-4">Open Mic</Link>
          <Link href="/threads" className="btn-ghost text-sm py-2 px-4">Threads</Link>
          <Link href="/listen" className="btn-ghost text-sm py-2 px-4">Listen</Link>

          {/* Divider before auth actions */}
          <span className="w-px h-5 bg-cream-200 mx-2" />

          {user ? (
            <>
              {profile?.is_crew && (
                <Link
                  href="/admin"
                  className="btn-ghost text-sm py-2 px-4 text-clay-500 border-clay-500/30"
                >
                  Admin
                </Link>
              )}
              <Link href="/me" className="btn-ghost text-sm py-2 px-4">
                {profile?.display_name || 'My Profile'}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm py-2 px-4">Log in</Link>
              <Link href="/signup" className="btn-primary text-sm py-2 px-5">Join TMAO</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
