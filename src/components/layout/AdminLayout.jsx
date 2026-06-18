import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { NAV_ITEMS } from '../../config/nav';
import { useAuth } from '../../context/AuthContext';

const COLLAPSE_KEY = 'ddc.admin.sidebarCollapsed';

/**
 * App shell: persistent collapsible sidebar + sticky topbar + animated page
 * outlet. Sidebar collapse state is persisted to localStorage. On mobile the
 * sidebar becomes a slide-in drawer.
 */
export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COLLAPSE_KEY)) ?? false;
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-ink bg-grain">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/8 bg-ink-2"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-ink-2">
                    <span className="font-serif text-lg text-gold-light">D</span>
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-serif text-base text-gold-light">
                      Dunstan Downs
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Admin
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/50"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex h-11 items-center gap-3 rounded-lg px-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-gold/10 text-gold-light'
                          : 'text-white/55 hover:bg-white/5 hover:text-gold-light'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold" />
                        )}
                        <item.icon size={19} />
                        <span className="text-sm">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-white/8 px-3 py-3">
                <button
                  onClick={logout}
                  className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-red-300"
                >
                  <LogOut size={19} /> Log out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
