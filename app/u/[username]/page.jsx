import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  return {
    title: `@${params.username} — The Mics Are Open`,
  };
}

export default async function PublicProfilePage({ params }) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('tmao_profiles')
    .select('id, username, display_name, location, bio, avatar_url, created_at')
    .eq('username', params.username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  const joined = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-start gap-5">
          <div className="relative w-24 h-24 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.display_name}'s avatar`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="font-display text-3xl text-clay-500">
                {(profile.display_name || profile.username).slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold text-ink-800 truncate">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-ink-400 text-sm mt-1">
              @{profile.username}
              {profile.location && (
                <>
                  <span className="mx-2">·</span>
                  {profile.location}
                </>
              )}
            </p>
            <p className="text-ink-400 text-xs mt-1">Joined {joined}</p>
          </div>

          {isOwner && (
            <Link href="/profile/setup" className="btn-ghost text-sm">
              Edit
            </Link>
          )}
        </div>

        {profile.bio && (
          <blockquote className="mt-6 border-l-2 border-clay-300 pl-4 text-ink-600 italic leading-relaxed">
            &ldquo;{profile.bio}&rdquo;
          </blockquote>
        )}
      </div>

      <div className="mt-6 card text-center text-ink-400">
        <p className="text-sm">
          Posts and activity will show up here once The Wall is live.
        </p>
      </div>
    </div>
  );
}
