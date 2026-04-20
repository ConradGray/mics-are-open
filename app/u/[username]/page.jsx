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

      {isOwner && (
        <div className="mt-6">
          <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">
            Replies to your posts
          </h2>
          <RecentReplies profileId={profile.id} />
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">
          Open Mic posts
        </h2>
        <ProfilePosts profileId={profile.id} />
      </div>
    </div>
  );
}

async function RecentReplies({ profileId }) {
  const supabase = createClient();

  // Get this user's approved post IDs
  const { data: userPosts } = await supabase
    .from('tmao_posts')
    .select('id')
    .eq('author_id', profileId)
    .eq('status', 'approved');

  const postIds = (userPosts || []).map((p) => p.id);

  if (postIds.length === 0) {
    return (
      <div className="card text-center text-ink-400">
        <p className="text-sm">No replies yet — post something on Open Mic to get the conversation going.</p>
      </div>
    );
  }

  const { data: replies } = await supabase
    .from('tmao_replies')
    .select(`
      id, body, created_at, post_id,
      tmao_profiles!tmao_replies_author_profile_fk (
        username, display_name, avatar_url
      )
    `)
    .in('post_id', postIds)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!replies || replies.length === 0) {
    return (
      <div className="card text-center text-ink-400">
        <p className="text-sm">No replies yet — they'll show up here when people respond to your posts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {replies.map((reply) => {
        const author = reply.tmao_profiles;
        const ago = timeAgo(reply.created_at);
        return (
          <Link
            key={reply.id}
            href={`/open-mic/${reply.post_id}`}
            className="card block hover:border-clay-200 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-6 h-6 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0">
                {author?.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-display text-[10px] text-clay-500">
                    {(author?.display_name || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-ink-800">
                {author?.display_name || 'Listener'}
              </span>
              {author?.username && (
                <span className="text-xs text-ink-400">@{author.username}</span>
              )}
              <span className="text-xs text-ink-400 ml-auto shrink-0">{ago}</span>
            </div>
            <p className="text-ink-600 text-sm leading-relaxed line-clamp-2">
              {reply.body}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d`;

  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

async function ProfilePosts({ profileId }) {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('tmao_posts')
    .select('id, body, created_at')
    .eq('author_id', profileId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20);

  if (!posts || posts.length === 0) {
    return (
      <div className="card text-center text-ink-400">
        <p className="text-sm">No Open Mic posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/open-mic/${post.id}`} className="card block hover:border-clay-200 transition">
          <p className="text-ink-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {post.body}
          </p>
          <p className="text-ink-400 text-xs mt-2">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </Link>
      ))}
    </div>
  );
}
