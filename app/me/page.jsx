import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// /me is a convenience redirect to the logged-in user's public profile.
export default async function MePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/me');

  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.username) redirect('/profile/setup');
  redirect(`/u/${profile.username}`);
}
