'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MobileMenu({ user, profile }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <div className="sm:hidden relative">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-clay-500/10 transition"
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-0.5 bg-clay-500 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-clay-500 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-clay-500 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed top-16 left-0 right-0 bg-cream-50 border-b-2 border-clay-500 z-50 px-6 py-4 flex flex-col gap-2">
          <Link href="/about" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">About</Link>
          <Link href="/open-mic" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">Open Mic</Link>
          <Link href="/threads" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">Threads</Link>
          <Link href="/listen" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">Listen</Link>
          <div className="w-full h-px bg-clay-500/20 my-1" />
          {user ? (
            <>
              {profile?.is_crew && (
                <Link href="/admin" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">Admin</Link>
              )}
              <Link href="/me" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">
                {profile?.display_name || 'My Profile'}
              </Link>
              <button onClick={handleSignOut} className="btn-nav justify-center py-3">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="btn-nav justify-center py-3">Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary justify-center py-3">Join TMAO</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
