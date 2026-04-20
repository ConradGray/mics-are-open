import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Crew Dashboard — The Mics Are Open',
};

export default async function AdminPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('is_crew, display_name')
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

  // Fetch all queues in parallel
  const [
    { data: pending },
    { data: approved },
    { data: rejected },
    { data: hotTakes },
    { data: threads },
    { data: allUsers },
    { data: spotlightRow },
  ] = await Promise.all([
    supabase.from('tmao_posts').select(POST_SELECT).eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('tmao_posts').select(POST_SELECT).eq('status', 'approved').order('created_at', { ascending: false }).limit(50),
    supabase.from('tmao_posts').select(POST_SELECT).eq('status', 'rejected').order('created_at', { ascending: false }).limit(30),
    supabase.from('tmao_posts').select(POST_SELECT).eq('status', 'approved').eq('is_hot_take', true).order('created_at', { ascending: false }),
    supabase.from('tmao_threads').select('id, episode_num, title, description, embed_url, published_at, created_by').order('published_at', { ascending: false }),
    supabase.from('tmao_profiles').select('id, username, display_name, avatar_url, is_crew').order('display_name', { ascending: true }),
    supabase.from('tmao_spotlight').select('profile_id').eq('id', 1).maybeSingle(),
  ]);

  const crew = (allUsers || []).filter(u => u.is_crew);

  // Stats: approved in the last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: approvedThisWeek } = await supabase
    .from('tmao_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved')
    .gte('created_at', weekAgo);

  const winner = hotTakes?.find(p => p.is_hot_take_winner) || null;

  return (
    <AdminDashboard
      userId={user.id}
      crewName={profile.display_name || 'Crew'}
      pending={pending || []}
      approved={approved || []}
      rejected={rejected || []}
      hotTakes={hotTakes || []}
      threads={threads || []}
      crew={crew}
      allUsers={allUsers || []}
      spotlightProfileId={spotlightRow?.profile_id || null}
      stats={{
        pending: (pending || []).length,
        approvedThisWeek: approvedThisWeek || 0,
        winner,
      }}
    />
  );
}
