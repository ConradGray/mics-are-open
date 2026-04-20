import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminQueue from './AdminQueue';
import ThreadCreateForm from './ThreadCreateForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — The Mics Are Open',
};

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/admin');

  // Check crew status
  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('is_crew')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_crew) redirect('/');

  const POST_SELECT = `
    id, body, status, created_at, author_id,
    is_hot_take, is_hot_take_winner,
    tmao_profiles!tmao_posts_author_profile_fk (
      username, display_name, avatar_url
    )
  `;

  const { data: pending } = await supabase
    .from('tmao_posts')
    .select(POST_SELECT)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  const { data: approved } = await supabase
    .from('tmao_posts')
    .select(POST_SELECT)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: rejected } = await supabase
    .from('tmao_posts')
    .select(POST_SELECT)
    .eq('status', 'rejected')
    .order('created_at', { ascending: false })
    .limit(30);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="uppercase tracking-[0.25em] text-xs font-semibold text-clay-500 mb-2">
          Crew only
        </p>
        <h1 className="font-display text-4xl font-bold text-ink-800">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-ink-500">
          Review posts, approve what goes live, and keep the community feeling right.
        </p>
      </div>

      <ThreadCreateForm userId={user.id} />

      <AdminQueue
        pending={pending || []}
        approved={approved || []}
        rejected={rejected || []}
      />
    </div>
  );
}
