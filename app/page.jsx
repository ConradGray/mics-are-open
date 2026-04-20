import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Hot Take of the Week — explicitly picked winner
  const { data: hotTakeWinner } = await supabase
    .from('tmao_posts')
    .select(`id, body, author_id,
      tmao_profiles!tmao_posts_author_profile_fk ( username, display_name )`)
    .eq('status', 'approved')
    .eq('is_hot_take_winner', true)
    .maybeSingle();

  return (
    <div className="flex flex-col">

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="pt-12 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 md:gap-8 items-center">

        {/* Left: text */}
        <div>
          <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-clay-500 mb-5 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-clay-500" />
            Kenya&rsquo;s #1 Podcast &nbsp;·&nbsp; Every Friday
          </p>

          <h1 className="font-display text-[clamp(64px,10vw,120px)] leading-[0.90] text-ink-800 mb-6">
            THE MICS<br />ARE OPEN
          </h1>

          <p className="max-w-lg text-base text-ink-600 leading-relaxed mb-6">
            More than a podcast — it&rsquo;s a room full of people who heard the same
            thing and felt something about it. Make a profile, drop something on Open Mic, and
            meet the rest of us.
          </p>

          <div className="max-w-lg bg-clay-500/10 border border-clay-500/30 rounded-xl px-5 py-4 mb-10">
            <p className="text-sm text-ink-700 leading-relaxed">
              <span className="font-bold text-clay-500">7 years and counting.</span>{' '}
              We built this site for you — it&rsquo;s been 7 great years and this is your website. Look out for more features coming soon.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {user ? (
              <Link href="/open-mic" className="btn-primary">
                Open Mic →
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary">
                  Join the community
                </Link>
                <Link href="/login" className="btn-ghost">
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: polaroid collage — desktop */}
        <div className="hidden md:block relative h-[580px]">
          {[
            { src: '/collage/c1.jpg', top: '-4%',  left: '-2%', rotate: '-6deg', zIndex: 2 },
            { src: '/collage/c3.jpg', top: '22%',  left: '34%', rotate: '5deg',  zIndex: 3 },
            { src: '/collage/c5.jpg', top: '52%',  left: '2%',  rotate: '-4deg', zIndex: 4 },
          ].map((img, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: img.top,
                left: img.left,
                width: 340,
                backgroundColor: '#ffffff',
                padding: '14px 14px 56px 14px',
                transform: `rotate(${img.rotate})`,
                zIndex: img.zIndex,
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image src={img.src} alt="" fill sizes="340px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          ))}
          {/* Fade edges into background */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-50/60 pointer-events-none" style={{ zIndex: 10 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50/80 via-transparent to-transparent pointer-events-none" style={{ zIndex: 10 }} />
        </div>

        {/* Polaroid collage — mobile only */}
        <div className="md:hidden flex justify-center gap-4 mt-10 mb-2">
          {[
            { src: '/collage/c1.jpg', rotate: '-5deg', mt: '0px' },
            { src: '/collage/c3.jpg', rotate: '4deg',  mt: '20px' },
          ].map((img, i) => (
            <div
              key={i}
              style={{
                width: '44%',
                backgroundColor: '#ffffff',
                padding: '10px 10px 38px 10px',
                transform: `rotate(${img.rotate})`,
                marginTop: img.mt,
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image src={img.src} alt="" fill sizes="44vw" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Hot Take of the Week ────────────────────────── */}
      <div className="mb-16">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-2">
          🔥 Hot Take of the Week
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-4" />
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-[0.95] text-ink-800">
            Hot Take of the Week
          </h2>
          <Image
            src="/logo-tgc.png"
            alt="The Good Company"
            width={360}
            height={180}
            className="h-44 w-auto opacity-80 shrink-0"
          />
        </div>

        {hotTakeWinner ? (
          <Link
            href={`/open-mic/${hotTakeWinner.id}`}
            className="block card-featured hover:border-clay-500/60 transition group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-clay-500 text-cream-50">
                👑 Winner
              </span>
              <span className="text-xs text-ink-400">
                @{hotTakeWinner.tmao_profiles?.username || 'listener'}
              </span>
            </div>
            <p className="text-ink-800 leading-relaxed text-base">
              {hotTakeWinner.body}
            </p>
            <p className="mt-4 text-xs font-semibold text-clay-500 group-hover:underline">
              Read the thread →
            </p>
          </Link>
        ) : (
          <div className="card text-center py-10 border-[#2a2a2a]">
            <p className="text-2xl mb-3">🎙️</p>
            <p className="text-ink-600 text-sm">No winner this week yet.</p>
            <p className="text-ink-500 text-sm mt-1">
              Drop your hot take on{' '}
              <Link href="/open-mic" className="text-clay-500 hover:underline font-medium">
                Open Mic
              </Link>{' '}
              — the crew picks every week.
            </p>
          </div>
        )}
      </div>

      {/* ── Stats bar ───────────────────────────────────── */}
      <div className="grid grid-cols-3 border border-[#2a2a2a] rounded-2xl overflow-hidden mb-16 bg-[#161616]"
           style={{boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 8px 32px -8px rgba(0,0,0,0.7)'}}>
        {[
          ['500+', 'Episodes & Minisodes'],
          ['Every', 'Friday'],
          ['#1', 'In Kenya'],
        ].map(([val, lbl]) => (
          <div key={lbl} className="px-8 py-6 border-r border-[#2a2a2a] last:border-r-0">
            <p className="font-display text-5xl text-clay-500 leading-none">{val}</p>
            <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-ink-600 mt-2">{lbl}</p>
          </div>
        ))}
      </div>

      {/* ── Feature cards ───────────────────────────────── */}
      <div className="mb-4">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3">
          What&rsquo;s here
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-4" />
        <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-[0.95] text-ink-800 mb-8">
          What&rsquo;s here
        </h2>
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        <FeatureCard
          badge="Now live"
          title="Profiles"
          body="Name, place, photo, and a line about how you found the show."
        />
        <FeatureCard
          badge="Now live"
          title="Open Mic"
          body="A rolling feed of listener thoughts, reactions, and moments from the show."
          href="/open-mic"
        />
        <FeatureCard
          badge="Now live"
          title="Episode Threads"
          body="Keep talking about the episode long after it ends."
          href="/threads"
        />
      </section>
    </div>
  );
}

function FeatureCard({ badge, title, body, href }) {
  const Wrapper = href ? Link : 'div';
  const isLive = badge === 'Now live';
  return (
    <Wrapper
      href={href}
      className={`card text-left group relative overflow-hidden ${href ? 'cursor-pointer' : ''} ${
        isLive && href ? 'hover:border-clay-500/60 transition' : 'opacity-60'
      }`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-clay-500/40 to-transparent" />
      )}
      <span
        className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
          isLive
            ? 'bg-clay-500/10 text-clay-500 border border-clay-500/30'
            : 'bg-[#1e1e1e] text-ink-400 border border-[#2a2a2a]'
        }`}
      >
        {badge}
      </span>
      <h3 className="mt-4 font-display text-3xl text-ink-800">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
      {isLive && href && (
        <p className="mt-5 text-xs font-semibold text-clay-500 group-hover:underline">
          Open →
        </p>
      )}
    </Wrapper>
  );
}
