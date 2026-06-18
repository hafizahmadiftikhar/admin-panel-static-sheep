import { TIERS } from '../data/mockData';

/**
 * Tier pill — reuses the exact tier badge classes from /web so Legendary
 * (purple), Genesis (gold), Rare (blue), Uncommon (emerald) and Common (grey)
 * look identical across both projects.
 */
export default function TierBadge({ tier, size = 'sm' }) {
  const t = TIERS[tier];
  if (!t) return null;
  const padding = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${t.badgeClass} ${padding} font-medium uppercase tracking-wide`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${t.dotClass}`} />
      {t.name}
    </span>
  );
}
