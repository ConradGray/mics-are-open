import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <div className="max-w-md mx-auto card mt-8 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink-800">
        We couldn&rsquo;t find that listener.
      </h1>
      <p className="mt-3 text-ink-600">
        Either the username doesn&rsquo;t exist, or they haven&rsquo;t set up
        their profile yet.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Back home
      </Link>
    </div>
  );
}
