'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function CrewPanel({ currentUserId, crew: initCrew, allUsers: initAllUsers }) {
  const supabase = createClient();

  const [crew, setCrew] = useState(initCrew);
  const [allUsers, setAllUsers] = useState(initAllUsers);
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState(null);
  const [error, setError] = useState(null);

  const nonCrew = allUsers.filter(u => !crew.find(c => c.id === u.id));
  const filtered = search.trim()
    ? nonCrew.filter(u =>
        (u.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
      )
    : nonCrew;

  async function addToCrew(user) {
    setActing(user.id);
    setError(null);
    const { error: err } = await supabase.from('tmao_profiles').update({ is_crew: true }).eq('id', user.id);
    setActing(null);
    if (err) { setError(err.message); return; }
    setCrew(prev => [{ ...user, is_crew: true }, ...prev]);
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_crew: true } : u));
    setSearch('');
  }

  async function removeFromCrew(userId) {
    if (userId === currentUserId) {
      alert("You can't remove yourself from the crew.");
      return;
    }
    if (!window.confirm('Remove this person from the crew? They will lose admin access.')) return;
    setActing(userId);
    setError(null);
    const { error: err } = await supabase.from('tmao_profiles').update({ is_crew: false }).eq('id', userId);
    setActing(null);
    if (err) { setError(err.message); return; }
    setCrew(prev => prev.filter(u => u.id !== userId));
  }

  return (
    <div>
      {/* Current crew */}
      <div className="mb-8">
        <h3 className="font-display text-lg text-ink-800 mb-4">Current crew ({crew.length})</h3>
        {crew.length === 0 ? (
          <div className="card text-center py-10 text-ink-400 text-sm">No crew members yet.</div>
        ) : (
          <div className="space-y-2">
            {crew.map(member => (
              <div key={member.id} className="card flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0">
                  {member.avatar_url ? (
                    <Image src={member.avatar_url} alt="" fill sizes="36px" className="object-cover" />
                  ) : (
                    <span className="font-display text-sm text-clay-500">
                      {(member.display_name || '?').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-800 text-sm">
                    {member.display_name || 'No name'}
                    {member.id === currentUserId && (
                      <span className="ml-2 text-[10px] font-normal text-clay-500 uppercase tracking-wider">you</span>
                    )}
                  </p>
                  {member.username && (
                    <p className="text-xs text-ink-400">@{member.username}</p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-clay-500/20 text-clay-500 border border-clay-500/30">
                    Crew
                  </span>
                  {member.id !== currentUserId && (
                    <button
                      onClick={() => removeFromCrew(member.id)}
                      disabled={acting === member.id}
                      className="text-xs text-ink-400 hover:text-red-500 transition px-2 py-1 rounded hover:bg-red-950/20 disabled:opacity-40"
                    >
                      {acting === member.id ? 'Removing…' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add crew member */}
      <div>
        <h3 className="font-display text-lg text-ink-800 mb-2">Add someone to the crew</h3>
        <p className="text-xs text-ink-400 mb-4">They must already have an account. Search by name or username.</p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users…"
          className="input text-sm mb-3"
        />
        {error && <p className="text-xs text-clay-600 mb-2">{error}</p>}
        {search.trim() && (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-ink-400 text-center py-4">No users found.</p>
            ) : (
              filtered.slice(0, 10).map(user => (
                <div key={user.id} className="card flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt="" fill sizes="36px" className="object-cover" />
                    ) : (
                      <span className="font-display text-sm text-clay-500">
                        {(user.display_name || '?').slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-800 text-sm">{user.display_name || 'No name'}</p>
                    {user.username && <p className="text-xs text-ink-400">@{user.username}</p>}
                  </div>
                  <button
                    onClick={() => addToCrew(user)}
                    disabled={acting === user.id}
                    className="shrink-0 text-xs font-semibold rounded-lg px-3 py-1.5 bg-clay-500/20 text-clay-500 border border-clay-500/40 hover:bg-clay-500 hover:text-[#0D0D0D] transition disabled:opacity-40"
                  >
                    {acting === user.id ? 'Adding…' : '+ Add to crew'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
