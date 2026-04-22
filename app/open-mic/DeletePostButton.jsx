'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [acting, setActing] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Delete this post permanently?')) return;
    setActing(true);
    const { error } = await supabase.from('tmao_posts').delete().eq('id', postId);
    if (error) { console.error(error); setActing(false); return; }
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={handleDelete}
      disabled={acting || isPending}
      className="text-xs text-ink-400 hover:text-red-500 transition disabled:opacity-40"
    >
      {acting ? 'Deleting…' : 'Delete'}
    </button>
  );
}
