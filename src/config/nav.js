import {
  LayoutDashboard,
  Images,
  Users,
  ArrowLeftRight,
  Settings,
  UserCog,
} from 'lucide-react';

/**
 * Single nav definition — drives the sidebar links AND the dynamic topbar
 * title. Add a route here and it appears in both places automatically.
 */
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { to: '/nfts', label: 'NFT Management', title: 'NFT Management', icon: Images },
  { to: '/users', label: 'Users & Holders', title: 'Users & Holders', icon: Users },
  { to: '/transactions', label: 'Transactions', title: 'Transactions', icon: ArrowLeftRight },
  { to: '/settings', label: 'Collection Settings', title: 'Collection Settings', icon: Settings },
  { to: '/profile', label: 'Profile', title: 'Profile', icon: UserCog },
];

export function titleForPath(pathname) {
  const match = NAV_ITEMS.find((i) => pathname.startsWith(i.to));
  return match ? match.title : 'Admin';
}
