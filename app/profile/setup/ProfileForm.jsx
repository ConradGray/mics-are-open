'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

export default function ProfileForm({ userId, initial, email }) {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState(initial?.username || '');
  const [displayName, setDisplayName] = useState(initial?.display_name || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [bio, setBio] = useState(initial?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('Photo must be under 4MB.');
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('tmao-avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('tmao-avatars').getPublicUrl(filePath);

    setAvatarUrl(publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!USERNAME_RE.test(username)) {
      setError(
        'Username must be 3–24 characters, lowercase letters, numbers, or underscore.'
      );
      return;
    }
    if (!displayName.trim()) {
      setError('Please add a name.');
      return;
    }

    setSaving(true);

    const { error: upErr } = await supabase
      .from('tmao_profiles')
      .update({
        username: username.trim().toLowerCase(),
        display_name: displayName.trim(),
        location: location.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl || null,
      })
      .eq('id', userId);

    setSaving(false);

    if (upErr) {
      if (upErr.code === '23505') {
        setError('That username is taken. Try another.');
      } else {
        setError(upErr.message);
      }
      return;
    }

    // Mark profile as complete in session metadata so middleware can enforce setup
    await supabase.auth.updateUser({ data: { profile_complete: true } });

    router.push(`/u/${username.trim().toLowerCase()}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Your avatar"
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="font-display text-2xl text-clay-500">
              {(displayName || email || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <label className="btn-ghost text-sm cursor-pointer">
          {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Add a photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <label className="label" htmlFor="displayName">
          Name
        </label>
        <input
          id="displayName"
          className="input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="What should people call you?"
          maxLength={60}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="username">
          Username
        </label>
        <div className="flex items-center gap-2">
          <span className="text-ink-400 text-sm">tmao.fm/u/</span>
          <input
            id="username"
            className="input flex-1"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            placeholder="your_handle"
            maxLength={24}
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="location">
          Location <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input
          id="location"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, country — wherever you listen from"
          maxLength={80}
        />
      </div>

      <div>
        <label className="label" htmlFor="bio">
          Why did you find TMAO?
        </label>
        <textarea
          id="bio"
          className="input resize-none"
          rows={3}
          maxLength={160}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="One line is plenty. What brought you here?"
        />
        <p className="text-xs text-ink-400 mt-1 text-right">
          {bio.length}/160
        </p>
      </div>

      {error && (
        <p className="text-sm text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}
