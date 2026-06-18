import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { shortAddress } from '../data/mockData';
import { useToast } from '../context/ToastContext';

/**
 * Renders a shortened wallet address with a copy button. Clicking copy writes
 * the FULL address to the clipboard and fires a toast. Stops propagation so it
 * works inside clickable table rows without triggering the row action.
 */
export default function WalletAddress({
  address,
  textClassName = 'text-xs text-white/70',
  iconSize = 13,
  className = '',
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = address;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast('Wallet address copied');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`font-mono ${textClassName}`}>
        {shortAddress(address)}
      </span>
      <button
        type="button"
        onClick={copy}
        title="Copy wallet address"
        aria-label="Copy wallet address"
        className="flex-shrink-0 text-white/35 transition-colors hover:text-gold-light"
      >
        {copied ? (
          <Check size={iconSize} className="text-emerald-300" />
        ) : (
          <Copy size={iconSize} />
        )}
      </button>
    </span>
  );
}
