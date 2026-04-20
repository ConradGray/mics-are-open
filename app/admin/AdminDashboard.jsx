'use client';

import { useState } from 'react';
import AdminPostCard from './AdminPostCard';
import ThreadsPanel from './ThreadsPanel';
import CrewPanel from './CrewPanel';

const QUEUE_TABS = [
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function AdminDashboard({
  userId, crewName,
  pending: initPending,
  approved: initApproved,
  rejected: initRejected,
  hotTakes: initHotTakes,
  threads: initThreads,
  crew,
  allUsers: initAllUsers,
  stats,
}) {
  const [tab, setTab] = useState('queue');
  const [queueTab, setQueueTab] = useState('pending');
  const [allUsers, setAllUsers] = useState(initAllUsers);
  const [deletingUser, setDeletingUser] = useState(null);
  const [revealedEmails, setRevealedEmails] = useState({});
  const [loadingEmail, setLoadingEmail] = useState(null);

  async function handleRevealEmail(targetUserId) {
    if (revealedEmails[targetUserId]) return;
    setLoadingEmail(targetUserId);
    try {
      const res = await fetch('/api/admin/get-user-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId }),
      });
      const data = await res.json();
      if (data.email) {
        setRevealedEmails(prev => ({ ...prev, [targetUserId]: data.email }));
      }
    } catch {
      // fail silently
    }
    setLoadingEmail(null);
  }

  async function handleDeleteUser(targetUser) {
    if (!window.confirm(`Remove "${targetUser.display_name || targetUser.username || 'this user'}" from the community? This cannot be undone.`)) return;
    setDeletingUser(targetUser.id);
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to delete user.');
      } else {
        setAllUsers(prev => prev.filter(u => u.id !== targetUser.id));
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setDeletingUser(null);
  }

  // Local state for optimistic updates — no page reloads
  const [pending,  setPending]  = useState(initPending);
  const [approved, setApproved] = useState(initApproved);
  const [rejected, setRejected] = useState(initRejected);
  const [hotTakes, setHotTakes] = useState(initHotTakes);
  const [threads,  setThreads]  = useState(initThreads);

  // ── Callbacks ──────────────────────────────────────────

  function handleApprove(postId) {
    const post = pending.find(p => p.id === postId) || rejected.find(p => p.id === postId);
    if (!post) return;
    setPending(ps => ps.filter(x => x.id !== postId));
    setRejected(ps => ps.filter(x => x.id !== postId));
    setApproved(ps => [{ ...post, status: 'approved' }, ...ps]);
  }

  function handleReject(postId) {
    const post = pending.find(p => p.id === postId) || approved.find(p => p.id === postId);
    if (!post) return;
    setPending(ps => ps.filter(x => x.id !== postId));
    setApproved(ps => ps.filter(x => x.id !== postId));
    setHotTakes(ps => ps.filter(x => x.id !== postId));
    setRejected(ps => [{ ...post, status: 'rejected' }, ...ps]);
  }

  function handleDelete(postId) {
    setPending(ps => ps.filter(x => x.id !== postId));
    setApproved(ps => ps.filter(x => x.id !== postId));
    setRejected(ps => ps.filter(x => x.id !== postId));
    setHotTakes(ps => ps.filter(x => x.id !== postId));
  }

  function handleHotTakeToggle(postId, nowHotTake) {
    if (nowHotTake) {
      const post = approved.find(p => p.id === postId);
      if (post) setHotTakes(ps => [{ ...post, is_hot_take: true }, ...ps.filter(x => x.id !== postId)]);
    } else {
      setHotTakes(ps => ps.filter(x => x.id !== postId));
    }
    setApproved(ps => ps.map(x => x.id === postId ? { ...x, is_hot_take: nowHotTake, is_hot_take_winner: nowHotTake ? x.is_hot_take_winner : false } : x));
  }

  function handleWinner(postId) {
    setHotTakes(ps => ps.map(x => ({ ...x, is_hot_take_winner: x.id === postId })));
    setApproved(ps => ps.map(x => ({ ...x, is_hot_take_winner: x.id === postId })));
  }

  function handleThreadCreate(thread) {
    setThreads(ts => [thread, ...ts]);
  }

  function handleThreadDelete(threadId) {
    setThreads(ts => ts.filter(t => t.id !== threadId));
  }

  function handleThreadUpdate(threadId, updates) {
    setThreads(ts => ts.map(t => t.id === threadId ? { ...t, ...updates } : t));
  }

  // ── Derived ────────────────────────────────────────────
  const winner = hotTakes.find(p => p.is_hot_take_winner);
  const lists = { pending, approved, rejected };

  // ── Render ─────────────────────────────────────────────
  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <p className="uppercase tracking-[0.25em] text-[9px] font-bold text-clay-500 mb-2 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-clay-500" />
          Crew only
        </p>
        <h1 className="font-display text-4xl text-ink-800">Crew Dashboard</h1>
        <p className="mt-1 text-ink-500 text-sm">Hey {crewName} — here&apos;s what needs your attention.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="card py-4 text-center">
          <p className="font-display text-3xl text-ink-800">{allUsers.length}</p>
          <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Members</p>
        </div>
        <div className={`card py-4 text-center ${pending.length > 0 ? 'border border-clay-500/40' : ''}`}>
          <p className={`font-display text-3xl ${pending.length > 0 ? 'text-clay-500' : 'text-ink-800'}`}>
            {pending.length}
          </p>
          <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Awaiting review</p>
          {pending.length > 0 && (
            <p className="text-[10px] text-clay-500 mt-1">needs attention</p>
          )}
        </div>
        <div className="card py-4 text-center">
          <p className="font-display text-3xl text-ink-800">{stats.approvedThisWeek}</p>
          <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Approved this week</p>
        </div>
        <div className="card py-4 text-center">
          <p className="font-display text-3xl text-ink-800">{hotTakes.length}</p>
          <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Hot takes</p>
          {winner && (
            <p className="text-[10px] text-clay-500 mt-1 truncate px-2">👑 winner set</p>
          )}
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-cream-100 rounded-xl p-1 mb-6">
        {[
          { key: 'queue',    label: `Queue`, badge: pending.length || null },
          { key: 'hottakes', label: `Hot Takes`, badge: hotTakes.length || null },
          { key: 'threads',  label: `Threads`, badge: threads.length || null },
          { key: 'members',  label: `Members`, badge: allUsers.length || null },
          { key: 'crew',     label: `Crew`, badge: null },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition ${
              tab === t.key
                ? 'bg-clay-500 text-cream-50 shadow-soft'
                : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className={`ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 text-xs rounded-full px-1.5 ${
                tab === t.key ? 'bg-cream-200 text-ink-600' : 'bg-cream-200 text-ink-400'
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── QUEUE TAB ───────────────────────────────── */}
      {tab === 'queue' && (
        <div>
          {/* Sub-tabs */}
          <div className="flex gap-2 mb-4">
            {QUEUE_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setQueueTab(t.key)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition border ${
                  queueTab === t.key
                    ? 'border-cream-200 bg-cream-100 text-ink-800'
                    : 'border-transparent text-ink-400 hover:text-ink-600'
                }`}
              >
                {t.label}
                {lists[t.key].length > 0 && (
                  <span className="ml-1.5 text-xs text-ink-400">
                    {lists[t.key].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {lists[queueTab].length > 0 ? (
            <div className="space-y-3">
              {lists[queueTab].map(post => (
                <AdminPostCard
                  key={post.id}
                  post={post}
                  currentTab={queueTab}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  onHotTakeToggle={handleHotTakeToggle}
                  onWinner={handleWinner}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-16 text-ink-400">
              <p className="text-sm">
                {queueTab === 'pending' ? '✓ Nothing waiting for review.' :
                 queueTab === 'approved' ? 'No approved posts yet.' :
                 'Nothing rejected.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── HOT TAKES TAB ───────────────────────────── */}
      {tab === 'hottakes' && (
        <div>
          {winner && (
            <div className="card border border-clay-500/50 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-clay-500 mb-3">
                👑 This week&apos;s winner
              </p>
              <AdminPostCard
                key={winner.id}
                post={winner}
                currentTab="approved"
                isHotTakeTab
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onHotTakeToggle={handleHotTakeToggle}
                onWinner={handleWinner}
              />
            </div>
          )}

          {hotTakes.filter(p => !p.is_hot_take_winner).length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">
                {winner ? 'Other hot takes' : 'Hot takes — pick a winner'}
              </p>
              <div className="space-y-3">
                {hotTakes.filter(p => !p.is_hot_take_winner).map(post => (
                  <AdminPostCard
                    key={post.id}
                    post={post}
                    currentTab="approved"
                    isHotTakeTab
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    onHotTakeToggle={handleHotTakeToggle}
                    onWinner={handleWinner}
                  />
                ))}
              </div>
            </div>
          ) : !winner ? (
            <div className="card text-center py-16 text-ink-400">
              <p className="text-sm">No hot takes yet. Mark posts from the Queue tab.</p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── THREADS TAB ─────────────────────────────── */}
      {tab === 'threads' && (
        <ThreadsPanel
          userId={userId}
          threads={threads}
          onCreate={handleThreadCreate}
          onDelete={handleThreadDelete}
          onUpdate={handleThreadUpdate}
        />
      )}

      {/* ── MEMBERS TAB ─────────────────────────────── */}
      {tab === 'members' && (
        <div>
          <p className="text-xs text-ink-400 mb-4 uppercase tracking-wider">{allUsers.length} members signed up</p>
          <div className="space-y-2">
            {allUsers.map(user => (
              <div key={user.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm text-clay-500">
                    {(user.display_name || user.username || '?').slice(0, 1).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-800 text-sm">{user.display_name || 'No name'}</p>
                  {user.username && <p className="text-xs text-ink-400">@{user.username}</p>}
                  {revealedEmails[user.id] && (
                    <p className="text-xs text-clay-500 mt-0.5 font-mono">{revealedEmails[user.id]}</p>
                  )}
                </div>
                {user.is_crew && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-clay-500/20 text-clay-500 border border-clay-500/30 shrink-0">
                    Crew
                  </span>
                )}
                {!revealedEmails[user.id] && (
                  <button
                    onClick={() => handleRevealEmail(user.id)}
                    disabled={loadingEmail === user.id}
                    className="text-xs text-ink-400 hover:text-clay-500 transition px-2 py-1 rounded hover:bg-cream-200 disabled:opacity-40 shrink-0"
                  >
                    {loadingEmail === user.id ? '…' : 'Email'}
                  </button>
                )}
                {user.id !== userId && (
                  <button
                    onClick={() => handleDeleteUser(user)}
                    disabled={deletingUser === user.id}
                    className="text-xs text-ink-400 hover:text-red-500 transition px-2 py-1 rounded hover:bg-red-950/20 disabled:opacity-40 shrink-0"
                  >
                    {deletingUser === user.id ? 'Removing…' : 'Remove'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CREW TAB ────────────────────────────────── */}
      {tab === 'crew' && (
        <CrewPanel
          currentUserId={userId}
          crew={crew}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}
