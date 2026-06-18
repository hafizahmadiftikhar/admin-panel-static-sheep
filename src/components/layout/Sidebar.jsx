import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../config/nav';
import { useAuth } from '../../context/AuthContext';

/**
 * Collapsible sidebar.
 *  - 240px expanded / 64px collapsed (persisted to localStorage by AdminLayout).
 *  - Active route: gold left border + gold text + gold-tinted fill.
 *  - Collapsed: icons only, with a hover tooltip per item.
 */
export default function Sidebar({ collapsed, onToggle }) {
  const { logout } = useAuth();

  return (
    <aside
      className="sticky top-0 z-30 hidden h-screen flex-shrink-0 flex-col border-r border-white/8 bg-ink-2/60 backdrop-blur-sm transition-[width] duration-300 ease-out md:flex"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Brand */}
      <div
        className={`flex h-16 items-center border-b border-white/8 ${
          collapsed ? 'justify-center px-0' : 'px-5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gold/60 bg-ink-2">
            <span className="font-serif text-lg text-gold-light">D</span>
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-base text-gold-light">
                Dunstan Downs
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Admin
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Nav — when collapsed, tooltips must escape the sidebar, so we keep
          overflow visible (an overflow-y container would force overflow-x:auto
          and show a horizontal scrollbar under the collapsed icons). */}
      <nav
        className={`flex-1 space-y-1 px-3 py-4 ${
          collapsed ? 'overflow-visible' : 'overflow-y-auto'
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex h-11 items-center rounded-lg transition-all duration-200 ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-3'
              } ${
                isActive
                  ? 'bg-gold/10 text-gold-light'
                  : 'text-white/55 hover:bg-white/5 hover:text-gold-light'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,64,0.4)]"
                  />
                )}
                <item.icon
                  size={19}
                  className="flex-shrink-0 transition-colors"
                />
                {!collapsed && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
                {collapsed && (
                  <span className="nav-tooltip">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: logout + collapse toggle */}
      <div className="space-y-1 border-t border-white/8 px-3 py-3">
        <button
          onClick={logout}
          className={`group relative flex h-11 w-full items-center rounded-lg text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-red-300 ${
            collapsed ? 'justify-center px-0' : 'gap-3 px-3'
          }`}
        >
          <LogOut size={19} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Log out</span>}
          {collapsed && <span className="nav-tooltip">Log out</span>}
        </button>

        <button
          onClick={onToggle}
          className={`group relative flex h-11 w-full items-center rounded-lg text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-gold-light ${
            collapsed ? 'justify-center px-0' : 'gap-3 px-3'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={19} className="flex-shrink-0" />
          ) : (
            <PanelLeftClose size={19} className="flex-shrink-0" />
          )}
          {!collapsed && <span className="text-sm">Collapse</span>}
          {collapsed && <span className="nav-tooltip">Expand</span>}
        </button>
      </div>
    </aside>
  );
}
