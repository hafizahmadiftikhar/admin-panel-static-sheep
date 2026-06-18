import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/StatusBadge';
import TierBadge from '../components/TierBadge';
import {
  TRANSACTIONS,
  PAYMENT_METHODS,
  TX_STATUSES,
  shortAddress,
  fmtDateTime,
} from '../data/mockData';
import { useSearch } from '../context/SearchContext';

const METHOD_OPTIONS = [
  { value: 'All', label: 'All methods' },
  ...PAYMENT_METHODS.map((m) => ({ value: m, label: m })),
];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  ...TX_STATUSES.map((s) => ({ value: s, label: s })),
];
const DATE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

function downloadCsv(rows) {
  const headers = [
    'ID',
    'NFT',
    'Buyer',
    'Amount (SOL)',
    'Method',
    'Gas Fee',
    'Date',
    'Status',
  ];
  const lines = rows.map((t) =>
    [
      t.id,
      t.nftName,
      t.buyer,
      t.amountSol,
      t.method,
      t.gasFee,
      t.date,
      t.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dunstan-downs-transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const { query } = useSearch();
  const [method, setMethod] = useState('All');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState('all');

  const term = (query || '').trim().toLowerCase();

  const rows = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      if (method !== 'All' && t.method !== method) return false;
      if (status !== 'All' && t.status !== status) return false;
      if (dateRange !== 'all' && t.daysAgo > Number(dateRange)) return false;
      if (term) {
        const hay = `${t.nftName} ${t.buyer} ${t.id}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [method, status, dateRange, term]);

  const totalSol = rows
    .filter((t) => t.status === 'Confirmed')
    .reduce((a, t) => a + t.amountSol, 0);

  const columns = [
    {
      key: 'nft',
      header: 'NFT',
      render: (t) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gold-light">{t.nftName}</span>
          <TierBadge tier={t.tier} />
        </div>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer',
      render: (t) => (
        <span className="font-mono text-xs text-white/60">
          {shortAddress(t.buyer)}
        </span>
      ),
    },
    {
      key: 'amountSol',
      header: 'Amount',
      align: 'right',
      render: (t) => (
        <span className="font-medium text-gold">{t.amountSol} SOL</span>
      ),
    },
    { key: 'method', header: 'Method', render: (t) => <span className="text-white/70">{t.method}</span> },
    {
      key: 'gasFee',
      header: 'Gas Fee',
      align: 'right',
      render: (t) => <span className="text-white/45">{t.gasFee} SOL</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (t) => <span className="text-white/55">{fmtDateTime(t.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/45">
          <span className="text-gold-light">{rows.length}</span> transactions ·{' '}
          <span className="text-gold">{totalSol.toFixed(2)} SOL</span> confirmed
        </p>
        <Button variant="gold" icon={Download} onClick={() => downloadCsv(rows)}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        <Select value={dateRange} onChange={setDateRange} options={DATE_OPTIONS} />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        empty="No transactions match your filters."
      />
    </div>
  );
}
