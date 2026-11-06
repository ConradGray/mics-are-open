// Size a display headline so its longest word always fits its panel.
// Uses container-query units (cqi) of the nearest .split-hero .panel, capped at `max`.
// Montserrat 900 caps averages ~0.8em per character; we size for the longest word.
export function fitStyle(text, max = 84) {
  const longest = String(text)
    .split(/\s+/)
    .reduce((n, w) => Math.max(n, w.length), 1);
  const cqi = Math.min(14, 100 / (0.84 * longest));
  return { '--fit': `${cqi.toFixed(2)}cqi`, '--max': `${max}px` };
}
