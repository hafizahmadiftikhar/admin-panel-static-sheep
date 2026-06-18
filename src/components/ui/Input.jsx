import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable Input — wraps the shared `.field` class (44px, gold focus ring).
 * Supports an optional leading icon, label, hint and error state.
 *
 * Password inputs automatically get a show/hide eye toggle on the right.
 */
const Input = forwardRef(function Input(
  {
    label,
    icon: Icon,
    error,
    hint,
    className = '',
    containerClassName = '',
    type = 'text',
    as = 'input',
    rows = 4,
    ...props
  },
  ref
) {
  const Tag = as;
  const isPassword = as === 'input' && type === 'password';
  const [show, setShow] = useState(false);
  const effectiveType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className={containerClassName}>
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
            <Icon size={16} />
          </span>
        )}
        <Tag
          ref={ref}
          type={as === 'input' ? effectiveType : undefined}
          rows={as === 'textarea' ? rows : undefined}
          className={`field ${Icon ? 'pl-10' : ''} ${
            isPassword ? 'pr-11' : ''
          } ${error ? '!border-red-400/70' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-gold-light"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-300/90">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
