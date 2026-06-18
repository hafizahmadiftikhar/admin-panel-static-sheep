import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ChevronDown, Menu, User, LogOut } from 'lucide-react';
import { titleForPath, subtitleForPath } from '../../config/nav';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import { FALLBACK_AVATAR } from '../../data/mockData';

/**
 * Top navbar — dynamic page title (left), global search (centered, same on
 * every page), and an avatar dropdown (right).
 */
export default function Topbar({ onOpenMobileNav }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const title = titleForPath(location.pathname);
  const subtitle = subtitleForPath(location.pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Mobile hamburger */}
        <button
          onClick={onOpenMobileNav}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-gold-light transition-colors hover:border-gold/50 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic page title + subtitle (left) */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="min-w-0 flex-shrink-0"
        >
          <h1 className="font-serif text-lg leading-tight text-gold-light sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden max-w-[220px] truncate text-xs leading-tight text-white/45 md:block lg:max-w-sm">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Global search (center) */}
        <div className="hidden flex-1 justify-center px-2 md:flex">
          <div className="relative w-full max-w-xl">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NFTs, wallets, transactions…"
              className="field h-10 pl-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-gold-light"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Avatar dropdown (right) */}
        <div ref={menuRef} className="relative ml-auto flex-shrink-0 md:ml-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-white/10 py-1 pl-1 pr-2 transition-all duration-200 hover:border-gold/50 hover:shadow-[0_0_12px_rgba(201,168,64,0.16)]"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="h-8 w-8 rounded-full border border-gold/30 object-cover"
            />
            <span className="hidden text-sm text-gold-light sm:block">
              {profile.name.split(' ')[0]}
            </span>
            <ChevronDown
              size={14}
              className={`text-white/40 transition-transform duration-200 ${
                menuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-2 p-2 shadow-[0_16px_44px_rgba(0,0,0,0.5)]"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm text-gold-light">
                    {profile.name}
                  </p>
                  <p className="truncate text-xs text-white/40">
                    {profile.email}
                  </p>
                </div>
                <div className="gold-divider my-1" />
                <button
                  onClick={() => navigate('/profile')}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gold-light transition-colors hover:bg-white/5"
                >
                  <User size={15} /> Profile
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-white/5"
                >
                  <LogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="relative px-4 pb-3 md:hidden">
        <Search
          size={16}
          className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-white/35"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="field h-10 pl-10"
        />
      </div>
    </header>
  );
}
