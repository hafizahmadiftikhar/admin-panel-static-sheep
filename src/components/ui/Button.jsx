import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button — the single source of truth for every clickable action.
 * Variants map 1:1 to the shared CSS button classes (identical to /web):
 *   - solid  → btn-gold-solid (filled gold, primary CTA)
 *   - gold   → btn-gold       (outline → fills gold + glow on hover)
 *   - ghost  → btn-ghost      (neutral outline)
 *   - sm     → btn-gold-sm    (compact outline)
 *   - danger → btn-danger     (destructive)
 * All variants share the 44px height contract and gold-glow hover.
 */
const VARIANTS = {
  solid: 'btn-gold-solid',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
  sm: 'btn-gold-sm',
  danger: 'btn-danger',
};

export default function Button({
  children,
  variant = 'solid',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  to,
  type = 'button',
  ...props
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.solid} ${
    disabled || loading ? 'pointer-events-none opacity-60' : ''
  } ${className}`;

  const iconSize = variant === 'sm' ? 14 : 16;
  const content = (
    <>
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        Icon && <Icon size={iconSize} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
