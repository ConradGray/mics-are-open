'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const EMPTY_FORM = { episode_num: '', title: '', description: '', embed_url: '' };

export default function ThreadsPanel({ userId, threads, onCreate, onDelete, onUpdate }) {
  const supabase = createClient();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // ── Create ────────────────────────────────────────────

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setCreateError(null);

    const { data, error } = await supabase.from('tmao_threads').insert({
      episode_num: form.episode_num ? parseInt(form.episode_num, 10) : null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      embed_url: form.embed_url.trim() || null,
      created_by: userId,
    }).select().single();

    setSaving(false);
    if (error) { setCreateError(error.message); return; }

    onCreate?.(data);
    setForm(EMPTY_FORM);
    setShowCreate(false);
  }

  // ── Edit ──────────────────────────────────────────────

  function startEdit(thread) {
    setEditingId(thread.id);
    setEditForm({
      episode_num: thread.episode_num ?? '',
      title: thread.title ?? '',
      description: thread.description ?? '',
      embed_url: thread.embed_url ?? '',
    });
    setEditError(null);
  }

  function handleEditChange(e) {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleEditSave(threadId) {
    if (!editForm.title.trim()) return;
    setEditSaving(true);
    setEditError(null);

    const { error } = await supabase.from('tmao_threads').update({
      episode_num: editForm.episode_num ? parseInt(editForm.episode_num, 10) : null,
      title: editForm.title.trim(),
      description: editForm.description.trim() || null,
      embed_url: editForm.embed_url.trim() || null,
    }).eq('id', threadId);

    setEditSaving(false);
    if (error) { setEditError(error.message); return; }

    onUpdate?.(threadId, {
      episode_num: editForm.episode_num ? parseInt(editForm.episode_num, 10) : null,
      title: editForm.title.trim(),
      description: editForm.description.trim() || null,
      embed_url: editForm.embed_url.trim() || null,
    });
    setEditingId(null);
  }

  // ── Delete ────────────────────────────────────────────

  async function handleDelete(threadId) {
    if (!window.confirm('Delete this thread? All replies will also be deleted.')) return;
    setDeletingId(threadId);

    const { error } = await supabase.from('tmao_threads').delete().eq('id', threadId);
    setDeletingId(null);
    if (error) { alert(error.message); return; }
    onDelete?.(threadId);
  }

  // ── Render ────────────────────────────────────────────

  return (
    <div>
      {/* Create button */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{threads.length} episode thread{threads.length !== 1 ? 's' : ''}</p>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2 px-4">
            + New Thread
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="card border border-clay-500/30 mb-6">
          <h3 className="font-display text-lg text-ink-800 mb-4">New Episode Thread</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="flex gap-3">
              <div className="w-28">
                <label className="block text-xs font-semibold text-ink-500 mb-1">Episode #</label>
                <input type="number" name="episode_num" value={form.episode_num} onChange={handleChange} placeholder="e.g. 42" className="input text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-ink-500 mb-1">Title <span className="text-clay-500">*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Episode title" required className="input text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's this episode about?" rows={2} className="input resize-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Audio embed URL</label>
              <input type="url" name="embed_url" value={form.embed_url} onChange={handleChange} placeholder="YouTube, Spotify, or SoundCloud embed URL" className="input text-sm" />
              <p className="text-[11px] text-ink-400 mt-1">YouTube: Share → Embed → copy src URL · SoundCloud: Share → Embed → copy src URL</p>
            </div>
            {createError && <p className="text-xs text-clay-600">{createError}</p>}
            <div className="flex items-center gap-2 pt-1">
              <button type="submit" disabled={saving || !form.title.trim()} className="btn-primary text-sm py-1.5 px-4">
                {saving ? 'Creating…' : 'Create Thread'}
              </button>
              <button type="button" onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }} className="btn-ghost text-sm py-1.5 px-4">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Threads list */}
      {threads.length === 0 ? (
        <div className="card text-center py-16 text-ink-400">
          <p className="text-sm">No threads yet. Create the first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map(thread => (
            <div key={thread.id} className="card">
              {editingId === thread.id ? (
                // Edit form
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-28">
                      <label className="block text-xs font-semibold text-ink-500 mb-1">Episode #</label>
                      <input type="number" name="episode_num" value={editForm.episode_num} onChange={handleEditChange} className="input text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-ink-500 mb-1">Title</label>
                      <input type="text" name="title" value={editForm.title} onChange={handleEditChange} required className="input text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-500 mb-1">Description</label>
                    <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={2} className="input resize-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-500 mb-1">Embed URL (YouTube, Spotify, or SoundCloud)</label>
                    <input type="url" name="embed_url" value={editForm.embed_url} onChange={handleEditChange} className="input text-sm" />
                  </div>
                  {editError && <p className="text-xs text-clay-600">{editError}</p>}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditSave(thread.id)}
                      disabled={editSaving || !editForm.title.trim()}
                      className="btn-primary text-sm py-1.5 px-4"
                    >
                      {editSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-ghost text-sm py-1.5 px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display view
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-cream-100 border border-cream-200 flex items-center justify-center">
                    <span className="font-display text-sm text-clay-500">
                      {thread.episode_num ? `EP${thread.episode_num}` : '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-800 text-sm">{thread.title}</p>
                    {thread.description && (
                      <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{thread.description}</p>
                    )}
                    <p className="text-[10px] text-ink-400 mt-1">
                      {new Date(thread.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      {thread.embed_url && ' · has audio embed'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(thread)}
                      className="text-xs text-ink-400 hover:text-ink-700 transition px-2 py-1 rounded hover:bg-cream-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(thread.id)}
                      disabled={deletingId === thread.id}
                      className="text-xs text-ink-400 hover:text-red-500 transition px-2 py-1 rounded hover:bg-red-950/30 disabled:opacity-40"
                    >
                      {deletingId === thread.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
