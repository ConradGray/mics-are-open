import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ThreadsPage() {
  const supabase = createClient();

  const { data: thread } = await supabase
    .from('tmao_threads')
    .select('id')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (thread) {
    redirect(`/threads/${thread.id}`);
  }

  // No threads yet — show placeholder
  redirect('/threads/all');
}
