import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About — The Mics Are Open',
  description:
    'Born out of Nairobi\'s radio culture. Unscripted, unpredictable, and completely their own.',
};

const hosts = [
  { name: 'G Money',    initials: 'G' },
  { name: 'Calvin',     initials: 'C' },
  { name: 'Ashley',     initials: 'A' },
  { name: 'Andy Young', initials: 'AY' },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-12">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-clay-500" />
          Kenya's #1 Podcast
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-4" />
        <h1 className="font-display text-[clamp(52px,8vw,96px)] leading-[0.90] text-ink-800">
          The Mics<br />Are Open
        </h1>
      </div>

      {/* Opening line */}
      <div className="mb-10">
        <p className="font-display text-2xl text-ink-700 leading-snug border-l-4 border-clay-500 pl-6">
          Some podcasts are produced. The Mics Are Open just happens.
        </p>
      </div>

      {/* Body copy */}
      <div className="prose-tmao space-y-5 text-ink-600 leading-relaxed mb-12">
        <p>
          Born out of Nairobi's radio culture, The Mics Are Open brings together a group of
          broadcasters — G Money, Calvin, Ashley and Andy Young — for weekly conversations that
          are unscripted, unpredictable and completely their own. The topics range from
          relationships to politics, pop culture to the everyday absurdities of life in Kenya and
          beyond. No script. No agenda. No filter. Just people who have spent years behind
          microphones finally saying exactly what they think — and occasionally what they
          probably shouldn't.
        </p>
        <p>
          What makes the show work isn't a format. It's the chemistry. These are people who have
          lived parallel lives in the same city, worked the same rooms, navigated the same
          industry, and accumulated enough shared history to be genuinely honest with each other
          on mic. That honesty is what listeners keep coming back for. Every episode feels like
          walking into a conversation that was already happening — warm, chaotic, and impossible
          to predict.
        </p>
        <p>
          The show has built a loyal following across Spotify, Apple Podcasts and beyond. Not
          because it chases trends, but because it doesn't. The Mics Are Open has always trusted
          that real conversation — messy, funny, and occasionally profound — is enough. It turns
          out it is.
        </p>
        <p>
          Over the years the podcast has covered everything from love and marriage to Kenyan
          politics, Drake versus Kendrick, what it means to come home, and whether the grocery
          store is genuinely a viable place to meet your partner. The range is the point. Life
          doesn't stay in one lane and neither does the show.
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
            <div key={host.name} className="card text-center py-6">
              <div className="w-14 h-14 rounded-full bg-clay-500 flex items-center justify-center mx-auto mb-3">
                <span className="font-display text-xl text-cream-50">
                  {host.initials}
                </span>
              </div>
              <p className="font-display text-lg text-ink-800">{host.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="border-t-2 border-clay-500 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-ink-600 text-sm">
          Ready to join the conversation?
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/listen" className="btn-primary text-sm">
            Listen →
          </Link>
          <Link href="/open-mic" className="btn-ghost text-sm">
            Open Mic
          </Link>
        </div>
      </div>

    </div>
  );
}
