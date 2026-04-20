import { createClient } from '@/lib/supabase/server';
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

  // Fetch approved posts with author profile, reactions, and replies (with author info for first reply preview)
  const { data: posts } = await supabase
    .from('tmao_posts')
    .select(`
      id, body, status, created_at, author_id,
      tmao_profiles!tmao_posts_author_profile_fk (
        username, display_name, avatar_url
      ),
      tmao_replies (
        id, body, created_at,
        tmao_profiles!tmao_replies_author_profile_fk (
          username, display_name, avatar_url
        )
      ),
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
    <div className="max-w-2xl mx-auto">
      <div>
        <div className="mb-8">
          <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-clay-500" />
            Community feed
          </p>
          <div className="w-10 h-0.5 bg-clay-500 mb-6" />

          {/* Andy hero */}
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-500 mb-1">Hosted by</p>
              <h1 className="font-display text-[clamp(40px,7vw,72px)] leading-[0.90] text-ink-800 mb-3">
                Open Mic
              </h1>
              <p className="text-sm text-ink-600 leading-relaxed max-w-sm">
                Each week Andy gives you the chance to get our perspective on questions that you have. He goes through them all — leave your question below.
              </p>
            </div>
            <div
              style={{
                width: 160,
                minWidth: 160,
                backgroundColor: '#ffffff',
                padding: '8px 8px 36px 8px',
                transform: 'rotate(2deg)',
                boxShadow: '0 16px 50px rgba(0,0,0,0.65)',
              }}
            >
              <img
                src="/hosts/andy3.jpg"
                alt="Andy Young"
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
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
