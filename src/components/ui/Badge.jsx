/**
 * Reusable Badge — pill label used for statuses, tiers, counts, etc.
 * `tone` selects a color scheme; `dot` renders a leading status dot.
 */
const TONES = {
  gold: 'bg-gold/15 text-gold-light border-gold/50',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
  danger: 'bg-red-500/15 text-red-300 border-red-400/40',
  info: 'bg-blue-500/15 text-blue-300 border-blue-400/40',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-400/40',
  neutral: 'bg-white/5 text-white/70 border-white/15',
};

const DOTS = {
  gold: 'bg-gold',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  purple: 'bg-purple-400',
  neutral: 'bg-white/60',
};

export default function Badge({
  children,
  tone = 'neutral',
  dot = false,
  pulse = false,
  size = 'sm',
  className = '',
}) {
  const padding = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium uppercase tracking-wide ${TONES[tone]} ${padding} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]} ${
            pulse ? 'pulse-dot' : ''
          }`}
        />
      )}
      {children}
    </span>
  );
}
