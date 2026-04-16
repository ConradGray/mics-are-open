import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export default async function ProfileSetupPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/profile/setup');

  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('username, display_name, location, bio, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="mb-6">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-clay-500">
          Your profile
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink-800 mt-1">
          {profile?.display_name ? 'Edit your profile' : 'Set up your profile'}
        </h1>
        <p className="mt-2 text-ink-600">
          Give the community something to remember you by.
        </p>
      </div>

      <ProfileForm userId={user.id} initial={profile} email={user.email} />
    </div>
  );
}
