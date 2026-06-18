import Badge from './ui/Badge';

/**
 * Maps a domain status string to a toned Badge. Centralises every status
 * color decision so "Confirmed" is the same green everywhere.
 */
const MAP = {
  // transactions
  Confirmed: { tone: 'success', dot: true },
  Pending: { tone: 'warning', dot: true, pulse: true },
  Failed: { tone: 'danger', dot: true },
  // nft availability
  Available: { tone: 'gold', dot: true },
  Minted: { tone: 'neutral', dot: true },
  // users
  Active: { tone: 'success', dot: true },
  Dormant: { tone: 'neutral', dot: true },
  // phases
  Enabled: { tone: 'success', dot: true },
  Disabled: { tone: 'neutral', dot: true },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = MAP[status] || { tone: 'neutral', dot: true };
  return (
    <Badge tone={cfg.tone} dot={cfg.dot} pulse={cfg.pulse} size={size}>
      {status}
    </Badge>
  );
}
