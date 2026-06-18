# Dunstan Downs Campus — Admin Panel

A standalone React + Vite admin console for managing the Dunstan Downs Campus
NFT collection. The design system is extracted **verbatim** from the public web
project (`../web`) and shared via [`src/theme.js`](src/theme.js) so both
surfaces stay pixel-identical.

## Tech stack

- **React 18 + Vite** (JSX)
- **TailwindCSS** — tokens driven by `src/theme.js`
- **Framer Motion** — page + element transitions
- **React Router DOM** — routing + protected routes
- **Recharts** — dashboard charts
- **Lucide React** — icons

## Getting started

```bash
cd admin
npm install
npm run dev      # http://localhost:5174
npm run build    # production build → dist/
```

Login accepts **any credentials** (mock auth) and routes to the dashboard.

## Shared theme

`src/theme.js` is the single source of truth for colors, fonts, radii, shadows,
sizing (the 44px button / 44px input / 12px card contract) and chart colors.
`tailwind.config.js` imports it, and runtime code (charts, motion) reads the
same values. To re-theme **both** projects, edit `theme.js` and copy it into
`../web/src/`.

## Structure

```
src/
  theme.js                 shared design tokens
  config/nav.js            nav + dynamic page titles
  context/                 AuthContext, SearchContext
  data/mockData.js         dummy NFTs, holders, transactions, stats
  components/
    ui/                    Button, Input, Badge, Modal, DataTable,
                           StatCard, Select, Toggle, Card  (all reusable)
    layout/                Sidebar, Topbar, AdminLayout
    TierBadge, StatusBadge
  pages/                   Login, Dashboard, NFTManagement, Users,
                           Transactions, CollectionSettings, Profile
```

## Pages

| Route            | Page                | Notes                                            |
| ---------------- | ------------------- | ------------------------------------------------ |
| `/login`         | Login               | Any credentials → dashboard                      |
| `/dashboard`     | Dashboard           | 4 stat cards, gold area chart, donut, recent txns |
| `/nfts`          | NFT Management      | Card grid, tier/phase filters, edit/upload/phase  |
| `/users`         | Users & Holders     | Table + holder detail modal                      |
| `/transactions`  | Transactions        | Filters, status badges, CSV export               |
| `/settings`      | Collection Settings | Tier prices, phases, black sheep, save bar       |
| `/profile`       | Profile             | Avatar upload, name edit, change password        |

Sidebar collapse state and the session persist to `localStorage`. All data is
dummy — there is no backend yet.
