import './globals.css';
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
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="border-t-2 border-clay-500 py-6 px-8">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
              © 2026 The Good Company
            </span>
            <div className="flex items-center gap-5">
              <a href="/about" className="text-xs text-ink-400 hover:text-clay-500 transition tracking-wider">About</a>
              <a href="/listen" className="text-xs text-ink-400 hover:text-clay-500 transition tracking-wider">Listen</a>
              <a href="https://www.youtube.com/playlist?list=PLURaeuNWMwdy894eBMVPwR67ZDQpSWwsg" target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:text-clay-500 transition tracking-wider">YouTube</a>
              <a href="https://open.spotify.com/show/6aU9hxLKdMIEzBfQ2IhYt6" target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:text-clay-500 transition tracking-wider">Spotify</a>
              <a href="https://thegoodcompany.co.ke" target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:text-clay-500 transition tracking-wider">thegoodcompany.co.ke</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
