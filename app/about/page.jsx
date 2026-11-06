import Link from 'next/link';
import { fitStyle } from '@/lib/fit';
import Image from 'next/image';
import Chip from '@/components/Chip';

export const metadata = {
  title: 'About — The Mics Are Open',
  description:
    "Born out of Nairobi's radio culture. Unscripted, unpredictable, and completely their own.",
};

const hosts = [
  { name: 'G Money',    photo: '/hosts/andy2.jpg',   ig: 'https://www.instagram.com/gmoneyizme' },
  { name: 'Calvin',     photo: '/hosts/calvin2.jpg', ig: 'https://www.instagram.com/calvinwanguku' },
  { name: 'Ashley',     photo: '/hosts/ashley2.jpg', ig: 'https://www.instagram.com/ashleymuthui' },
  { name: 'Andy Young', photo: '/hosts/gmoney2.jpg', ig: 'https://www.instagram.com/andy_young254' },
];

const IG_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="page-full">
      {/* Hero — group photo in its own frame, text on a solid panel */}
      <section className="bleed split-hero">
        <div className="photo fade-bottom">
          <Image src="/collage/c2.jpg" alt="G Money, Calvin, Ashley and Andy Young in the studio" fill priority sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" style={{ objectPosition: '50% 35%' }} />
        </div>
        <div className="panel">
          <Chip value="#1" label="Kenya’s Podcast" />
          <h1 className="display fit mt-[18px]" style={fitStyle('The Mics Are Open just happens.', 80)}>
            <small className="block text-[0.4em] font-extrabold tracking-normal mb-[0.35em] text-[#EDEDF0]">Some podcasts are produced.</small>
            The Mics Are Open just <span className="hl">happens.</span>
          </h1>
          <p className="mt-5 max-w-[560px] font-semibold text-ink-700 text-[clamp(15px,3.8vw,18px)]">
            Born out of Nairobi&rsquo;s radio culture. Unscripted, unpredictable and completely their own.
          </p>
        </div>
      </section>

      {/* The crew — photo on top, name on a solid panel below */}
      <section className="bleed py-[72px] lg:py-[110px]">
        <div className="wrap">
          <p className="section-label">On the mics</p>
          <h2 className="display text-[clamp(34px,8.5vw,72px)]">The <span className="hl">crew</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5 mt-8">
            {hosts.map((host) => (
              <a key={host.name} href={host.ig} target="_blank" rel="noopener noreferrer"
                 className="group flex flex-col border border-[#26262A] hover:border-clay-500 transition">
                <div className="photo aspect-[4/5]">
                  <Image src={host.photo} alt={host.name} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" style={{ objectPosition: '50% 25%' }} />
                </div>
                <div className="bg-[#141416] p-3 md:p-4">
                  <strong className="block display text-[clamp(20px,5.4vw,34px)]">{host.name}</strong>
                  <span className="inline-flex items-center gap-1.5 mt-2 bg-white text-[#0A0A0B] group-hover:bg-clay-500 group-hover:text-white font-bold text-[10px] tracking-[0.14em] px-[7px] py-[5px] transition">
                    {IG_ICON} Instagram
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap grid gap-9 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div className="border-l-[6px] border-clay-500 pl-[18px] md:sticky md:top-32">
            <p className="section-label">The show</p>
            <p className="display text-[clamp(36px,9vw,76px)]">
              <span className="block">No script.</span>
              <span className="block">No agenda.</span>
              <span className="block hl">No filter.</span>
            </p>
          </div>
          <div className="space-y-[18px] text-ink-700 text-[17px] leading-relaxed max-w-[640px]">
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
          </div>
        </div>
      </section>

      {/* Photo strip — two photos at the same size (equal columns, 16:9, cover),
          in their own frames with nothing on top; the chip sits on a solid bar below */}
      <section className="bleed">
        <div className="wrap">
        <div className="grid md:grid-cols-2 gap-1.5">
          {[
            { src: '/collage/c6.jpg', alt: 'The hosts mid-conversation in the studio' },
            { src: '/collage/kodong.jpg', alt: 'The Mics Are Open with Kodong Klan in the studio' },
          ].map((img) => (
            <figure key={img.src} className="photo aspect-video">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:1240px) 600px, (min-width:768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: '50% 35%' }} />
            </figure>
          ))}
        </div>
        <div className="pt-3"><Chip small value="Fri" label="Every Friday" /></div>
        </div>
      </section>

      {/* Following + stats */}
      <section className="bleed py-[72px] lg:py-[110px]">
        <div className="wrap">
          <p className="section-label">By the numbers</p>
          <h2 className="display text-[clamp(34px,8.5vw,72px)]">Real conversation <span className="hl">is enough.</span></h2>
          <p className="text-ink-700 text-[17px] max-w-[680px] mt-[22px] mb-9">
            The show has built a loyal following across Spotify, Apple Podcasts and beyond. Not
            because it chases trends, but because it doesn&rsquo;t. The Mics Are Open has always trusted
            that real conversation — messy, funny, and occasionally profound — is enough. It turns
            out it is.
          </p>
          <div className="stats">
            <div><strong>#1</strong><span className="tmao-label block mt-2.5">In Kenya</span></div>
            <div><strong>500+</strong><span className="tmao-label block mt-2.5">Episodes &amp; minisodes</span></div>
            <div><strong>7 yrs</strong><span className="tmao-label block mt-2.5">And counting</span></div>
            <div><strong>Fri</strong><span className="tmao-label block mt-2.5">Every week</span></div>
          </div>
        </div>
      </section>

      {/* Range */}
      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap">
          <p className="section-label">The range is the point</p>
          <h2 className="display text-[clamp(34px,8.5vw,72px)]">Life doesn&rsquo;t stay in one lane. <span className="hl-y">Neither does the show.</span></h2>
          <ul className="flex flex-wrap gap-2.5 mt-7">
            {['Love & marriage', 'Kenyan politics', 'Drake vs Kendrick', 'What it means to come home', 'Is the grocery store a viable place to meet your partner?'].map((t, i) => (
              <li key={t} className={`font-extrabold uppercase text-[clamp(14px,3.6vw,20px)] px-3.5 py-2.5 border ${
                i === 2 ? 'bg-clay-500 border-clay-500' : i === 4 ? 'bg-[#FFD21F] border-[#FFD21F] text-[#0A0A0B]' : 'bg-[#141416] border-[#26262A]'
              }`}>{t}</li>
            ))}
          </ul>
          <p className="text-ink-700 text-[17px] max-w-[680px] mt-[22px]">
            Over the years the podcast has covered all of it — and plenty more. Available weekly wherever you get your podcasts.
          </p>
        </div>
      </section>

      {/* CTA — solid panel, photo in its own frame */}
      <section className="bleed split-hero" style={{ background: '#141416' }}>
        <div className="photo">
          <Image src="/collage/c6.jpg" alt="" fill sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" />
        </div>
        <div className="panel">
          <Chip value="New" label="Every Friday" />
          <h2 className="display fit mt-[18px] mb-7" style={fitStyle('Ready to join the conversation?', 72)}>
            Ready to join the <span className="hl">conversation?</span>
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/listen" className="btn-primary">Listen →</Link>
            <Link href="/open-mic" className="btn-white">Open Mic</Link>
            <Link href="/signup" className="btn-ghost">Join TMAO</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
