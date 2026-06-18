import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select — the custom gold dropdown carried over verbatim from /web,
 * with an optional label. options: [{ value, label }].
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setOpenUp(spaceBelow < 260 && rect.top > 260);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = menuRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [open]);

  return (
    <div className={className}>
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-ink px-4 text-left text-sm text-gold-light transition-all duration-200 focus:outline-none ${
            open
              ? 'border-gold shadow-[0_0_0_3px_rgba(201,168,64,0.12)]'
              : 'border-white/10 hover:border-gold/50'
          }`}
        >
          <span className={`truncate ${selected ? '' : 'text-white/30'}`}>
            {selected ? selected.label : placeholder || 'Select…'}
          </span>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 text-gold transition-transform duration-200 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              ref={menuRef}
              role="listbox"
              initial={{ opacity: 0, y: openUp ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUp ? 4 : -4 }}
              transition={{ duration: 0.15 }}
              className={`ddc-menu absolute left-0 right-0 z-30 ${
                openUp ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
            >
              {options.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  data-active={o.value === value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="ddc-menu-option"
                >
                  <span className="truncate">{o.label}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
