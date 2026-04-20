import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Listen — The Mics Are Open',
  description: 'Find The Mics Are Open on YouTube, Spotify, Apple Podcasts and more.',
};

const platforms = [
  {
    name: 'YouTube',
    description: 'Full episodes and clips on our YouTube channel.',
    href: 'https://www.youtube.com/playlist?list=PLURaeuNWMwdy894eBMVPwR67ZDQpSWwsg',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200 hover:border-red-400',
  },
  {
    name: 'Spotify',
    description: 'Stream every episode on Spotify.',
    href: 'https://open.spotify.com/show/6aU9hxLKdMIEzBfQ2IhYt6',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200 hover:border-green-400',
  },
  {
    name: 'Apple Podcasts',
    description: 'Subscribe and never miss an episode.',
    href: 'https://podcasts.apple.com/gb/podcast/the-mics-are-open/id1461697859',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.66a7.33 7.33 0 0 1 2.879 14.088c-.028-.476-.04-.928-.04-1.28 0-.856.295-1.44.295-1.44s-.214-.432-.214-1.071c0-1.004.582-1.754 1.306-1.754.616 0 .915.463.915 1.018 0 .62-.396 1.549-.6 2.41-.17.72.36 1.305 1.067 1.305 1.282 0 2.27-1.351 2.27-3.302 0-1.726-1.24-2.932-3.012-2.932-2.05 0-3.253 1.539-3.253 3.128 0 .619.238 1.284.535 1.647.059.07.068.132.05.204-.055.226-.176.72-.2.82-.032.131-.107.16-.246.096-.925-.431-1.504-1.786-1.504-2.875 0-2.338 1.699-4.486 4.9-4.486 2.572 0 4.569 1.832 4.569 4.28 0 2.554-1.608 4.605-3.84 4.605-.75 0-1.455-.39-1.697-.849l-.461 1.721c-.167.644-.619 1.451-.922 1.94.694.215 1.43.33 2.193.33A7.33 7.33 0 0 0 12 4.661z"/>
      </svg>
    ),
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
  },
];

const polaroids = [
  { src: '/collage/ep1.jpg', top: '0%',  left: '0%',  rotate: '-5deg', zIndex: 2 },
  { src: '/collage/ep3.jpg', top: '10%', left: '42%', rotate: '4deg',  zIndex: 4 },
  { src: '/collage/ep2.jpg', top: '48%', left: '5%',  rotate: '3deg',  zIndex: 3 },
  { src: '/collage/ep4.jpg', top: '55%', left: '44%', rotate: '-4deg', zIndex: 5 },
];

export default function ListenPage() {
  return (
    <div>

      {/* ── Hero: two-column on desktop ─────────────────── */}
      <div className="grid md:grid-cols-2 gap-8 items-start pt-12 pb-10 md:pt-20 md:pb-12">

        {/* Left: heading + platform links */}
        <div>
          <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-clay-500" />
            Every Friday
          </p>
          <div className="w-10 h-0.5 bg-clay-500 mb-4" />
          <h1 className="font-display text-[clamp(48px,7vw,96px)] leading-[0.90] text-ink-800">
            Listen
          </h1>
          <p className="mt-4 mb-8 text-sm text-ink-600 leading-relaxed max-w-sm">
            Find The Mics Are Open wherever you listen to podcasts.
          </p>

          {/* Compact platform buttons */}
          <div className="space-y-3">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition group ${platform.borderColor} max-w-xs`}
              >
                <div className={`w-9 h-9 rounded-lg ${platform.bgColor} ${platform.color} flex items-center justify-center shrink-0`}>
                  <div className="w-5 h-5">{platform.icon}</div>
                </div>
                <span className={`font-semibold text-sm text-ink-700 group-hover:${platform.color} transition`}>
                  {platform.name}
                </span>
                <span className="ml-auto text-ink-400 group-hover:translate-x-0.5 transition-transform text-sm">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: polaroids — desktop */}
        <div className="hidden md:block relative h-[560px]">
          {polaroids.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: img.top,
                left: img.left,
                width: 280,
                backgroundColor: '#ffffff',
                padding: '12px 12px 48px 12px',
                transform: `rotate(${img.rotate})`,
                zIndex: img.zIndex,
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image src={img.src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-50/60 pointer-events-none" style={{ zIndex: 10 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50/80 via-transparent to-transparent pointer-events-none" style={{ zIndex: 10 }} />
        </div>

        {/* Polaroids — mobile */}
        <div className="md:hidden flex justify-center gap-4 mt-2 mb-4">
          {[
            { src: '/collage/ep1.jpg', rotate: '-5deg', mt: '0px' },
            { src: '/collage/ep3.jpg', rotate: '4deg',  mt: '18px' },
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
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image src={img.src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Episode gallery ──────────────────────────────── */}
      <div className="mb-10 mt-4">
        <p className="uppercase tracking-[0.2em] text-[9px] font-bold text-ink-400 mb-4 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-ink-300" />
          From the studio
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { src: '/collage/ep5.jpg', rotate: '-1.5deg' },
            { src: '/collage/ep7.jpg', rotate: '1deg' },
            { src: '/collage/ep6.jpg', rotate: '-0.5deg' },
            { src: '/collage/ep9.jpg', rotate: '1.5deg' },
            { src: '/collage/ep8.jpg', rotate: '-1deg' },
            { src: '/collage/ep10.jpg', rotate: '0.5deg' },
          ].map((img, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                padding: '8px 8px 32px 8px',
                transform: `rotate(${img.rotate})`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image src={img.src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Community strip ──────────────────────────────── */}
      <div className="max-w-2xl border-t-2 border-clay-500 pt-8">
        <p className="text-ink-600 text-sm mb-4">Already a listener? Come talk about it.</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/open-mic" className="btn-primary text-sm">Open Mic →</Link>
          <Link href="/threads" className="btn-ghost text-sm">Episode Threads</Link>
        </div>
      </div>

    </div>
  );
}
