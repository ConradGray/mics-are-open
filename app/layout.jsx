import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'The Mics Are Open — Listener Community',
  description:
    'A warm little home for listeners of The Mics Are Open. Share what the show sparked, meet other listeners, and shoutout the people in your life.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cozy min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-cream-200 py-8 text-center text-sm text-ink-400">
          Made with warmth for the TMAO community.
        </footer>
      </body>
    </html>
  );
}
