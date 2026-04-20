import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request) {
  // Verify the requester is a crew member
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 });

  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('is_crew')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_crew) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { userId } = await request.json();
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ email: data.user?.email || null });
}
