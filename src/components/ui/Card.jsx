/**
 * Reusable Card surface. `hover` enables the gold-glow lift (card-gold);
 * otherwise it's a static panel. Optional header (title + action).
 */
export default function Card({
  children,
  title,
  subtitle,
  action,
  hover = false,
  className = '',
  bodyClassName = '',
}) {
  return (
    <div className={`${hover ? 'card-gold' : 'card-static'} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h3 className="font-serif text-lg text-gold-light">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-white/45">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName || (title ? 'p-5' : 'p-5')}>{children}</div>
    </div>
  );
}
