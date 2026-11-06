// The TMAO number tag: [#371 | EVERY FRIDAY]
// tone: 'r' (red, default) | 'y' (yellow) | 'p' (purple) | 'k' (black)
export default function Chip({ value, label, tone = 'r', small = false, className = '' }) {
  const toneClass = tone === 'r' ? '' : tone;
  return (
    <span className={`chip ${toneClass} ${small ? 'sm' : ''} ${className}`.trim()}>
      <b>{value}</b>
      {label ? <span>{label}</span> : null}
    </span>
  );
}
