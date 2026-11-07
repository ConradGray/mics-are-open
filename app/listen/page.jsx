import Image from 'next/image';
import { fitStyle } from '@/lib/fit';
import Chip from '@/components/Chip';
import CommunityCta from '@/components/CommunityCta';

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

const studio = ['ep3', 'ep2', 'ep4', 'ep5', 'ep7', 'ep6', 'ep9', 'ep8', 'ep10'];

const tileStyles = [
  'bg-clay-500 border-clay-500 text-white',
  'bg-[#141416] border-[#26262A] text-white',
  'bg-[#FFD21F] border-[#FFD21F] text-[#0A0A0B]',
];

export default function ListenPage() {
  return (
    <div className="page-full">
      {/* Hero — studio photo in its own frame, text on a solid panel */}
      <section className="bleed split-hero">
        <div className="photo edge-mask fade-bottom">
          <Image src="/collage/ep1.jpg" alt="The Mics Are Open studio" fill priority sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" />
        </div>
        <div className="panel">
          <Chip value="Fri" label="Every Friday" />
          <h1 className="display fit mt-4" style={fitStyle('Listen.', 96)}>
            Listen<span className="hl">.</span>
          </h1>
          <p className="mt-4 max-w-[560px] font-semibold text-ink-700 text-[clamp(15px,3.8vw,18px)]">
            Find The Mics Are Open wherever you listen to podcasts.
          </p>
        </div>
      </section>

      {/* Platforms */}
      <section className="bleed pt-5 pb-[72px] lg:pb-[110px]">
        <div className="wrap grid gap-2.5 md:grid-cols-3">
          {platforms.map((platform, i) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex md:flex-col md:items-start items-center justify-between gap-6 md:min-h-[190px] px-5 py-[22px] border ${tileStyles[i % 3]} transition hover:brightness-110`}
            >
              <div className="w-8 h-8">{platform.icon}</div>
              <span className="display text-[clamp(26px,7vw,44px)] leading-none flex-1 md:flex-none">{platform.name}</span>
              <span className="display text-3xl leading-none group-hover:translate-x-1 transition-transform">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* From the studio — clean photos, no overlays */}
      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap">
          <p className="section-label">From the studio</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {studio.map((name, i) => (
            <div key={name} className={`photo edge-mask ${i === 0 ? 'col-span-2 aspect-video md:row-span-2 md:aspect-auto' : 'aspect-square'}`}>
              <Image src={`/collage/${name}.jpg`} alt="" fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        </div>
      </section>

      <CommunityCta />
    </div>
  );
}
