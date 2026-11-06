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
    <div className="lg:hidden relative">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="border-2 border-white text-white font-bold text-[11px] leading-none uppercase tracking-[0.28em] px-3 py-2.5 hover:border-clay-500 hover:text-clay-500 transition"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed top-[76px] left-5 right-5 bg-[#141416] border border-[#26262A] z-50 py-2 flex flex-col">
          <Link href="/about" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">About</Link>
          <Link href="/open-mic" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Open Mic</Link>
          <Link href="/threads" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Threads</Link>
          <Link href="/listen" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Listen</Link>
          
          {user ? (
            <>
              {profile?.is_crew && (
                <Link href="/admin" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Admin</Link>
              )}
              <Link href="/me" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">
                {profile?.display_name || 'My Profile'}
              </Link>
              <button onClick={handleSignOut} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="px-5 py-3.5 font-extrabold uppercase tracking-[0.2em] text-[13px] text-white border-b border-[#26262A] hover:text-clay-500 text-left">Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary mx-3 mt-2 mb-1">Join TMAO</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
