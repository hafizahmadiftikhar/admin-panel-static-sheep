import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

/**
 * Lightweight toaster. Call `toast('message')` from anywhere. Toasts stack at
 * the bottom-right and auto-dismiss. Rendered in a portal above modals.
 */
const ToastContext = createContext(null);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, opts = {}) => {
    const id = ++counter;
    setToasts((list) => [
      ...list,
      { id, message, type: opts.type || 'success' },
    ]);
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, opts.duration || 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-white/10 bg-ink-2 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${
                    t.type === 'error'
                      ? 'border-red-400/40 bg-red-500/10 text-red-300'
                      : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                  }`}
                >
                  {t.type === 'error' ? (
                    <AlertCircle size={14} />
                  ) : (
                    <Check size={14} />
                  )}
                </span>
                <span className="text-sm text-gold-light">{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
