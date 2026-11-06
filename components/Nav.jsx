import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';
import MobileMenu from './MobileMenu';

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
    <header className="w-full border-b border-[#26262A] bg-[#0A0A0B] sticky top-0 z-30">
      <nav className="wrap flex items-center justify-between gap-4 h-[76px] lg:h-24">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-tmao.png"
            alt="The Mics Are Open"
            width={340}
            height={80}
            className="h-[52px] lg:h-[72px] w-auto"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/about" className="btn-nav">About</Link>
          <Link href="/open-mic" className="btn-nav">Open Mic</Link>
          <Link href="/threads" className="btn-nav">Threads</Link>
          <Link href="/listen" className="btn-nav">Listen</Link>

          <span className="w-px h-5 bg-[#26262A] mx-2" />

          {user ? (
            <>
              {profile?.is_crew && (
                <Link href="/admin" className="btn-nav">Admin</Link>
              )}
              <Link href="/me" className="btn-nav">
                {profile?.display_name || 'My Profile'}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-nav opacity-80">Log in</Link>
              <Link href="/signup" className="btn-primary py-3 px-4 text-xs tracking-[0.24em]">Join TMAO</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu user={user} profile={profile} />
      </nav>
    </header>
  );
}
