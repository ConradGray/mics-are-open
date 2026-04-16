'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <button onClick={handleSignOut} className="btn-ghost text-sm">
      Sign out
    </button>
  );
}
