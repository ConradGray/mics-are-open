'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ThreadCreateForm({ userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    episode_num: '',
    title: '',
    description: '',
    embed_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: insertErr } = await supabase.from('tmao_threads').insert({
      episode_num: form.episode_num ? parseInt(form.episode_num, 10) : null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      embed_url: form.embed_url.trim() || null,
      created_by: userId,
    });

    setSaving(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setSuccess(true);
    setForm({ episode_num: '', title: '', description: '', embed_url: '' });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mb-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary text-sm py-2 px-4"
        >
          + New Episode Thread
        </button>
      ) : (
        <div className="card border-clay-500/30">
          <h3 className="font-display text-lg font-semibold text-ink-800 mb-4">
            Create Episode Thread
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="w-28">
                <label className="block text-xs font-semibold text-ink-500 mb-1">
                  Episode #
                </label>
                <input
                  type="number"
                  name="episode_num"
                  value={form.episode_num}
                  onChange={handleChange}
                  placeholder="e.g. 42"
                  className="input text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-ink-500 mb-1">
                  Title <span className="text-clay-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Episode title"
                  required
                  className="input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What's this episode about?"
                rows={2}
                className="input resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">
                Audio embed URL
              </label>
              <input
                type="url"
                name="embed_url"
                value={form.embed_url}
                onChange={handleChange}
                placeholder="SoundCloud or Spotify embed URL"
                className="input text-sm"
              />
              <p className="text-[11px] text-ink-400 mt-1">
                Use the embed URL from SoundCloud (Share → Embed → copy src URL)
              </p>
            </div>

            {error && (
              <p className="text-xs text-clay-600">{error}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="btn-primary text-sm py-1.5 px-4"
              >
                {saving ? 'Creating…' : 'Create Thread'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost text-sm py-1.5 px-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {success && (
        <p className="text-sm text-ink-500 mt-2">Thread created and live.</p>
      )}
    </div>
  );
}
