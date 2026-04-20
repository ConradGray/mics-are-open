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
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 mb-6">
            <div className="flex-1">
              <h1 className="font-display text-[clamp(52px,8vw,88px)] leading-[0.90] text-ink-800">
                Open Mic
              </h1>
              <p className="mt-3 text-sm text-ink-600 leading-relaxed max-w-md">
                Short thoughts, reflections, reactions. Whatever the show sparked.
              </p>
            </div>

            {/* Handheld mic SVG — desktop only */}
            <div className="hidden lg:block shrink-0 opacity-90">
              <svg width="90" height="220" viewBox="0 0 90 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glow behind capsule */}
                <ellipse cx="45" cy="58" rx="34" ry="34" fill="#C7FF00" fillOpacity="0.08"/>

                {/* Capsule dome */}
                <ellipse cx="45" cy="52" rx="28" ry="30" fill="#C7FF00"/>

                {/* Mesh grill lines — horizontal */}
                {[24,32,40,48,56,64,72,80].map((y) => (
                  <line key={y} x1="17" y1={y} x2="73" y2={y} stroke="#0D0D0D" strokeWidth="1" opacity="0.25" strokeLinecap="round"/>
                ))}
                {/* Mesh grill lines — vertical arcs (approximate with lines) */}
                {[22,30,38,45,52,60,68].map((x) => (
                  <line key={x} x1={x} y1="24" x2={x} y2="80" stroke="#0D0D0D" strokeWidth="1" opacity="0.18" strokeLinecap="round"/>
                ))}

                {/* Capsule sheen highlight */}
                <ellipse cx="36" cy="34" rx="10" ry="8" fill="white" fillOpacity="0.12" transform="rotate(-15 36 34)"/>

                {/* Neck ring */}
                <rect x="32" y="79" width="26" height="10" rx="2" fill="#C7FF00" opacity="0.8"/>
                <rect x="30" y="86" width="30" height="5" rx="2.5" fill="#C7FF00" opacity="0.5"/>

                {/* Handle body */}
                <rect x="33" y="91" width="24" height="90" rx="12" fill="#C7FF00"/>

                {/* Handle brand stripe */}
                <rect x="33" y="115" width="24" height="3" rx="1.5" fill="#0D0D0D" opacity="0.2"/>

                {/* Handle lower grip lines */}
                {[130, 138, 146, 154, 162, 170].map((y) => (
                  <rect key={y} x="35" y={y} width="20" height="1.5" rx="0.75" fill="#0D0D0D" opacity="0.15"/>
                ))}

                {/* Handle bottom cap */}
                <rect x="33" y="176" width="24" height="14" rx="12" fill="#C7FF00" opacity="0.7"/>

                {/* Sound wave rings — right side */}
                <path d="M 76 38 Q 86 52 76 66" stroke="#C7FF00" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round"/>
                <path d="M 81 30 Q 96 52 81 74" stroke="#C7FF00" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round"/>
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
