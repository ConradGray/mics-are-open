'use client';

import { useState } from 'react';
import AdminPostCard from './AdminPostCard';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function AdminQueue({ pending, approved, rejected }) {
  const [tab, setTab] = useState('pending');

  const lists = { pending, approved, rejected };
  const current = lists[tab];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-cream-100 rounded-xl p-1 mb-6">
        {TABS.map((t) => {
          const count = lists[t.key].length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition ${
                active
                  ? 'bg-clay-500 shadow-soft text-cream-50'
                  : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 text-xs rounded-full px-1.5 ${
                    active
                      ? t.key === 'pending'
                        ? 'bg-clay-100 text-clay-600'
                        : 'bg-cream-200 text-ink-500'
                      : 'bg-cream-200 text-ink-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Post list */}
      {current.length > 0 ? (
        <div className="space-y-3">
          {current.map((post) => (
            <AdminPostCard key={post.id} post={post} currentTab={tab} />
          ))}
        </div>
      ) : (
        <div className="card text-center text-ink-400 py-12">
          <p className="text-sm">
            {tab === 'pending'
              ? 'No posts waiting for review. Nice.'
              : tab === 'approved'
              ? 'No approved posts yet.'
              : 'Nothing rejected.'}
          </p>
        </div>
      )}
    </div>
  );
}
