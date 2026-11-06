import Link from 'next/link';
import Chip from './Chip';
import { youtubeThumb, splitHighlight, shortDate } from '@/lib/episodes';

const TONES = ['r', 'y', 'p'];

// Thumbnail on top (no overlay — faces stay clear), text on a solid panel below.
export default function EpisodeCard({ thread, index = 0, feature = false, replyCount }) {
  const tone = feature ? 'k' : TONES[index % 3];
  const thumb = youtubeThumb(thread.embed_url, feature ? 'maxresdefault' : 'hqdefault');
  const { lead, hl } = splitHighlight(thread.title);
  const hlClass = tone === 'y' ? 'hl-y' : tone === 'p' ? 'text-[#B57EDC]' : 'hl';
  const count = typeof replyCount === 'number' ? replyCount : thread.tmao_thread_replies?.length;

  return (
    <Link href={`/threads/${thread.id}`} className={`ep-card ${feature ? 'feature' : ''}`}>
      <div className="thumb">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={`Episode ${thread.episode_num || ''} thumbnail`} loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#141416]">
            <span className="display text-5xl text-ink-400">#{thread.episode_num || '—'}</span>
          </div>
        )}
      </div>
      <div className="ct">
        <Chip small value={thread.episode_num ? `#${thread.episode_num}` : 'TMAO'} label={shortDate(thread.published_at)} tone={tone} className="self-start" />
        <h3>
          {lead}
          <span className={feature ? 'hl' : hlClass}>{hl}</span>
        </h3>
        {typeof count === 'number' && (
          <span className="meta tmao-label">
            {count} {count === 1 ? 'reply' : 'replies'} →
          </span>
        )}
      </div>
    </Link>
  );
}
