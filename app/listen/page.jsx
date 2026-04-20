import Link from 'next/link';

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
  },
  {
    name: 'Apple Podcasts',
    description: 'Subscribe and never miss an episode.',
    href: 'https://podcasts.apple.com/gb/podcast/the-mics-are-open/id1461697859',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.003 0C5.374 0 0 5.374 0 12.003c0 6.628 5.374 12.002 12.003 12.002 6.628 0 12.002-5.374 12.002-12.002C24.005 5.374 18.63 0 12.003 0zm0 1.997c5.52 0 10.005 4.484 10.005 10.006 0 5.52-4.485 10.005-10.005 10.005-5.522 0-10.006-4.485-10.006-10.005 0-5.522 4.484-10.006 10.006-10.006zm0 2.891c-3.926 0-7.115 3.188-7.115 7.115 0 3.04 1.89 5.636 4.582 6.679-.059-.557-.112-1.413.023-2.022.122-.548.815-3.453.815-3.453s-.208-.416-.208-1.033c0-.969.562-1.693 1.261-1.693.595 0 .883.447.883.982 0 .598-.382 1.494-.579 2.324-.165.694.348 1.259 1.03 1.259 1.237 0 2.19-1.303 2.19-3.186 0-1.665-1.197-2.829-2.906-2.829-1.979 0-3.14 1.485-3.14 3.019 0 .598.23 1.239.517 1.589a.208.208 0 0 1 .048.198c-.053.218-.17.694-.193.791-.031.127-.103.154-.238.093-.893-.416-1.452-1.724-1.452-2.774 0-2.256 1.638-4.328 4.725-4.328 2.48 0 4.41 1.768 4.41 4.128 0 2.463-1.551 4.443-3.705 4.443-.724 0-1.405-.376-1.637-.82l-.445 1.662c-.161.621-.597 1.399-.889 1.872.67.207 1.38.318 2.116.318 3.926 0 7.115-3.19 7.115-7.115 0-3.928-3.189-7.116-7.115-7.116z"/>
      </svg>
    ),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200 hover:border-green-400',
  },
];

export default function ListenPage() {
  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-clay-500" />
          Every Friday
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-4" />
        <h1 className="font-display text-[clamp(48px,7vw,80px)] leading-[0.90] text-ink-800">
          Listen
        </h1>
        <p className="mt-3 text-sm text-ink-600 leading-relaxed">
          Find The Mics Are Open wherever you listen to podcasts.
        </p>
      </div>

      {/* Platform cards */}
      <div className="space-y-4 mb-10">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`card flex items-center gap-5 border-2 transition group ${platform.borderColor}`}
          >
            <div className={`w-14 h-14 rounded-xl ${platform.bgColor} ${platform.color} flex items-center justify-center shrink-0`}>
              {platform.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-xl text-ink-800 group-hover:text-clay-500 transition">
                {platform.name}
              </p>
              <p className="text-sm text-ink-500 mt-0.5">{platform.description}</p>
            </div>
            <span className="text-ink-400 group-hover:text-clay-500 text-lg transition shrink-0">
              →
            </span>
          </a>
        ))}
      </div>

      {/* Community strip */}
      <div className="border-t-2 border-clay-500 pt-8">
        <p className="text-ink-600 text-sm mb-4">
          Already a listener? Come talk about it.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/open-mic" className="btn-primary text-sm">
            Open Mic →
          </Link>
          <Link href="/threads" className="btn-ghost text-sm">
            Episode Threads
          </Link>
        </div>
      </div>

    </div>
  );
}
