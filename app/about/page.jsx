import Link from 'next/link';

export const metadata = {
  title: 'About — The Mics Are Open',
  description:
    "Born out of Nairobi's radio culture. Unscripted, unpredictable, and completely their own.",
};

const hosts = [
  { name: 'G Money',    initials: 'G',  photo: '/hosts/gmoney.jpg',  photoPos: 'center top',    ig: 'https://www.instagram.com/gmoneyizme' },
  { name: 'Calvin',     initials: 'C',  photo: '/hosts/calvin.jpg',  photoPos: 'center top',    ig: 'https://www.instagram.com/calvinwanguku' },
  { name: 'Ashley',     initials: 'A',  photo: '/hosts/ashley.jpg',  photoPos: 'center 20%',    ig: 'https://www.instagram.com/ashleymuthui' },
  { name: 'Andy Young', initials: 'AY', photo: '/hosts/andy.jpg',    photoPos: 'center top',    ig: 'https://www.instagram.com/andy_young254' },
];

const polaroids = [
  { src: '/collage/c2.jpg', top: '0%',  left: '5%',  rotate: '-7deg', zIndex: 2 },
  { src: '/collage/c6.jpg', top: '28%', left: '38%', rotate: '5deg',  zIndex: 3 },
  { src: '/collage/c4.jpg', top: '55%', left: '8%',  rotate: '-3deg', zIndex: 4 },
];

export default function AboutPage() {
  return (
    <div>

      {/* ── Hero: two-column on desktop ─────────────────── */}
      <div className="grid md:grid-cols-2 gap-8 items-start pt-12 pb-10 md:pt-20 md:pb-16">

        {/* Left: text */}
        <div>
          <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-clay-500" />
            Kenya&rsquo;s #1 Podcast
          </p>
          <div className="w-10 h-0.5 bg-clay-500 mb-4" />
          <h1 className="font-display text-[clamp(52px,8vw,96px)] leading-[0.90] text-ink-800 mb-8">
            The Mics<br />Are Open
          </h1>
          <p className="font-display text-xl text-ink-700 leading-snug border-l-4 border-clay-500 pl-6">
            Some podcasts are produced. The Mics Are Open just happens.
          </p>
        </div>

        {/* Right: polaroid collage — desktop */}
        <div className="hidden md:block relative h-[520px]">
          {polaroids.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: img.top,
                left: img.left,
                width: 300,
                backgroundColor: '#ffffff',
                padding: '12px 12px 48px 12px',
                transform: `rotate(${img.rotate})`,
                zIndex: img.zIndex,
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
              }}
            >
              <img
                src={img.src}
                alt=""
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-50/60 pointer-events-none" style={{ zIndex: 10 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50/80 via-transparent to-transparent pointer-events-none" style={{ zIndex: 10 }} />
        </div>

        {/* Polaroids — mobile (2 stacked) */}
        <div className="md:hidden flex justify-center gap-4 mt-2 mb-4">
          {[
            { src: '/collage/c2.jpg', rotate: '-5deg', mt: '0px' },
            { src: '/collage/c6.jpg', rotate: '4deg',  mt: '20px' },
          ].map((img, i) => (
            <div
              key={i}
              style={{
                width: '44%',
                backgroundColor: '#ffffff',
                padding: '10px 10px 36px 10px',
                transform: `rotate(${img.rotate})`,
                marginTop: img.mt,
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src={img.src}
                alt=""
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Body content ────────────────────────────────── */}
      <div className="max-w-3xl">

        {/* Body copy */}
        <div className="space-y-5 text-ink-600 leading-relaxed mb-12">
          <p>
            Born out of Nairobi&rsquo;s radio culture, The Mics Are Open brings together a group of
            broadcasters — G Money, Calvin, Ashley and Andy Young — for weekly conversations that
            are unscripted, unpredictable and completely their own. The topics range from
            relationships to politics, pop culture to the everyday absurdities of life in Kenya and
            beyond. No script. No agenda. No filter. Just people who have spent years behind
            microphones finally saying exactly what they think — and occasionally what they
            probably shouldn&rsquo;t.
          </p>
          <p>
            What makes the show work isn&rsquo;t a format. It&rsquo;s the chemistry. These are people who have
            lived parallel lives in the same city, worked the same rooms, navigated the same
            industry, and accumulated enough shared history to be genuinely honest with each other
            on mic. That honesty is what listeners keep coming back for. Every episode feels like
            walking into a conversation that was already happening — warm, chaotic, and impossible
            to predict.
          </p>
          <p>
            The show has built a loyal following across Spotify, Apple Podcasts and beyond. Not
            because it chases trends, but because it doesn&rsquo;t. The Mics Are Open has always trusted
            that real conversation — messy, funny, and occasionally profound — is enough. It turns
            out it is.
          </p>
          <p>
            Over the years the podcast has covered everything from love and marriage to Kenyan
            politics, Drake versus Kendrick, what it means to come home, and whether the grocery
            store is genuinely a viable place to meet your partner. The range is the point. Life
            doesn&rsquo;t stay in one lane and neither does the show.
          </p>
          <p className="font-semibold text-ink-700">
            Available weekly wherever you get your podcasts.
          </p>
        </div>

        {/* Hosts */}
        <div className="mb-12">
          <p className="uppercase tracking-[0.2em] text-[9px] font-bold text-clay-500 mb-6">
            The Hosts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {hosts.map((host) => (
              <div key={host.name} className="card text-center py-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-cream-200">
                  <img
                    src={host.photo}
                    alt={host.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: host.photoPos }}
                  />
                </div>
                <p className="font-display text-lg text-ink-800 mb-3">{host.name}</p>
                {host.ig ? (
                  <a
                    href={host.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 hover:text-[#E1306C] transition px-3 py-1.5 rounded-full border border-cream-200 hover:border-[#E1306C]/40"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                ) : (
                  <span className="text-xs text-ink-300">—</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="border-t-2 border-clay-500 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-ink-600 text-sm">Ready to join the conversation?</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/listen" className="btn-primary text-sm">Listen →</Link>
            <Link href="/open-mic" className="btn-ghost text-sm">Open Mic</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
