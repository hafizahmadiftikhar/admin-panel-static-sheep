import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Layers, Coins, Users, Activity, ArrowRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import TierBadge from '../components/TierBadge';
import StatusBadge from '../components/StatusBadge';
import WalletAddress from '../components/WalletAddress';
import Button from '../components/ui/Button';
import {
  DASHBOARD_STATS,
  SALES_DAILY,
  PAYMENT_BREAKDOWN,
  TRANSACTIONS,
  fmtDate,
} from '../data/mockData';
import { chartColors } from '../theme';

const RANGES = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
];
const METRICS = [
  { value: 'mints', label: 'Mints', key: 'sales', unit: ' mints' },
  { value: 'revenue', label: 'Revenue', key: 'sol', unit: ' SOL' },
];

function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1d26] px-3 py-2 shadow-gold">
      <p className="text-xs text-white/45">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-medium text-gold-light">
          {p.value}
          {unit} {p.name}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const recent = useMemo(() => TRANSACTIONS.slice(0, 6), []);
  const totalPayments = PAYMENT_BREAKDOWN.reduce((a, b) => a + b.value, 0);

  // Sales chart filters
  const [range, setRange] = useState(7);
  const [metric, setMetric] = useState('mints');
  const activeMetric = METRICS.find((m) => m.value === metric);
  const salesData = useMemo(() => SALES_DAILY.slice(-range), [range]);
  // thin out X labels so longer ranges don't crowd
  const tickInterval = range <= 7 ? 0 : range <= 14 ? 1 : 4;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Total NFTs Minted"
          value={DASHBOARD_STATS.totalMinted}
          sub={`/ ${DASHBOARD_STATS.totalSupply.toLocaleString()}`}
          icon={Layers}
          trend="+18"
          trendUp
        />
        <StatCard
          index={1}
          label="Total Revenue"
          value={DASHBOARD_STATS.totalRevenueSol.toLocaleString()}
          sub="SOL"
          icon={Coins}
          trend="+12%"
          trendUp
        />
        <StatCard
          index={2}
          label="Total Holders"
          value={DASHBOARD_STATS.totalHolders}
          icon={Users}
          trend="+7"
          trendUp
        />
        <StatCard
          index={3}
          label="Transactions Today"
          value={DASHBOARD_STATS.transactionsToday}
          icon={Activity}
          trend="-4"
          trendUp={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line / area chart — sales, filterable by range + metric */}
        <Card
          title={`Sales — Last ${range} Days`}
          subtitle={
            metric === 'mints' ? 'NFTs minted per day' : 'Revenue (SOL) per day'
          }
          className="lg:col-span-2"
          bodyClassName="p-5 pt-3"
        >
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Metric */}
            <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-ink p-1">
              {METRICS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMetric(m.value)}
                  className={`h-8 rounded-md px-3 text-xs transition-all duration-200 ${
                    metric === m.value
                      ? 'bg-gold/15 text-gold-light'
                      : 'text-white/50 hover:text-gold-light'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {/* Range */}
            <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-ink p-1">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`h-8 rounded-md px-3 text-xs transition-all duration-200 ${
                    range === r.value
                      ? 'bg-gold/15 text-gold-light'
                      : 'text-white/50 hover:text-gold-light'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.line} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={chartColors.line} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  interval={tickInterval}
                  stroke={chartColors.axis}
                  tick={{ fontSize: 11, fill: chartColors.axis }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartColors.axis}
                  tick={{ fontSize: 12, fill: chartColors.axis }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  content={<ChartTooltip unit={activeMetric.unit} />}
                  cursor={{ stroke: chartColors.line, strokeOpacity: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey={activeMetric.key}
                  name={activeMetric.label}
                  stroke={chartColors.line}
                  strokeWidth={2.5}
                  fill="url(#goldFill)"
                  dot={range <= 14 ? { r: 3, fill: chartColors.line, strokeWidth: 0 } : false}
                  activeDot={{ r: 5, fill: chartColors.lineSoft }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut — payment methods */}
        <Card title="Payment Methods" subtitle="Share of mints">
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_BREAKDOWN}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {PAYMENT_BREAKDOWN.map((entry, i) => (
                    <Cell key={entry.name} fill={chartColors.donut[i]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-2xl text-gold-light">
                {totalPayments}
              </span>
              <span className="text-xs text-white/40">total mints</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {PAYMENT_BREAKDOWN.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white/60">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: chartColors.donut[i] }}
                  />
                  {p.name}
                </span>
                <span className="text-gold-light">
                  {Math.round((p.value / totalPayments) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card
        title="Recent Transactions"
        subtitle="Latest mints across the collection"
        action={
          <Button
            variant="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/transactions')}
          >
            View all
          </Button>
        }
        bodyClassName=""
      >
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NFT</th>
                <th>Wallet</th>
                <th className="text-right">Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => navigate('/transactions')}
                  className="cursor-pointer"
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gold-light">
                        {tx.nftName}
                      </span>
                      <TierBadge tier={tx.tier} />
                    </div>
                  </td>
                  <td>
                    <WalletAddress address={tx.buyer} />
                  </td>
                  <td className="text-right font-medium text-gold">
                    {tx.amountSol} SOL
                  </td>
                  <td className="text-white/70">{tx.method}</td>
                  <td className="text-white/50">{fmtDate(tx.date)}</td>
                  <td>
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
