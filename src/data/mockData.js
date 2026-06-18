/**
 * Dummy data for the Dunstan Downs Campus Admin Panel.
 * No backend — everything here is generated deterministically so the panel
 * renders identical content on every load. Mirrors the shape used by /web.
 */

/* ----------------------------------------------------------------------------
 * Tiers (mirrors /web/src/data/nfts.js — badge classes match exactly)
 * ------------------------------------------------------------------------- */
export const TIERS = {
  Legendary: {
    name: 'Legendary',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-400/40',
    dotClass: 'bg-purple-400',
    supply: 3,
    priceSol: 50,
    priceUsdc: 7500,
  },
  Genesis: {
    name: 'Genesis',
    badgeClass: 'bg-gold/15 text-gold-light border-gold/50',
    dotClass: 'bg-gold',
    supply: 12,
    priceSol: 20,
    priceUsdc: 3000,
  },
  Rare: {
    name: 'Rare',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-400/40',
    dotClass: 'bg-blue-400',
    supply: 120,
    priceSol: 5,
    priceUsdc: 750,
  },
  Uncommon: {
    name: 'Uncommon',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    dotClass: 'bg-emerald-400',
    supply: 800,
    priceSol: 1.5,
    priceUsdc: 225,
  },
  Common: {
    name: 'Common',
    badgeClass: 'bg-white/5 text-white/70 border-white/15',
    dotClass: 'bg-white/60',
    supply: 5000,
    priceSol: 0.4,
    priceUsdc: 60,
  },
};

export const TIER_ORDER = ['Legendary', 'Genesis', 'Rare', 'Uncommon', 'Common'];
export const PHASES = ['Phase 1', 'Phase 2', 'Phase 3'];
export const PAYMENT_METHODS = ['SOL', 'USDC', 'Card'];
export const TX_STATUSES = ['Confirmed', 'Pending', 'Failed'];

const namesByTier = {
  Legendary: ['Tussock Sovereign', 'Ridge Monarch', 'Black Aurora'],
  Genesis: [
    'Otago Founder',
    'Cromwell Pioneer',
    'Highland Origin',
    'Wakatipu Patriarch',
    'Alpine Forebear',
    'Maniototo Elder',
    'Lindis Heritage',
    'Hawksburn Source',
    'Pisa Antecedent',
    'Carrick First',
    'Bannockburn Beginning',
    'Nevis Original',
  ],
  Rare: ['Tussock', 'Schist', 'Briar', 'Matagouri', 'Manuka', 'Kowhai'],
  Uncommon: ['Thyme', 'Bracken', 'Speargrass', 'Wilding', 'Tussock-Mist'],
  Common: ['Merino', 'Romney', 'Corriedale', 'Perendale', 'Drysdale'],
};

