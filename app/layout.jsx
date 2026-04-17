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
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
              © 2025 The Good Company
            </span>
            <span className="text-xs text-ink-400 tracking-wider">
              thegoodcompany.co.ke
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
