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
            <a href="/" aria-label="The Mics Are Open — home">
              <Image src="/logo-tmao.png" alt="The Mics Are Open" width={340} height={80} className="h-10 w-auto" />
            </a>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3.5">
              {[
                ['/about', 'About'],
                ['/listen', 'Listen'],
                ['/privacy', 'Privacy'],
                ['https://www.youtube.com/playlist?list=PLURaeuNWMwdy894eBMVPwR67ZDQpSWwsg', 'YouTube'],
                ['https://open.spotify.com/show/6aU9hxLKdMIEzBfQ2IhYt6', 'Spotify'],
                ['https://thegoodcompany.co.ke', 'thegoodcompany.co.ke'],
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
            <span className="text-xs tracking-[0.06em] text-ink-400">© 2026 The Good Company</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