/* Deterministic pseudo-random so the data is stable across reloads */
function seeded(n) {
  const x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

function priceVariance(base, i) {
  const wobble = ((i * 37) % 13) / 100;
  return Number((base * (1 + wobble - 0.06)).toFixed(2));
}

const sheepFirst = [
  'Bramble', 'Clover', 'Maple', 'Atlas', 'Juniper', 'Onyx', 'Willow',
  'Cedar', 'Hazel', 'Flint', 'Sage', 'Echo', 'Birch', 'Aspen', 'Ash',
];

/* ----------------------------------------------------------------------------
 * Wallets / Holders
 * ------------------------------------------------------------------------- */
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function makeWallet(seed) {
  let s = '';
  for (let i = 0; i < 44; i++) {
    s += B58[Math.floor(seeded(seed + i * 7) * B58.length)];
  }
  return s;
}

export function shortAddress(addr) {
  if (!addr) return '';
  return addr.length > 14 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr;
}

/* ----------------------------------------------------------------------------
 * NFTs
 * ------------------------------------------------------------------------- */
function buildNfts() {
  const items = [];
  let serial = 1;
  const displayCaps = {
    Legendary: 3,
    Genesis: 12,
    Rare: 18,
    Uncommon: 16,
    Common: 16,
  };

  TIER_ORDER.forEach((tierKey) => {
    const tier = TIERS[tierKey];
    const cap = displayCaps[tierKey];
    const names = namesByTier[tierKey];
    for (let i = 0; i < cap; i++) {
      const number = String(serial).padStart(3, '0');
      const baseName = names[i % names.length];
      const name = `${baseName}${
        names.length < cap ? ` ${Math.floor(i / names.length) + 1}` : ''
      }`.trim();
      const isBlackSheep = tierKey === 'Legendary' && i === 2;
      const seed = `dunstan-${tierKey}-${i}-${serial}`;
      const image = `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;
      // ~ first 247 serials are "minted"
      const minted = serial <= 247 ? seeded(serial * 3) > 0.32 : false;
      items.push({
        id: `DDC-${number}`,
        number,
        name,
        tier: tierKey,
        image,
        phase: PHASES[i % PHASES.length],
        isBlackSheep,
        status: minted ? 'Minted' : 'Available',
        available: !minted,
        priceSol: priceVariance(tier.priceSol, i),
        priceUsdc: priceVariance(tier.priceUsdc, i),
        sheepName: `${sheepFirst[serial % sheepFirst.length]} ${baseName.split(' ')[0]}`,
      });
      serial++;
    }
  });
  return items;
}

export const NFTS = buildNfts();

/* ----------------------------------------------------------------------------
 * Holders / Users
 * ------------------------------------------------------------------------- */
function buildHolders() {
  const count = 24;
  const holders = [];
  const mintedNfts = NFTS.filter((n) => n.status === 'Minted');
  let cursor = 0;

  for (let i = 0; i < count; i++) {
    const wallet = makeWallet(i * 13 + 5);
    const ownCount = 1 + Math.floor(seeded(i * 5) * 5);
    const owned = [];
    for (let k = 0; k < ownCount && cursor < mintedNfts.length; k++) {
      owned.push(mintedNfts[cursor]);
      cursor = (cursor + 1) % mintedNfts.length;
    }
    const totalSpent = Number(
      owned.reduce((acc, n) => acc + n.priceSol, 0).toFixed(2)
    );
    const joinDays = Math.floor(seeded(i * 9 + 1) * 160) + 5;
    const joinDate = isoDaysAgo(joinDays);
    const status = seeded(i * 11) > 0.15 ? 'Active' : 'Dormant';
    holders.push({
      id: `USR-${String(i + 1).padStart(3, '0')}`,
      wallet,
      nftsOwned: owned.length,
      owned,
      totalSpent,
      joinDate,
      status,
      sheepNames: owned.map((n) => n.sheepName),
    });
  }
  return holders.sort((a, b) => b.totalSpent - a.totalSpent);
}

export const HOLDERS = buildHolders();

/* ----------------------------------------------------------------------------
 * Transactions
 * ------------------------------------------------------------------------- */
function isoDaysAgo(days, hour = 12) {
  const base = new Date('2026-06-18T00:00:00Z').getTime();
  const d = new Date(base - days * 86400000 + hour * 3600000);
  return d.toISOString();
}

function buildTransactions() {
  const txs = [];
  const mintedNfts = NFTS.filter((n) => n.status === 'Minted');
  const total = 60;
  for (let i = 0; i < total; i++) {
    const nft = mintedNfts[i % mintedNfts.length] || NFTS[i % NFTS.length];
    const holder = HOLDERS[i % HOLDERS.length];
    const method = PAYMENT_METHODS[Math.floor(seeded(i * 2) * PAYMENT_METHODS.length)];
    const r = seeded(i * 4 + 1);
    const status = r > 0.85 ? 'Failed' : r > 0.72 ? 'Pending' : 'Confirmed';
    const daysAgo = Math.floor(seeded(i * 6) * 30);
    const hour = Math.floor(seeded(i * 8) * 24);
    const amountSol = nft.priceSol;
    const gasFee = Number((0.00005 + seeded(i * 3) * 0.0004).toFixed(5));
    txs.push({
      id: `TX-${String(1000 + i)}`,
      nft: nft.id,
      nftName: nft.name,
      tier: nft.tier,
      buyer: holder.wallet,
      amountSol,
      amountUsdc: nft.priceUsdc,
      method,
      gasFee,
      date: isoDaysAgo(daysAgo, hour),
      daysAgo,
      status,
    });
  }
  return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const TRANSACTIONS = buildTransactions();

/* ----------------------------------------------------------------------------
 * Dashboard aggregates
 * ------------------------------------------------------------------------- */
export const DASHBOARD_STATS = {
  totalMinted: 247,
  totalSupply: 2100,
  totalRevenueSol: 4891,
  totalHolders: 203,
  transactionsToday: 12,
};

/* 30 days of daily sales, ending 18 Jun 2026 (deterministic). The dashboard
 * chart slices the last 7 / 14 / 30 of these based on the selected range. */
function buildDailySales() {
  const end = Date.parse('2026-06-18T00:00:00Z');
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(end - i * 86400000);
    const seed = 30 - i;
    const sales = 8 + Math.round(seeded(seed * 2.3) * 26); // 8..34 mints
    const sol = Math.round(sales * (14 + seeded(seed * 1.7) * 9)); // revenue
    out.push({
      day: d.toLocaleDateString('en-NZ', { weekday: 'short' }),
      label: d.toLocaleDateString('en-NZ', { day: '2-digit', month: 'short' }),
      sales,
      sol,
    });
  }
  return out;
}

export const SALES_DAILY = buildDailySales();
export const SALES_LAST_7_DAYS = SALES_DAILY.slice(-7);

export const PAYMENT_BREAKDOWN = [
  { name: 'SOL', value: 134 },
  { name: 'USDC', value: 78 },
  { name: 'Card', value: 35 },
];

/* ----------------------------------------------------------------------------
 * Collection settings (editable on the Settings page)
 * ------------------------------------------------------------------------- */
export const COLLECTION_SETTINGS = {
  name: 'Dunstan Downs Campus',
  description:
    'A flock of 2,100 high-country merino, immortalised on Solana. Own a sheep, own a piece of New Zealand — with studio access, farm-stay credits and producer rights baked in.',
  blackSheepEnabled: true,
  tiers: TIER_ORDER.map((key) => ({
    key,
    name: TIERS[key].name,
    priceSol: TIERS[key].priceSol,
    priceUsdc: TIERS[key].priceUsdc,
    supply: TIERS[key].supply,
  })),
  phases: [
    { name: 'Phase 1', label: 'Genesis Drop', enabled: true, released: 247 },
    { name: 'Phase 2', label: 'Highland Expansion', enabled: true, released: 0 },
    { name: 'Phase 3', label: 'The Full Flock', enabled: false, released: 0 },
  ],
};

/* Admin profile */
export const FALLBACK_AVATAR =
  'https://ui-avatars.com/api/?name=Fiznex&background=161a23&color=f0d08c&bold=true&size=160';

export const ADMIN_PROFILE = {
  name: 'Fiznex',
  email: 'hafiz@fiznex.com',
  role: 'Administrator',
  avatar:
    'https://media.licdn.com/dms/image/v2/D4D03AQHKOjHWN8JBRg/profile-displayphoto-scale_400_400/B4DZleMx5kIgAg-/0/1758222036232?e=1783555200&v=beta&t=OgSqh9Q5saIU2h_xfZqS61T1c1HZaomdjMcBQ5s1r4A',
};

/* Notifications for the topbar bell */
export const NOTIFICATIONS = [
  { id: 1, text: 'Otago Founder minted by 7xQ…3kP', time: '2m ago', unread: true },
  { id: 2, text: 'Phase 1 is 88% sold out', time: '1h ago', unread: true },
  { id: 3, text: 'Card payment failed — TX-1042', time: '3h ago', unread: true },
  { id: 4, text: 'New holder joined: 9aF…2mD', time: '5h ago', unread: false },
  { id: 5, text: 'Weekly revenue report ready', time: '1d ago', unread: false },
];

/* Date formatting helper used across tables */
export function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function fmtDateTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'short',
  })}, ${d.toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}
