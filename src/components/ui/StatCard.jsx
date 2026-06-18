import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Reusable StatCard — KPI tile for the dashboard.
 * Shows a label, big value, optional sub-text, an icon chip, and an optional
 * trend pill. Inherits the gold-glow hover from `.card-gold`.
 */
export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendUp = true,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="card-gold p-5"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-light">
            <Icon size={17} />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-serif text-3xl leading-none text-gold-light">
          {value}
        </span>
        {sub && <span className="pb-0.5 text-sm text-white/40">{sub}</span>}
      </div>

      {trend && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
              trendUp
                ? 'bg-emerald-500/10 text-emerald-300'
                : 'bg-red-500/10 text-red-300'
            }`}
          >
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
          <span className="text-white/35">vs last week</span>
        </div>
      )}
    </motion.div>
  );
}
