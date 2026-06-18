/**
 * ============================================================================
 *  DUNSTAN DOWNS CAMPUS — SHARED DESIGN TOKENS
 * ============================================================================
 *  Single source of truth for the design system, extracted verbatim from the
 *  public web project (`/web`). Both the marketing site and this admin panel
 *  consume these tokens so the two surfaces stay pixel-identical forever.
 *
 *  - tailwind.config.js imports `colors`, `fontFamily`, `boxShadow`, `radii`.
 *  - Runtime code (Recharts, Framer Motion, inline styles) imports the same
 *    values so charts and animations match the CSS exactly.
 *
 *  To re-theme BOTH projects, edit this one file (and copy it into /web/src).
 * ============================================================================
 */

/* --- Core palette ---------------------------------------------------------- */
export const colors = {
  // Ink surfaces (backgrounds, deepest → lighter)
  ink: '#0e1118', // app background
  ink2: '#161a23', // card background
  ink3: '#1e2330', // inset / image placeholder background

  // Gold accent ramp
  gold: '#c9a840', // primary accent
  goldLight: '#f0d08c', // primary text / highlights
  goldDeep: '#8a6f1c', // gradient foot / pressed

  // Supporting surfaces (pulled from index.css)
  menuBg: '#1a1d26', // dropdown menu background
  menuBorder: '#2a2d36', // dropdown menu border
  scrollThumb: '#2a2f3d', // scrollbar thumb

  // Semantic status colors (Tailwind 400-weights used across the web cards)
  success: '#34d399', // emerald-400 — confirmed / available / online
  warning: '#fbbf24', // amber-400  — pending
  danger: '#f87171', // red-400    — failed / destructive
  info: '#60a5fa', // blue-400   — neutral info

  // Tier ramp (mirrors data/nfts.js badge colors)
  tierLegendary: '#c084fc', // purple-400
  tierGenesis: '#f0d08c', // gold-light
  tierRare: '#60a5fa', // blue-400
  tierUncommon: '#34d399', // emerald-400
  tierCommon: '#d1d5db', // grey-300
};

/* --- Typography ------------------------------------------------------------ */
export const fontFamily = {
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
};

/* --- Border radius (12px cards / 8px controls) ----------------------------- */
export const radii = {
  lg: '0.5rem', // 8px  — buttons, inputs, controls
  xl: '0.75rem', // 12px — cards
  full: '9999px',
};

/* --- Elevation / glow ------------------------------------------------------ */
export const boxShadow = {
  gold: '0 0 24px rgba(201, 168, 64, 0.35)',
  'gold-strong': '0 0 32px rgba(240, 208, 140, 0.55)',
};

/* --- Spacing / sizing primitives (the "44 / 44 / 12" contract) ------------- */
export const sizing = {
  buttonHeight: '2.75rem', // 44px
  inputHeight: '2.75rem', // 44px
  cardRadius: '0.75rem', // 12px
  sidebarExpanded: 240, // px
  sidebarCollapsed: 64, // px
  topbarHeight: 64, // px
};

/* --- Motion ---------------------------------------------------------------- */
export const motionTokens = {
  page: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  spring: { type: 'spring', stiffness: 380, damping: 32 },
};

/* --- Chart palette (Recharts) --------------------------------------------- */
export const chartColors = {
  line: colors.gold,
  lineSoft: colors.goldLight,
  grid: 'rgba(255,255,255,0.06)',
  axis: 'rgba(255,255,255,0.35)',
  tooltipBg: colors.menuBg,
  tooltipBorder: colors.menuBorder,
  // Donut: SOL / USDC / Card
  donut: [colors.gold, colors.info, colors.goldLight],
};

const theme = {
  colors,
  fontFamily,
  radii,
  boxShadow,
  sizing,
  motionTokens,
  chartColors,
};

export default theme;
