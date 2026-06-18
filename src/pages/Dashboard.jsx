import { useMemo } from 'react';
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
import Button from '../components/ui/Button';
import {
  DASHBOARD_STATS,
  SALES_LAST_7_DAYS,
  PAYMENT_BREAKDOWN,
  TRANSACTIONS,
  shortAddress,
  fmtDate,
} from '../data/mockData';
import { chartColors } from '../theme';

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
        {/* Line / area chart — sales last 7 days */}
        <Card
          title="Sales — Last 7 Days"
          subtitle="NFTs minted per day"
          className="lg:col-span-2"
          bodyClassName="p-5 pt-2"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SALES_LAST_7_DAYS}
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
                  dataKey="day"
                  stroke={chartColors.axis}
                  tick={{ fontSize: 12, fill: chartColors.axis }}
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
                  content={<ChartTooltip unit=" mints" />}
                  cursor={{ stroke: chartColors.line, strokeOpacity: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="mints"
                  stroke={chartColors.line}
                  strokeWidth={2.5}
                  fill="url(#goldFill)"
                  dot={{ r: 3, fill: chartColors.line, strokeWidth: 0 }}
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
                  <td className="font-mono text-xs text-white/60">
                    {shortAddress(tx.buyer)}
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
