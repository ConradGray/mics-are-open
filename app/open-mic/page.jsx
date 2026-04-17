import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Open Mic — The Mics Are Open',
};

export default async function WallPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch approved posts with author profile, reaction counts, and reply counts
  const { data: posts } = await supabase
    .from('tmao_posts')
    .select(`
      id, body, status, created_at, author_id,
      tmao_profiles!tmao_posts_author_profile_fk (
        username, display_name, avatar_url
      ),
      tmao_replies ( id ),
      tmao_reactions ( id, emoji, user_id )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50);

  // Also fetch user's own pending posts so they can see them
  let pendingPosts = [];
  if (user) {
    const { data } = await supabase
      .from('tmao_posts')
      .select(`
        id, body, status, created_at, author_id,
        tmao_profiles!tmao_posts_author_profile_fk (
          username, display_name, avatar_url
        ),
        tmao_replies ( id ),
        tmao_reactions ( id, emoji, user_id )
      `)
      .eq('author_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    pendingPosts = data || [];
  }

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Silhouette background watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none z-0">
        <Image
          src="/silhouette-hero.png"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-clay-500" />
            Community feed
          </p>
          <div className="w-10 h-0.5 bg-clay-500 mb-4" />
          
          {/* Header with text and microphone SVG */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-6">
            {/* Text content */}
            <div className="flex-1">
              <h1 className="font-display text-[clamp(52px,8vw,88px)] leading-[0.90] text-ink-800">
                Open Mic
              </h1>
              <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                Short thoughts, reflections, reactions. Whatever the show sparked.
              </p>
            </div>

            {/* Microphone SVG */}
            <div className="hidden lg:flex flex-shrink-0">
              <svg
                width="200"
                height="280"
                viewBox="0 0 200 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                {/* Microphone capsule - main rounded rectangle */}
                <rect
                  x="75"
                  y="20"
                  width="50"
                  height="90"
                  rx="25"
                  fill="#C7FF00"
                  stroke="#0D0D0D"
                  strokeWidth="2"
                />

                {/* Grill lines on capsule */}
                <line
                  x1="80"
                  y1="35"
                  x2="120"
                  y2="35"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="80"
                  y1="50"
                  x2="120"
                  y2="50"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="120"
                  y2="65"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="80"
                  y1="80"
                  x2="120"
                  y2="80"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="80"
                  y1="95"
                  x2="120"
                  y2="95"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Neck - connecting stem */}
                <rect
                  x="90"
                  y="105"
                  width="20"
                  height="50"
                  fill="#C7FF00"
                  stroke="#0D0D0D"
                  strokeWidth="2"
                />

                {/* Neck band detail */}
                <circle
                  cx="100"
                  cy="130"
                  r="12"
                  fill="none"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.3"
                />

                {/* Stand base - wider trapezoid */}
                <path
                  d="M 70 160 L 130 160 L 140 260 L 60 260 Z"
                  fill="#C7FF00"
                  stroke="#0D0D0D"
                  strokeWidth="2"
                />

                {/* Stand base shading - darker left side */}
                <path
                  d="M 70 160 L 95 160 L 100 260 L 60 260 Z"
                  fill="#0D0D0D"
                  opacity="0.15"
                />

                {/* Stand vertical lines for detail */}
                <line
                  x1="80"
                  y1="160"
                  x2="75"
                  y2="260"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
                <line
                  x1="100"
                  y1="160"
                  x2="100"
                  y2="260"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
                <line
                  x1="120"
                  y1="160"
                  x2="125"
                  y2="260"
                  stroke="#0D0D0D"
                  strokeWidth="1.5"
                  opacity="0.2"
                />

                {/* Sound waves - decorative circles to the right */}
                <circle
                  cx="155"
                  cy="65"
                  r="8"
                  fill="none"
                  stroke="#C7FF00"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle
                  cx="155"
                  cy="65"
                  r="15"
                  fill="none"
                  stroke="#C7FF00"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <circle
                  cx="155"
                  cy="65"
                  r="22"
                  fill="none"
                  stroke="#C7FF00"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
              </svg>
            </div>
          </div>
        </div>

        {user ? (
          <PostComposer userId={user.id} />
        ) : (
          <div className="card text-center mb-6">
            <p className="text-ink-500 text-sm">
              <a href="/login?next=/open-mic" className="text-clay-500 hover:text-clay-600 font-medium">
                Log in
              </a>{' '}
              or{' '}
              <a href="/signup?next=/open-mic" className="text-clay-500 hover:text-clay-600 font-medium">
                join TMAO
              </a>{' '}
              to post on Open Mic.
            </p>
          </div>
        )}

        {pendingPosts.length > 0 && (
          <div className="mb-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Your pending posts
            </p>
            {pendingPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} isPending />
            ))}
          </div>
        )}

        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} />
            ))
          ) : (
            <div className="card text-center text-ink-400">
              <p className="text-sm">
                Open Mic is quiet for now. Be the first to post something.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
