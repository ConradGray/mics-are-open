import Image from 'next/image';
import { fitStyle } from '@/lib/fit';
import { createClient } from '@/lib/supabase/server';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import Chip from '@/components/Chip';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Open Mic — The Mics Are Open',
};

export default async function WallPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isCrew = false;
  if (user) {
    const { data: profile } = await supabase
      .from('tmao_profiles')
      .select('is_crew')
      .eq('id', user.id)
      .maybeSingle();
    isCrew = profile?.is_crew || false;
  }

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
    <div className="page-full">
      {/* Hero — Andy's photo in its own frame (no overlay), text on a solid panel */}
      <section className="bleed split-hero">
        <div className="photo portrait fade-bottom">
          <Image src="/hosts/andy3.jpg" alt="Andy Young" fill priority sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" style={{ objectPosition: '50% 20%' }} />
        </div>
        <div className="panel">
          <Chip tone="y" value="Andy" label="Hosted by" />
          <h1 className="display fit mt-4" style={fitStyle('Open Mic', 96)}>
            Open <span className="hl">Mic</span>
          </h1>
          <p className="mt-4 max-w-[560px] font-semibold text-ink-700 text-[clamp(15px,3.8vw,18px)]">
            Each week Andy gives you the chance to get our perspective on questions that you have. He goes through them all — leave your question below.
          </p>
        </div>
      </section>

      <section className="bleed pt-7 pb-[72px] lg:pb-[110px]">
      <div className="wrap max-w-[1000px]">
        {user ? (
          <PostComposer userId={user.id} />
        ) : (
          <div className="bg-clay-500 px-5 py-[18px] mb-6 font-bold">
            <p className="text-white text-sm">
              <a href="/login?next=/open-mic" className="underline underline-offset-2">
                Log in
              </a>{' '}
              or{' '}
              <a href="/signup?next=/open-mic" className="underline underline-offset-2">
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
              <PostCard key={post.id} post={post} currentUserId={user?.id} isCrew={isCrew} isPending />
            ))}
          </div>
        )}

        <p className="section-label mt-11">Community feed</p>
        <div className="space-y-3">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} isCrew={isCrew} />
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
      </section>
    </div>
  );
}
