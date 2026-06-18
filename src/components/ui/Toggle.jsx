/**
 * Reusable Toggle switch — gold track when on, clean white knob, subtle.
 * Track 44×24, knob 20px with 2px inset on every side. Controlled via
 * `checked` / `onChange`.
 */
export default function Toggle({ checked, onChange, label, description, id }) {
  const switchEl = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/40 ${
        checked ? 'bg-gold' : 'bg-white/15'
      }`}
    >
      <span
        className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  if (!label && !description) return switchEl;

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4"
    >
      <span className="min-w-0">
        {label && (
          <span className="block text-sm font-medium text-gold-light">
            {label}
          </span>
        )}
        {description && (
          <span className="mt-0.5 block text-xs text-white/45">{description}</span>
        )}
      </span>
      {switchEl}
    </label>
  );
}
