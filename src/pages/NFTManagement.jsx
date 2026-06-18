import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Pencil,
  Eye,
  EyeOff,
  Layers,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import TierBadge from '../components/TierBadge';
import StatusBadge from '../components/StatusBadge';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toggle from '../components/ui/Toggle';
import DataTable from '../components/ui/DataTable';
import { NFTS, TIER_ORDER, PHASES } from '../data/mockData';
import { useSearch } from '../context/SearchContext';

const TIER_OPTIONS = [
  { value: 'All', label: 'All tiers' },
  ...TIER_ORDER.map((t) => ({ value: t, label: t })),
];
const PHASE_OPTIONS = [
  { value: 'All', label: 'All phases' },
  ...PHASES.map((p) => ({ value: p, label: p })),
];
const STATUS_DRAFT_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Minted', label: 'Minted' },
];

const blankDraft = {
  name: '',
  tier: TIER_ORDER[0],
  phase: PHASES[0],
  priceSol: 0,
  priceUsdc: 0,
  status: 'Available',
};

export default function NFTManagement() {
  const { query } = useSearch();
  const [nfts, setNfts] = useState(NFTS);
  const [tier, setTier] = useState('All');
  const [phase, setPhase] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [phaseReleases, setPhaseReleases] = useState({
    'Phase 1': true,
    'Phase 2': true,
    'Phase 3': false,
  });

  // Edit-details modal
  const [editing, setEditing] = useState(null); // the NFT being edited (or null)
  const [draft, setDraft] = useState(blankDraft);
  const [uploadOpen, setUploadOpen] = useState(false);

  const term = (query || '').trim().toLowerCase();

  const filtered = useMemo(() => {
    return nfts.filter((n) => {
      if (tier !== 'All' && n.tier !== tier) return false;
      if (phase !== 'All' && n.phase !== phase) return false;
      if (term) {
        const hay = `${n.name} ${n.id} ${n.number}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [nfts, tier, phase, term]);

  const toggleAvailability = (id) =>
    setNfts((list) =>
      list.map((n) =>
        n.id === id
          ? {
              ...n,
              available: !n.available,
              status: !n.available ? 'Available' : 'Minted',
            }
          : n
      )
    );

  const openEdit = (nft) => {
    setEditing(nft);
    setDraft({
      name: nft.name,
      tier: nft.tier,
      phase: nft.phase,
      priceSol: nft.priceSol,
      priceUsdc: nft.priceUsdc,
      status: nft.status,
    });
  };

  const saveEdit = () => {
    setNfts((list) =>
      list.map((n) =>
        n.id === editing.id
          ? {
              ...n,
              name: draft.name.trim() || n.name,
              tier: draft.tier,
              phase: draft.phase,
              priceSol: Number(draft.priceSol) || n.priceSol,
              priceUsdc: Number(draft.priceUsdc) || n.priceUsdc,
              status: draft.status,
              available: draft.status === 'Available',
            }
          : n
      )
    );
    setEditing(null);
  };

  const setField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const mintedCount = nfts.filter((n) => n.status === 'Minted').length;

  // ---- list view columns ----
  const columns = [
    {
      key: 'nft',
      header: 'NFT',
      render: (n) => (
        <div className="flex items-center gap-3">
          <img
            src={n.image}
            alt={n.name}
            loading="lazy"
            className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/10 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-gold-light">{n.name}</p>
            <p className="text-xs text-white/40">#{n.number}</p>
          </div>
        </div>
      ),
    },
    { key: 'tier', header: 'Tier', render: (n) => <TierBadge tier={n.tier} /> },
    {
      key: 'phase',
      header: 'Phase',
      render: (n) => <span className="text-white/65">{n.phase}</span>,
    },
    {
      key: 'priceSol',
      header: 'Price',
      align: 'right',
      render: (n) => <span className="font-medium text-gold">{n.priceSol} SOL</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (n) => <StatusBadge status={n.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (n) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(n);
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-gold-light/80 transition-all duration-200 hover:border-gold/60 hover:text-gold-light"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAvailability(n.id);
            }}
            title={n.available ? 'Mark minted' : 'Mark available'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gold-light/80 transition-all duration-200 hover:border-gold/60 hover:text-gold-light"
          >
            {n.available ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/45">
          <span className="text-gold-light">{mintedCount}</span> minted ·{' '}
          <span className="text-gold-light">{nfts.length - mintedCount}</span>{' '}
          available · {filtered.length} shown
        </p>
        <Button variant="solid" icon={Upload} onClick={() => setUploadOpen(true)}>
          Upload Artwork
        </Button>
      </div>

      {/* Phase release toggles */}
      <div className="card-static p-5">
        <div className="mb-4 flex items-center gap-2">
          <Layers size={16} className="text-gold" />
          <h3 className="font-serif text-lg text-gold-light">Phase Releases</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PHASES.map((p) => (
            <div
              key={p}
              className="flex items-center justify-between rounded-lg border border-white/8 bg-ink px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gold-light">{p}</p>
                <p className="text-xs text-white/40">
                  {phaseReleases[p] ? 'Released' : 'Locked'}
                </p>
              </div>
              <Toggle
                checked={phaseReleases[p]}
                onChange={(v) => setPhaseReleases((s) => ({ ...s, [p]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Filters + view switch (no search — global search is in the topbar) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Select
            value={tier}
            onChange={setTier}
            options={TIER_OPTIONS}
            className="w-full sm:w-44"
          />
          <Select
            value={phase}
            onChange={setPhase}
            options={PHASE_OPTIONS}
            className="w-full sm:w-44"
          />
        </div>

        {/* Grid / List toggle */}
        <div className="inline-flex h-11 items-center gap-1 rounded-lg border border-white/10 bg-ink p-1">
          <button
            onClick={() => setView('grid')}
            className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-xs transition-all duration-200 ${
              view === 'grid'
                ? 'bg-gold/15 text-gold-light'
                : 'text-white/50 hover:text-gold-light'
            }`}
          >
            <LayoutGrid size={15} /> Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-xs transition-all duration-200 ${
              view === 'list'
                ? 'bg-gold/15 text-gold-light'
                : 'text-white/50 hover:text-gold-light'
            }`}
          >
            <ListIcon size={15} /> List
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((nft, i) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.25) }}
              className="card-gold group overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-ink-3">
                <img
                  src={nft.image}
                  alt={nft.name}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    nft.isBlackSheep ? 'brightness-[0.55] contrast-125' : ''
                  }`}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute left-3 top-3">
                  <TierBadge tier={nft.tier} />
                </div>
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-light/80 backdrop-blur">
                    {nft.phase}
                  </span>
                </div>
                {nft.isBlackSheep && (
                  <div className="absolute left-3 top-12">
                    <Badge tone="gold">Black Sheep</Badge>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <StatusBadge status={nft.status} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="truncate font-serif text-lg text-gold-light">
                    {nft.name}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-white/40">
                    #{nft.number}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Price
                  </span>
                  <span className="text-sm font-medium text-gold">
                    {nft.priceSol} SOL
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(nft)}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 text-xs text-gold-light/80 transition-all duration-200 hover:border-gold/60 hover:text-gold-light hover:shadow-[0_0_10px_rgba(201,168,64,0.14)]"
                  >
                    <Pencil size={13} /> Edit details
                  </button>
                  <button
                    onClick={() => toggleAvailability(nft.id)}
                    title={nft.available ? 'Mark minted' : 'Mark available'}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gold-light/80 transition-all duration-200 hover:border-gold/60 hover:text-gold-light hover:shadow-[0_0_10px_rgba(201,168,64,0.14)]"
                  >
                    {nft.available ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* LIST / TABLE VIEW */}
      {view === 'list' && (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={openEdit}
          empty="No sheep match that filter."
        />
      )}

      {view === 'grid' && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 p-16 text-center">
          <p className="font-serif text-2xl text-gold-light">
            No sheep match that filter.
          </p>
          <p className="mt-2 text-white/40">Try a different tier or phase.</p>
        </div>
      )}

      {/* Edit-details modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit NFT details"
        subtitle={editing ? `${editing.id} · #${editing.number}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={saveEdit}>
              Save changes
            </Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-5">
            {/* Artwork + quick status */}
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-3">
                <img
                  src={editing.image}
                  alt={editing.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-ink/80 py-1 text-[10px] text-gold-light backdrop-blur transition-colors hover:text-gold"
                >
                  <Upload size={11} /> Change
                </button>
              </div>
              <div className="flex-1">
                <p className="mb-1.5 text-xs uppercase tracking-[0.2em] text-white/50">
                  Availability
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-ink px-4 py-3">
                  <StatusBadge status={draft.status} />
                  <span className="ml-auto text-xs text-white/45">
                    {draft.status === 'Available' ? 'On sale' : 'Already minted'}
                  </span>
                  <Toggle
                    checked={draft.status === 'Available'}
                    onChange={(v) =>
                      setField('status', v ? 'Available' : 'Minted')
                    }
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <Input
              label="Name"
              value={draft.name}
              onChange={(e) => setField('name', e.target.value)}
            />

            {/* Tier + phase */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Tier"
                value={draft.tier}
                onChange={(v) => setField('tier', v)}
                options={TIER_ORDER.map((t) => ({ value: t, label: t }))}
              />
              <Select
                label="Phase"
                value={draft.phase}
                onChange={(v) => setField('phase', v)}
                options={PHASES.map((p) => ({ value: p, label: p }))}
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Price (SOL)"
                type="number"
                step="0.01"
                min="0"
                value={draft.priceSol}
                onChange={(e) => setField('priceSol', e.target.value)}
              />
              <Input
                label="Price (USDC)"
                type="number"
                min="0"
                value={draft.priceUsdc}
                onChange={(e) => setField('priceUsdc', e.target.value)}
              />
            </div>

            {/* Status select (explicit) */}
            <Select
              label="Status"
              value={draft.status}
              onChange={(v) => setField('status', v)}
              options={STATUS_DRAFT_OPTIONS}
            />
          </div>
        )}
      </Modal>

      {/* Upload artwork modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload artwork"
        subtitle="Add a new piece to the collection"
        footer={
          <>
            <Button variant="ghost" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={() => setUploadOpen(false)}>
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-ink px-6 py-12 text-center transition-colors hover:border-gold/50">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-light">
              <Upload size={20} />
            </span>
            <span className="text-sm text-gold-light">
              Drag & drop or click to browse
            </span>
            <span className="text-xs text-white/40">
              PNG, JPG or GIF — up to 10MB
            </span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" placeholder="Tussock Sovereign" />
            <Select
              label="Tier"
              value={TIER_ORDER[0]}
              onChange={() => {}}
              options={TIER_ORDER.map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (SOL)" type="number" placeholder="20" />
            <Select
              label="Phase"
              value={PHASES[0]}
              onChange={() => {}}
              options={PHASES.map((p) => ({ value: p, label: p }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
