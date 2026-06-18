import { useMemo, useState } from 'react';
import { Copy, Wallet, Coins, Calendar } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/StatusBadge';
import TierBadge from '../components/TierBadge';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import {
  HOLDERS,
  TRANSACTIONS,
  shortAddress,
  fmtDate,
} from '../data/mockData';
import { useSearch } from '../context/SearchContext';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Dormant', label: 'Dormant' },
];

export default function Users() {
  const { query } = useSearch();
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState(null);

  const term = (query || '').trim().toLowerCase();

  const rows = useMemo(() => {
    return HOLDERS.filter((h) => {
      if (status !== 'All' && h.status !== status) return false;
      if (term && !h.wallet.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [status, term]);

  const userTxs = useMemo(() => {
    if (!selected) return [];
    return TRANSACTIONS.filter((t) => t.buyer === selected.wallet);
  }, [selected]);

  const columns = [
    {
      key: 'wallet',
      header: 'Wallet',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-xs font-medium text-gold-light">
            {r.id.slice(-2)}
          </span>
          <span className="font-mono text-xs text-gold-light/90">
            {shortAddress(r.wallet)}
          </span>
        </div>
      ),
    },
    {
      key: 'nftsOwned',
      header: 'NFTs Owned',
      render: (r) => <span className="text-gold-light">{r.nftsOwned}</span>,
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      align: 'right',
      render: (r) => (
        <span className="font-medium text-gold">{r.totalSpent} SOL</span>
      ),
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      render: (r) => <span className="text-white/55">{fmtDate(r.joinDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/45">
          <span className="text-gold-light">{rows.length}</span> holders ·{' '}
          {HOLDERS.reduce((a, h) => a + h.nftsOwned, 0)} NFTs held
        </p>
        <Select
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          className="w-full sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        onRowClick={setSelected}
        empty="No holders match your search."
      />

      {/* User detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Holder detail"
        subtitle={selected ? selected.id : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            {/* Wallet header */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-ink px-4 py-3">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-gold" />
                <span className="font-mono text-sm text-gold-light">
                  {shortAddress(selected.wallet)}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(selected.wallet)}
                  className="text-white/40 transition-colors hover:text-gold-light"
                  title="Copy address"
                >
                  <Copy size={14} />
                </button>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/8 bg-ink p-4 text-center">
                <Coins size={16} className="mx-auto text-gold" />
                <p className="mt-2 font-serif text-xl text-gold-light">
                  {selected.totalSpent}
                </p>
                <p className="text-xs text-white/40">SOL spent</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-ink p-4 text-center">
                <Wallet size={16} className="mx-auto text-gold" />
                <p className="mt-2 font-serif text-xl text-gold-light">
                  {selected.nftsOwned}
                </p>
                <p className="text-xs text-white/40">NFTs owned</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-ink p-4 text-center">
                <Calendar size={16} className="mx-auto text-gold" />
                <p className="mt-2 font-serif text-sm text-gold-light">
                  {fmtDate(selected.joinDate)}
                </p>
                <p className="text-xs text-white/40">joined</p>
              </div>
            </div>

            {/* Owned NFTs */}
            <div>
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Owned NFTs
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selected.owned.map((n) => (
                  <div
                    key={n.id}
                    className="overflow-hidden rounded-lg border border-white/8 bg-ink"
                  >
                    <div className="relative aspect-square bg-ink-3">
                      <img
                        src={n.image}
                        alt={n.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-2 top-2">
                        <TierBadge tier={n.tier} />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-sm text-gold-light">{n.name}</p>
                      <p className="text-xs text-white/40">#{n.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sheep names */}
            <div>
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Sheep Names
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.sheepNames.map((s, i) => (
                  <Badge key={i} tone="gold">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Transactions
              </h4>
              {userTxs.length ? (
                <div className="overflow-hidden rounded-xl border border-white/8">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>NFT</th>
                        <th className="text-right">Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTxs.map((t) => (
                        <tr key={t.id}>
                          <td className="text-gold-light">{t.nftName}</td>
                          <td className="text-right text-gold">{t.amountSol} SOL</td>
                          <td className="text-white/60">{t.method}</td>
                          <td>
                            <StatusBadge status={t.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-white/40">No transactions on record.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
