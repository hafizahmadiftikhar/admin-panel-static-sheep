import { useRef } from 'react';

/**
 * 6-digit verification code input — auto-advances on type, handles backspace,
 * and accepts a pasted code. Value is the joined string; onChange(string).
 */
export default function CodeInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);
  const chars = value.padEnd(length, ' ').slice(0, length).split('');

  const setChar = (i, ch) => {
    const next = chars.slice();
    next[i] = ch || ' ';
    onChange(next.join('').replace(/ /g, ' ').trimEnd());
  };

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) {
      setChar(i, '');
      return;
    }
    setChar(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !chars[i].trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={chars[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-14 w-full rounded-lg border border-white/10 bg-ink text-center font-serif text-2xl text-gold-light transition-all duration-200 focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,64,0.12)] focus:outline-none"
        />
      ))}
    </div>
  );
}
