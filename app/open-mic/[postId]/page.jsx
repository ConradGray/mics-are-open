import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import ReactionBar from '../ReactionBar';
import OpenMicRepliesSection from './OpenMicRepliesSection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('tmao_posts')
    .select('body, tmao_profiles!tmao_posts_author_profile_fk ( display_name )')
    .eq('id', params.postId)
    .maybeSingle();

  if (!post) return { title: 'Post not found — The Mics Are Open' };

  const name = post.tmao_profiles?.display_name || 'Someone';
  const snippet = post.body.length > 60 ? post.body.slice(0, 57) + '…' : post.body;
  return {
    title: `${name}: "${snippet}" — The Mics Are Open`,
  };
}

export default async function PostDetailPage({ params }) {
  const supabase = createClient();

  const { data: post } = await supabase
    .from('tmao_posts')
    .select(`
      id, body, status, created_at, author_id,
      tmao_profiles!tmao_posts_author_profile_fk (
        username, display_name, avatar_url
      ),
      tmao_reactions ( id, emoji, user_id )
    `)
    .eq('id', params.postId)
    .maybeSingle();

  if (!post || post.status !== 'approved') notFound();

  const { data: replies } = await supabase
    .from('tmao_replies')
    .select(`
      id, body, created_at, author_id,
      tmao_profiles!tmao_replies_author_profile_fk (
        username, display_name, avatar_url
      ),
      tmao_reactions ( id, emoji, user_id )
    `)
    .eq('post_id', post.id)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = post.tmao_profiles;
  const reactions = post.tmao_reactions || [];

  const postedAt = new Date(post.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/open-mic"
        className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-clay-500 transition mb-6"
      >
        ← Back to Open Mic
      </Link>

      <div className="card">
        <div className="flex items-start gap-3">
          <Link
            href={profile?.username ? `/u/${profile.username}` : '#'}
            className="relative w-12 h-12 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <span className="font-display text-lg text-clay-500">
                {(profile?.display_name || '?').slice(0, 1).toUpperCase()}
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <Link
                href={profile?.username ? `/u/${profile.username}` : '#'}
                className="font-semibold text-ink-800 hover:text-clay-500 transition"
              >
                {profile?.display_name || 'Listener'}
              </Link>
              {profile?.username && (
                <span className="text-ink-400 text-sm">@{profile.username}</span>
              )}
            </div>
            <p className="text-ink-400 text-xs mt-0.5">{postedAt}</p>
          </div>
        </div>

        <p className="mt-4 text-ink-800 text-lg leading-relaxed whitespace-pre-wrap break-words">
          {post.body}
        </p>

        <div className="mt-4 pt-4 border-t border-cream-200">
          <ReactionBar
            postId={post.id}
            reactions={reactions}
            currentUserId={user?.id}
          />
        </div>
      </div>

      {/* Replies */}
      <div className="mt-6">
        <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">
          {replies?.length ? `Replies (${replies.length})` : 'Replies'}
        </h2>
        <OpenMicRepliesSection
          postId={post.id}
          userId={user?.id || null}
          replies={replies || []}
          currentUserId={user?.id || null}
        />
      </div>
    </div>
  );
}
