// Presentation helpers for episode threads (no data access here).

// Pull the 11-char YouTube id out of an embed/watch/short URL.
export function youtubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// The episode's own YouTube thumbnail (what listeners see on YouTube).
export function youtubeThumb(url, quality = 'hqdefault') {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}

// Best available thumbnail for the homepage hero. maxresdefault only exists
// for some uploads (YouTube 404s with a grey placeholder otherwise), so check
// it first and fall back to hqdefault. Returns null when there's no video id.
// Result is cached for an hour so the homepage doesn't hit YouTube per request.
export async function bestYoutubeThumb(url) {
  const id = youtubeId(url);
  if (!id) return null;
  for (const quality of ['maxresdefault', 'hqdefault']) {
    const src = `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
    try {
      const res = await fetch(src, { method: 'HEAD', next: { revalidate: 3600 } });
      if (res.ok) return src;
    } catch {
      // network hiccup — try the next size, then give up
    }
  }
  return null;
}

// Split a title so the last word can be set in the highlight colour,
// like the episode thumbnails: "Give me back My [Dowry!!!]".
export function splitHighlight(title = '') {
  const t = String(title).trim();
  const i = t.lastIndexOf(' ');
  if (i <= 0) return { lead: '', hl: t };
  return { lead: t.slice(0, i + 1), hl: t.slice(i + 1) };
}

export function shortDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
