import Link from 'next/link';
import Image from 'next/image';
import Chip from './Chip';

// Solid panel CTA with the photo in its own frame (faces rule).
export default function CommunityCta() {
  return (
    <section className="bleed split-hero bg-[#141416]" style={{ background: '#141416' }}>
      <div className="photo">
        <Image src="/collage/c6.jpg" alt="The hosts mid-conversation in the studio" fill sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="panel">
        <Chip value="New" label="Every Friday" />
        <h2 className="display mt-4 mb-7 text-[clamp(36px,9vw,72px)] lg:text-[clamp(36px,4.6vw,72px)]">
          Already a listener? <span className="hl">Come talk about it.</span>
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/open-mic" className="btn-primary">Open Mic →</Link>
          <Link href="/threads" className="btn-white">Episode Threads</Link>
          <Link href="/signup" className="btn-ghost">Join TMAO</Link>
        </div>
      </div>
    </section>
  );
}
