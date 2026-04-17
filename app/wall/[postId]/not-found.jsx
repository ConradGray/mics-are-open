import Link from 'next/link';

export default function PostNotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center pt-16">
      <h1 className="font-display text-3xl font-semibold text-ink-800">
        Post not found
      </h1>
      <p className="mt-3 text-ink-500">
        This post may have been removed or hasn&rsquo;t been approved yet.
      </p>
      <Link href="/wall" className="btn-primary mt-6 inline-flex">
        Back to the Wall
      </Link>
    </div>
  );
}
