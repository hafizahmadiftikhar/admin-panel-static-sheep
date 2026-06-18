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
 * title + subtitle. Add a route here and it appears in both places
 * automatically.
 */
export const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    title: 'Dashboard',
    subtitle: 'Overview of mints, revenue and recent activity',
    icon: LayoutDashboard,
  },
  {
    to: '/nfts',
    label: 'NFT Management',
    title: 'NFT Management',
    subtitle: 'Manage artwork, pricing, tiers and phase releases',
    icon: Images,
  },
  {
    to: '/users',
    label: 'Users & Holders',
    title: 'Users & Holders',
    subtitle: 'Browse holders, ownership and wallet activity',
    icon: Users,
  },
  {
    to: '/transactions',
    label: 'Transactions',
    title: 'Transactions',
    subtitle: 'Every mint, payment method and its status',
    icon: ArrowLeftRight,
  },
  {
    to: '/settings',
    label: 'Collection Settings',
    title: 'Collection Settings',
    subtitle: 'Tier pricing, phases and collection identity',
    icon: Settings,
  },
  {
    to: '/profile',
    label: 'Profile',
    title: 'Profile',
    subtitle: 'Your admin account and security',
    icon: UserCog,
  },
];

function matchForPath(pathname) {
  return NAV_ITEMS.find((i) => pathname.startsWith(i.to));
}

export function titleForPath(pathname) {
  return matchForPath(pathname)?.title ?? 'Admin';
}

export function subtitleForPath(pathname) {
  return matchForPath(pathname)?.subtitle ?? '';
}
