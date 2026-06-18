import { motion } from 'framer-motion';

/**
 * Shared shell for the full-screen auth routes (login / forgot / reset).
 * Dark grain background, ambient gold glows, brand mark, and a centered
 * gold-glow card. Keeps all auth screens pixel-identical.
 */
export default function AuthShell({ children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink bg-grain px-4">
      {/* Ambient gold glows (subtle) */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/5 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/[0.03] blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-ink-2 shadow-gold">
            <span className="font-serif text-2xl text-gold-light">D</span>
          </span>
          <h1 className="mt-5 font-serif text-3xl text-gold-light">
            Dunstan Downs Campus
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">
            Admin Console
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/8 bg-ink-2 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-xs text-white/30">{footer}</p>
        )}
      </motion.div>
    </div>
  );
}
