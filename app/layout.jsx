import './globals.css';
import Image from 'next/image';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'The Mics Are Open — Listener Community',
  description:
    'Kenya\'s #1 podcast. Make a profile, drop something on Open Mic, and connect with other listeners.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cozy min-h-screen flex flex-col">
        <Nav />
        <main className="site-main flex-1 mx-auto w-full max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-[#26262A] pt-8 pb-10">
          <div className="wrap flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <a href="/" aria-label="The Mics Are Open — home" className="shrink-0">
              <Image src="/logo-tmao.png" alt="The Mics Are Open" width={340} height={80} className="h-10 w-auto" />
            </a>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3.5">
              {[
                ['/about', 'About'],
                ['/listen', 'Listen'],
                ['/privacy', 'Privacy'],
                ['https://www.youtube.com/playlist?list=PLURaeuNWMwdy894eBMVPwR67ZDQpSWwsg', 'YouTube'],
                ['https://open.spotify.com/show/6aU9hxLKdMIEzBfQ2IhYt6', 'Spotify'],
                // Desyn Lab (desynlab.co.ke) is linked once, via the "Built by" credit below.
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600 hover:text-white transition"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          {/* Bottom row: copyright left, "Built by" credit right (stacks on mobile) */}
          <div className="wrap mt-6">
           <div className="pt-5 border-t border-[#26262A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs tracking-[0.06em] text-ink-400">© {new Date().getFullYear()} The Mics Are Open</span>
            <a
              href="https://desynlab.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 self-start sm:self-auto opacity-70 hover:opacity-100 transition"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-600">Built by</span>
              <Image src="/desynlab-wordmark-white.png" alt="Desyn Lab" width={308} height={40} className="h-[15px] w-auto" />
            </a>
           </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
