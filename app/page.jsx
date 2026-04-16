import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center text-center pt-8 md:pt-20">
      <p className="uppercase tracking-[0.25em] text-xs font-semibold text-clay-500 mb-4">
        A listener community
      </p>
      <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-800 max-w-3xl">
        The mics are open —
        <span className="text-clay-500"> pull up a chair.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-600 leading-relaxed">
        TMAO is more than a podcast. It&rsquo;s a room full of people who heard
        the same thing and felt something about it. Make a profile, post on the
        Wall, and meet the rest of us.
      </p>

      <div className="mt-10 flex gap-3">
        {user ? (
          <Link href="/me" className="btn-primary">
            Go to your profile →
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

      <section className="mt-24 grid gap-6 md:grid-cols-3 w-full">
        <FeatureCard
          badge="Now live"
          title="Profiles"
          body="Name, place, photo, and a line about how you found the show."
        />
        <FeatureCard
          badge="Soon"
          title="The Wall"
          body="A rolling feed of listener thoughts, reactions, and moments."
        />
        <FeatureCard
          badge="Soon"
          title="Episode threads"
          body="Keep talking about the episode long after it ends."
        />
      </section>
    </div>
  );
}

function FeatureCard({ badge, title, body }) {
  return (
    <div className="card text-left">
      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-clay-500 bg-clay-50 rounded-full px-2.5 py-1">
        {badge}
      </span>
      <h3 className="mt-3 font-display text-2xl font-semibold text-ink-800">
        {title}
      </h3>
      <p className="mt-2 text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}
