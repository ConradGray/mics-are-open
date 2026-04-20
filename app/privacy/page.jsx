export const metadata = {
  title: 'Privacy Policy — The Mics Are Open',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">

      <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
        <span className="inline-block w-8 h-px bg-clay-500" />
        Legal
      </p>
      <div className="w-10 h-0.5 bg-clay-500 mb-6" />
      <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.92] text-ink-800 mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-ink-400 mb-10">Last updated: April 2026</p>

      <div className="space-y-10 text-sm text-ink-600 leading-relaxed">

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Who we are</h2>
          <p>
            The Mics Are Open is a listener community for Kenya&rsquo;s #1 podcast, operated by
            The Good Company. This site is at tmao.fm. If you have questions about this policy,
            email us at <a href="mailto:info@conradgray.com" className="text-clay-500 hover:underline">info@conradgray.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">What we collect and why</h2>
          <p className="mb-3">We only collect what we need to run the community:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Email address</strong> — used to create your account and send you a login link. We do not send marketing emails.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Profile information</strong> — your display name, username, location (optional), and bio (optional). This is shown publicly on your profile page.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Profile photo</strong> — if you choose to upload one. Stored securely and shown on your profile.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Posts and replies</strong> — anything you write on Open Mic or in Episode Threads. These are public and visible to all visitors.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">What we do not do</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span>We do not sell your data to anyone.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span>We do not share your personal information with third parties except where necessary to operate the service (see below).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span>We do not serve ads or allow advertisers to target you based on your data.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Who we share data with</h2>
          <p className="mb-3">We use a small number of trusted services to run the site:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Supabase</strong> — our database and authentication provider. Your account data is stored securely on their platform.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Vercel</strong> — our hosting provider. They serve the website.</span>
            </li>
          </ul>
          <p className="mt-3">Both services are GDPR-compliant. We do not pass your data to any other parties.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Your rights</h2>
          <p className="mb-3">
            Under the Kenya Data Protection Act 2019, you have the right to access, correct, or delete
            the personal data we hold about you.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Edit your profile</strong> — visit your profile page at any time to update your name, username, photo, location, or bio.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay-500 shrink-0 mt-0.5">—</span>
              <span><strong className="text-ink-700">Delete your account</strong> — email us at <a href="mailto:info@conradgray.com" className="text-clay-500 hover:underline">info@conradgray.com</a> and we will remove your account and all associated data within 14 days.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Cookies</h2>
          <p>
            We use a single session cookie to keep you logged in. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Changes to this policy</h2>
          <p>
            If we make significant changes, we&rsquo;ll update the date at the top of this page. We won&rsquo;t do
            anything unexpected with your data.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink-800 text-base mb-3">Contact</h2>
          <p>
            Questions? Email <a href="mailto:info@conradgray.com" className="text-clay-500 hover:underline">info@conradgray.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
