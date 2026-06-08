import { useState, useMemo, useRef } from 'react';
import { TopNav } from './shared/TopNav';
import { SidebarNav } from './shared/SidebarNav';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { useLanguage, statusKey } from '../shared/LanguageContext';
import {
  clients,
  recentOrders,
  recentVAMovements,
  largeBalances,
  depositAddresses,
  latestVATransactions,
  complianceActions,
  historicalDeposits,
  getOmnibusWalletBalance,
  getClientsHoldingEachAsset,
  getStorageBreakdown,
  COLD_PCT,
  HOT_PCT,
} from '../shared/mockData';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Activity,
  Shield,
  FileText,
  Settings,
  Building2,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Thermometer,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Key,
} from 'lucide-react';

interface BeanBankDashboardProps {
  onSwitchRole: () => void;
  onNavigate: (screen: 'wallet' | 'compliance') => void;
}

const navItems = [
  { id: 'dashboard', labelKey: 'nav.bb.dashboard', icon: LayoutDashboard },
  { id: 'clients', labelKey: 'nav.bb.clients', icon: Users, badge: 1247 },
  { id: 'orders', labelKey: 'nav.bb.orders', icon: Activity },
  { id: 'wallet', labelKey: 'nav.bb.wallet', icon: Wallet },
  { id: 'compliance', labelKey: 'nav.bb.compliance', icon: Shield },
  { id: 'reports', labelKey: 'nav.bb.reports', icon: FileText },
  { id: 'bank', labelKey: 'nav.bb.bank', icon: Landmark },
  { id: 'settings', labelKey: 'nav.bb.settings', icon: Settings },
];

const COLORS = ['#0A84FF', '#34C759', '#FF9F0A', '#FF3B30', '#8B5CF6', '#6E6E73'];

const storageSplitData = [
  { name: 'Cold', value: COLD_PCT },
  { name: 'Hot', value: HOT_PCT },
];

export function BeanBankDashboard({ onSwitchRole, onNavigate }: BeanBankDashboardProps) {
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [orderTab, setOrderTab] = useState<'byDate' | 'byClient'>('byDate');
  const [clientIdSearch, setClientIdSearch] = useState('');
  const [orderPage, setOrderPage] = useState(0);
  const ORDERS_PER_PAGE = 20;
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    scrollToTop();
  };

  const navigateToClientOrders = (clientId: string) => {
    setActiveNav('orders');
    setOrderTab('byClient');
    setClientIdSearch(clientId);
    setOrderPage(0);
    scrollToTop();
  };

  const assetAllocationData = useMemo(() =>
    getOmnibusWalletBalance().map(w => ({ name: w.symbol, value: w.percent, usd: w.usd })),
    []
  );

  const clientHoldingsData = useMemo(() => getClientsHoldingEachAsset(), []);

  const storageBreakdown = useMemo(() => getStorageBreakdown(), []);

  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <TopNav
        title="BeanBank"
        subtitle={t('bb.subtitle')}
        badge={{ text: t('bb.omnibusAccountBadge'), color: 'blue' }}
        onSwitchRole={onSwitchRole}
        rightContent={
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F7] rounded-xl">
            <Building2 className="w-5 h-5 text-[#6E6E73]" />
            <div className="text-sm text-[#1D1D1F]">{t('bb.adminName')}</div>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white border-r border-[#E5E5EA] overflow-y-auto">
          <SidebarNav items={navItems} activeId={activeNav} onItemClick={handleNavClick} />
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-8">
          {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
              <Building2 className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
              <div className="text-base text-[#1D1D1F]">
                <span style={{ fontWeight: 600 }}>{t('bb.modelActive.label')}</span>{t('bb.modelActive.body')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <MetricCard
                label={t('bb.metric.totalClients')}
                value="1,247"
                subtitle={t('bb.metric.totalClients.sub')}
              />
              <MetricCard
                label={t('bb.metric.aum')}
                value={`$${(getOmnibusWalletBalance().reduce((s, w) => s + w.usd, 0) / 1e6).toFixed(1)}M`}
                subtitle={t('bb.metric.aum.sub')}
                color="blue"
              />
            </div>

            {/* ── VA Inflow / Outflow (24h) ── */}
            <div className="bg-gradient-to-br from-[#0A84FF] to-[#0A84FF]/80 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>
                {t('bb.wallet.vaFlow')}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowDownLeft className="w-5 h-5" />
                    <span className="text-sm opacity-90">{t('bb.wallet.vaInflow')}</span>
                  </div>
                  <div className="text-3xl" style={{ fontWeight: 600 }}>$1.2M</div>
                  <div className="text-sm opacity-80 mt-1">{t('bb.wallet.vaInflow.sub')}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { asset: 'BTC', amount: '8.5 BTC', count: 52 },
                      { asset: 'ETH', amount: '145 ETH', count: 38 },
                      { asset: 'USDT', amount: '$420K', count: 42 },
                      { asset: 'SOL', amount: '1.2K SOL', count: 10 },
                    ].map((item) => (
                      <div key={item.asset} className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm" style={{ fontWeight: 600 }}>{item.asset}</div>
                        <div className="text-xs opacity-80">{item.amount} · {item.count} {t('bb.wallet.txns')}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-sm opacity-90">{t('bb.wallet.vaOutflow')}</span>
                  </div>
                  <div className="text-3xl" style={{ fontWeight: 600 }}>$845K</div>
                  <div className="text-sm opacity-80 mt-1">{t('bb.wallet.vaOutflow.sub')}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { asset: 'BTC', amount: '3.2 BTC', count: 28 },
                      { asset: 'ETH', amount: '89 ETH', count: 31 },
                      { asset: 'USDT', amount: '$280K', count: 22 },
                      { asset: 'SOL', amount: '580 SOL', count: 8 },
                    ].map((item) => (
                      <div key={item.asset} className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm" style={{ fontWeight: 600 }}>{item.asset}</div>
                        <div className="text-xs opacity-80">{item.amount} · {item.count} {t('bb.wallet.txns')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Charts: Asset Allocation & Client Holdings ── */}
            <div className="grid grid-cols-2 gap-6">
              {/* Asset Allocation Pie */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.positions.assetAllocation')}
                </h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {assetAllocationData.map((_, index) => (
                          <Cell key={`cell-asset-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${value}%`, '']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #E5E5EA', fontSize: 13 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {assetAllocationData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.name}</span>
                        <span className="text-sm text-[#6E6E73]">{item.value}% · ${(item.usd as number).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Holdings Pie */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.positions.clientHoldings')}
                </h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie
                        data={clientHoldingsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {clientHoldingsData.map((_, index) => (
                          <Cell key={`cell-hold-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [value.toLocaleString(), '']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #E5E5EA', fontSize: 13 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {clientHoldingsData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.name}</span>
                        <span className="text-sm text-[#6E6E73]">{item.value.toLocaleString()} {t('bb.positions.clients')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                {t('bb.section.walletBalance')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5EA]">
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.va')}</th>
                      <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.usdEq')}</th>
                      <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                      <th className="text-right text-sm text-[#6E6E73] py-4 px-6">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOmnibusWalletBalance().map((asset) => (
                      <tr key={asset.symbol} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center">
                              <span className="text-sm" style={{ fontWeight: 600 }}>{asset.symbol[0]}</span>
                            </div>
                            <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                              {asset.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          ${Math.round(asset.usd).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                          {asset.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                          {asset.percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.section.recentVAMovement')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.direction')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.vaShort')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('common.amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVAMovements.map((movement, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-3 px-4">
                            <button onClick={() => navigateToClientOrders(movement.clientId)} className="text-sm text-[#0A84FF] hover:underline" style={{ fontWeight: 600 }}>
                              {movement.clientId}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              color={movement.direction === 'Deposit' ? 'green' : 'amber'}
                              text={t(statusKey(movement.direction))}
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {movement.va}
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F] text-right">
                            {movement.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.section.recentOrders')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.direction')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.vaShort')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('common.amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 5).map((order, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-3 px-4">
                            <button onClick={() => navigateToClientOrders(order.clientId)} className="text-sm text-[#0A84FF] hover:underline" style={{ fontWeight: 600 }}>
                              {order.clientId}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              color={order.side === 'Buy' ? 'green' : 'red'}
                              text={t(statusKey(order.side))}
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {order.asset}
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F] text-right">
                            {order.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.section.largeBalance')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.vaShort')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('common.amount')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('bb.col.usdEq')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {largeBalances.map((balance, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-3 px-4">
                            <button onClick={() => navigateToClientOrders(balance.clientId)} className="text-sm text-[#0A84FF] hover:underline" style={{ fontWeight: 600 }}>
                              {balance.clientId}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {balance.va}
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F] text-right">
                            {balance.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F] text-right" style={{ fontWeight: 600 }}>
                            ${balance.usd.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
          )}

          {activeNav === 'clients' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <Users className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div className="text-base text-[#1D1D1F]">
                  <span style={{ fontWeight: 600 }}>{t('bb.clients.notice.label')}</span>{t('bb.clients.notice.body')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <MetricCard
                  label={t('bb.clients.metric.totalAccounts')}
                  value="1,247"
                  subtitle={t('bb.clients.metric.totalAccounts.sub')}
                />
                <MetricCard
                  label={t('bb.clients.metric.activeAccounts')}
                  value="1,089"
                  subtitle={t('bb.clients.metric.activeAccounts.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('bb.clients.metric.totalOrders')}
                  value="34,562"
                  subtitle={t('bb.clients.metric.totalOrders.sub')}
                  color="green"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('bb.clients.table.title')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t('bb.clients.searchPh')}
                        className="pl-9 pr-4 py-2 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors"
                      />
                      <svg className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.col.orderCount')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.col.totalVolume')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.col.createdAt')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.col.lastActivity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.clientId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6">
                            <button
                              onClick={() => navigateToClientOrders(client.clientId)}
                              className="text-sm text-[#0A84FF] hover:underline"
                              style={{ fontWeight: 600 }}
                            >
                              {client.clientId}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {client.orderCount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                            ${client.totalVolumeUsd.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">
                            {client.createdAt}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">
                            {client.lastActivity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Client Orders ── */}
          {activeNav === 'orders' && (
            <div className="space-y-6">
                <div className="grid grid-cols-4 gap-6">
                  <MetricCard
                    label={t('bb.clients.orders.totalOrders')}
                    value="34,562"
                    subtitle={t('bb.clients.orders.totalOrders.sub')}
                    color="blue"
                  />
                  <MetricCard
                    label={t('bb.clients.orders.buyOrders')}
                    value="19,841"
                    subtitle="57.4%"
                    color="green"
                  />
                  <MetricCard
                    label={t('bb.clients.orders.sellOrders')}
                    value="14,721"
                    subtitle="42.6%"
                    color="red"
                  />
                  <MetricCard
                    label={t('bb.clients.orders.pendingOrders')}
                    value="12"
                    subtitle={t('bb.clients.orders.pendingOrders.sub')}
                    color="amber"
                  />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-[#F5F5F7] rounded-xl p-1 w-fit">
                  <button
                    onClick={() => { setOrderTab('byDate'); setClientIdSearch(''); setOrderPage(0); }}
                    className={`px-6 py-2.5 rounded-lg text-sm transition-all ${
                      orderTab === 'byDate'
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {t('bb.clients.orders.tab.byDate')}
                  </button>
                  <button
                    onClick={() => { setOrderTab('byClient'); setOrderPage(0); }}
                    className={`px-6 py-2.5 rounded-lg text-sm transition-all ${
                      orderTab === 'byClient'
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {t('bb.clients.orders.tab.byClient')}
                  </button>
                </div>

                {/* By Order Date tab */}
                {orderTab === 'byDate' && (() => {
                  const sorted = [...recentOrders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
                  const totalPages = Math.ceil(sorted.length / ORDERS_PER_PAGE);
                  const pageOrders = sorted.slice(orderPage * ORDERS_PER_PAGE, (orderPage + 1) * ORDERS_PER_PAGE);
                  return (
                <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.clients.orders.table.title')}
                    </h3>
                    <span className="text-sm text-[#6E6E73]">{sorted.length} orders · Page {orderPage + 1}/{totalPages}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E5E5EA]">
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.orderId')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.direction')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.price')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.usdEq')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.placedAt')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageOrders.map((order) => (
                          <tr key={order.orderId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                            <td className="py-4 px-6">
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{order.orderId}</span>
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => { setOrderTab('byClient'); setClientIdSearch(order.clientId); setOrderPage(0); scrollToTop(); }}
                                className="text-sm text-[#0A84FF] hover:underline"
                                style={{ fontWeight: 600 }}
                              >
                                {order.clientId}
                              </button>
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge
                                color={order.side === 'Buy' ? 'green' : 'red'}
                                text={t(statusKey(order.side))}
                                size="sm"
                              />
                            </td>
                            <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{order.asset}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">{order.amount.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">${order.price.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>${order.usd.toLocaleString()}</td>
                            <td className="py-4 px-6">
                              <StatusBadge
                                color={order.status === 'completed' ? 'green' : 'amber'}
                                text={t(`status.${order.status}`)}
                                size="sm"
                              />
                            </td>
                            <td className="py-4 px-6 text-sm text-[#6E6E73]">{order.placedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => setOrderPage(Math.max(0, orderPage - 1))}
                        disabled={orderPage === 0}
                        className="px-4 py-2 rounded-xl text-sm bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let p: number;
                        if (totalPages <= 7) { p = i; }
                        else if (orderPage < 4) { p = i; }
                        else if (orderPage > totalPages - 5) { p = totalPages - 7 + i; }
                        else { p = orderPage - 3 + i; }
                        return (
                          <button
                            key={p}
                            onClick={() => setOrderPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm transition-colors ${p === orderPage ? 'bg-[#0A84FF] text-white' : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'}`}
                            style={{ fontWeight: 600 }}
                          >
                            {p + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setOrderPage(Math.min(totalPages - 1, orderPage + 1))}
                        disabled={orderPage >= totalPages - 1}
                        className="px-4 py-2 rounded-xl text-sm bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
                );
                })()}

                {/* By Client ID tab */}
                {orderTab === 'byClient' && (() => {
                  const filtered = recentOrders
                    .filter((o) => !clientIdSearch || o.clientId.toLowerCase().includes(clientIdSearch.toLowerCase()))
                    .sort((a, b) => a.clientId.localeCompare(b.clientId) || b.placedAt.localeCompare(a.placedAt));
                  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
                  const pageOrders = filtered.slice(orderPage * ORDERS_PER_PAGE, (orderPage + 1) * ORDERS_PER_PAGE);
                  return (
                <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.clients.orders.table.title')}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6E6E73]">{filtered.length} orders · Page {orderPage + 1}/{totalPages}</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={clientIdSearch}
                          onChange={(e) => { setClientIdSearch(e.target.value); setOrderPage(0); }}
                          placeholder={t('bb.clients.orders.searchClientId')}
                          className="pl-9 pr-4 py-2 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors w-64"
                        />
                        <svg className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E5E5EA]">
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.orderId')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.direction')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.price')}</th>
                          <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.usdEq')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                          <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.clients.orders.col.placedAt')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageOrders.map((order) => (
                          <tr key={order.orderId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                            <td className="py-4 px-6">
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{order.orderId}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{order.clientId}</span>
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge
                                color={order.side === 'Buy' ? 'green' : 'red'}
                                text={t(statusKey(order.side))}
                                size="sm"
                              />
                            </td>
                            <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{order.asset}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">{order.amount.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">${order.price.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>${order.usd.toLocaleString()}</td>
                            <td className="py-4 px-6">
                              <StatusBadge
                                color={order.status === 'completed' ? 'green' : 'amber'}
                                text={t(`status.${order.status}`)}
                                size="sm"
                              />
                            </td>
                            <td className="py-4 px-6 text-sm text-[#6E6E73]">{order.placedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => setOrderPage(Math.max(0, orderPage - 1))}
                        disabled={orderPage === 0}
                        className="px-4 py-2 rounded-xl text-sm bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let p: number;
                        if (totalPages <= 7) { p = i; }
                        else if (orderPage < 4) { p = i; }
                        else if (orderPage > totalPages - 5) { p = totalPages - 7 + i; }
                        else { p = orderPage - 3 + i; }
                        return (
                          <button
                            key={p}
                            onClick={() => setOrderPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm transition-colors ${p === orderPage ? 'bg-[#0A84FF] text-white' : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'}`}
                            style={{ fontWeight: 600 }}
                          >
                            {p + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setOrderPage(Math.min(totalPages - 1, orderPage + 1))}
                        disabled={orderPage >= totalPages - 1}
                        className="px-4 py-2 rounded-xl text-sm bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
                );
                })()}
            </div>
          )}

          {/* ── Reports ── */}
          {activeNav === 'reports' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <FileText className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('bb.reports.title')}</div>
                  <div className="text-sm text-[#6E6E73] mt-1">{t('bb.reports.subtitle')}</div>
                </div>
              </div>

              {/* Generate New Report */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.reports.generate')}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('bb.reports.reportType')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>{t('bb.reports.types.monthly')}</option>
                      <option>{t('bb.reports.types.classification')}</option>
                      <option>{t('bb.reports.types.aml')}</option>
                      <option>{t('bb.reports.types.walletCustody')}</option>
                      <option>{t('bb.reports.types.tokenAdmission')}</option>
                      <option>{t('bb.reports.types.str')}</option>
                      <option>{t('bb.reports.types.omnibus')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('bb.reports.period')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>{t('month.may_2026')}</option>
                      <option>{t('month.april_2026')}</option>
                      <option>{t('month.march_2026')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('bb.reports.format')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>PDF</option>
                      <option>CSV</option>
                      <option>XLSX</option>
                      <option>JSON</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                    {t('bb.reports.generateBtn')}
                  </button>
                </div>
              </div>

              {/* Daily Reconciliation Report — Auto-generated, download only */}
              <div className="bg-white border border-[#34C759] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                    <div>
                      <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('bb.reports.types.reconciliation')}</h3>
                      <div className="text-xs text-[#6E6E73]">{t('bb.reports.reconciliation.autoGenerated')}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6E6E73]" />
                    <span className="text-[#6E6E73]">{t('bb.reports.reconciliation.lastGenerated')}:</span>
                    <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>2026-06-07 20:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0A84FF]" />
                    <span className="text-[#6E6E73]">{t('bb.reports.reconciliation.nextGeneration')}:</span>
                    <span className="text-[#0A84FF]" style={{ fontWeight: 600 }}>2026-06-08 20:00</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">Date</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.positions.ledgerMatch')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.positions.balanceMatch')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.wallet.sweepsCompleted')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('common.status')}</th>
                        <th className="text-center text-sm text-[#6E6E73] py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2026-06-07', ledger: 'Matched', balance: 'Matched', sweep: '91/91', result: 'passed' },
                        { date: '2026-06-06', ledger: 'Matched', balance: 'Matched', sweep: '88/88', result: 'passed' },
                        { date: '2026-06-05', ledger: 'Matched', balance: 'Matched', sweep: '96/96', result: 'passed' },
                        { date: '2026-06-04', ledger: 'Matched', balance: 'Matched', sweep: '95/95', result: 'passed' },
                        { date: '2026-06-03', ledger: 'Matched', balance: 'Matched', sweep: '85/85', result: 'passed' },
                        { date: '2026-06-02', ledger: 'Matched', balance: 'Matched', sweep: '92/92', result: 'passed' },
                        { date: '2026-06-01', ledger: 'Matched', balance: 'Matched', sweep: '79/79', result: 'passed' },
                      ].map((day) => (
                        <tr key={day.date} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{day.date}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={day.ledger === 'Matched' ? 'text-[#34C759]' : 'text-[#FF9F0A]'} style={{ fontWeight: 600 }}>{day.ledger}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={day.balance === 'Matched' ? 'text-[#34C759]' : 'text-[#FF9F0A]'} style={{ fontWeight: 600 }}>{day.balance}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{day.sweep}</td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              color={day.result === 'passed' ? 'green' : 'amber'}
                              text={day.result === 'passed' ? t('status.passed') : t('status.pending')}
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A84FF] text-white rounded-lg text-xs hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                              {t('bb.reports.reconciliation.download')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Reports Summary */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { period: t('month.may_2026'), reports: 4, status: 'completed', submittedAt: '2026-06-05' },
                  { period: t('month.april_2026'), reports: 4, status: 'completed', submittedAt: '2026-05-04' },
                  { period: t('month.march_2026'), reports: 4, status: 'completed', submittedAt: '2026-04-03' },
                ].map((month) => (
                  <div key={month.period} className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>{month.period}</span>
                      <StatusBadge color="green" text={t('status.completed')} size="sm" />
                    </div>
                    <div className="text-sm text-[#6E6E73] mb-1">{month.reports} {t('bb.reports.monthlyReports').toLowerCase()}</div>
                    <div className="text-xs text-[#6E6E73]">{t('comp.rep.submittedOn')}: {month.submittedAt}</div>
                  </div>
                ))}
              </div>

              {/* Report Export History */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.reports.exportHistory')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.reports.col.type')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.reports.col.period')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.reports.col.generatedAt')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.reports.col.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.reports.col.format')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: t('bb.reports.types.monthly'), period: t('month.may_2026'), generatedAt: '2026-06-05 09:32', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.classification'), period: t('month.may_2026'), generatedAt: '2026-06-05 09:35', status: 'completed', format: 'CSV' },
                        { type: t('bb.reports.types.aml'), period: t('month.may_2026'), generatedAt: '2026-06-05 09:41', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.omnibus'), period: t('month.may_2026'), generatedAt: '2026-06-05 09:45', status: 'completed', format: 'XLSX' },
                        { type: t('bb.reports.types.monthly'), period: t('month.april_2026'), generatedAt: '2026-05-04 10:15', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.walletCustody'), period: t('month.april_2026'), generatedAt: '2026-05-04 10:22', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.str'), period: t('month.april_2026'), generatedAt: '2026-05-04 10:28', status: 'submitted', format: 'PDF' },
                        { type: t('bb.reports.types.tokenAdmission'), period: t('month.march_2026'), generatedAt: '2026-04-03 08:50', status: 'completed', format: 'CSV' },
                        { type: t('bb.reports.types.reconciliation'), period: '2026-06-07', generatedAt: '2026-06-07 20:00', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.reconciliation'), period: '2026-06-06', generatedAt: '2026-06-06 20:00', status: 'completed', format: 'PDF' },
                        { type: t('bb.reports.types.reconciliation'), period: '2026-06-05', generatedAt: '2026-06-05 20:00', status: 'completed', format: 'PDF' },
                      ].map((report, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{report.type}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{report.period}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{report.generatedAt}</td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={report.status === 'completed' ? 'green' : 'blue'}
                              text={t(`status.${report.status}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{report.format}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Wallet / Custody (BeanBank) ── */}
          {activeNav === 'wallet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <MetricCard
                  label={t('bb.wallet.depositAddresses')}
                  value="48"
                  subtitle={t('bb.wallet.depositAddresses.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('bb.wallet.deposits24')}
                  value="142"
                  subtitle="$1.2M"
                  color="green"
                />
                <MetricCard
                  label={t('bb.wallet.withdrawals24')}
                  value="89"
                  subtitle="$845K"
                  color="amber"
                />
              </div>

              {/* ── Cold / Hot Storage Split ── */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.wallet.storageSplit')}
                </h3>
                <div className="grid grid-cols-3 gap-8">
                  {/* Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={storageSplitData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          <Cell fill="#0A84FF" />
                          <Cell fill="#FF9F0A" />
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [`${value}%`, '']}
                          contentStyle={{ borderRadius: 12, border: '1px solid #E5E5EA', fontSize: 13 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0A84FF]" />
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.cold')} 98%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF9F0A]" />
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.hot')} 2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Cold Storage Breakdown */}
                  <div className="bg-[#F0F7FF] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Thermometer className="w-5 h-5 text-[#0A84FF]" />
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.cold')} — {COLD_PCT}%</span>
                    </div>
                    <div className="text-2xl text-[#0A84FF] mb-4" style={{ fontWeight: 600 }}>${(storageBreakdown.cold.totalUsd / 1e6).toFixed(1)}M</div>
                    <div className="space-y-3">
                      {storageBreakdown.cold.assets.map((item) => (
                        <div key={item.asset} className="flex items-center justify-between">
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</span>
                          <div className="text-right">
                            <span className="text-sm text-[#1D1D1F]">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            <span className="text-xs text-[#6E6E73] ml-2">${Math.round(item.usd).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hot Storage Breakdown */}
                  <div className="bg-[#FFF8F0] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Flame className="w-5 h-5 text-[#FF9F0A]" />
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.hot')} — {HOT_PCT}%</span>
                    </div>
                    <div className="text-2xl text-[#FF9F0A] mb-4" style={{ fontWeight: 600 }}>${(storageBreakdown.hot.totalUsd / 1e6).toFixed(1)}M</div>
                    <div className="space-y-3">
                      {storageBreakdown.hot.assets.map((item) => (
                        <div key={item.asset} className="flex items-center justify-between">
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</span>
                          <div className="text-right">
                            <span className="text-sm text-[#1D1D1F]">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            <span className="text-xs text-[#6E6E73] ml-2">${Math.round(item.usd).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Deposit Sweep Status ── */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.wallet.sweepStatus')}
                    </h3>
                    <div className="text-sm text-[#6E6E73] mt-1">{t('bb.wallet.sweepStatus.sub')}</div>
                  </div>
                  <span className="px-3 py-1 bg-[#0A84FF]/10 text-[#0A84FF] rounded-lg text-sm" style={{ fontWeight: 600 }}>
                    {t('bb.wallet.sweepFrequency')}
                  </span>
                </div>

                {/* Sweep Metrics */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#F5F5F7] rounded-xl p-5">
                    <div className="text-sm text-[#6E6E73] mb-1">{t('bb.wallet.totalTempAddresses')}</div>
                    <div className="text-2xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>48</div>
                    <div className="text-xs text-[#6E6E73] mt-1">{t('bb.wallet.totalTempAddresses.sub')}</div>
                  </div>
                  <div className="bg-[#F0F7FF] rounded-xl p-5">
                    <div className="text-sm text-[#6E6E73] mb-1">{t('bb.wallet.sweptToOmnibus')}</div>
                    <div className="text-2xl text-[#0A84FF]" style={{ fontWeight: 600 }}>42</div>
                    <div className="text-xs text-[#0A84FF] mt-1">{t('bb.wallet.sweptToOmnibus.sub')}</div>
                  </div>
                  <div className="bg-[#FFF8F0] rounded-xl p-5">
                    <div className="text-sm text-[#6E6E73] mb-1">{t('bb.wallet.pendingSweep')}</div>
                    <div className="text-2xl text-[#FF9F0A]" style={{ fontWeight: 600 }}>3</div>
                    <div className="text-xs text-[#FF9F0A] mt-1">{t('bb.wallet.pendingSweep.sub')}</div>
                  </div>
                  <div className="bg-[#FFF0F0] rounded-xl p-5">
                    <div className="text-sm text-[#6E6E73] mb-1">{t('bb.wallet.lastSweep')}</div>
                    <div className="text-2xl text-[#FF3B30]" style={{ fontWeight: 600 }}>8 min</div>
                    <div className="text-xs text-[#6E6E73] mt-1">{t('bb.wallet.lastSweep.sub')}</div>
                  </div>
                </div>

                {/* Sweep Summary 24h */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl">
                    <div className="w-10 h-10 bg-[#34C759]/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6E6E73]">{t('bb.wallet.sweepsCompleted')}</div>
                      <div className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>91</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl">
                    <div className="w-10 h-10 bg-[#0A84FF]/10 rounded-full flex items-center justify-center">
                      <ArrowDownLeft className="w-5 h-5 text-[#0A84FF]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6E6E73]">{t('bb.wallet.totalSweptValue')}</div>
                      <div className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>$1.87M</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl">
                    <div className="w-10 h-10 bg-[#FF9F0A]/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#FF9F0A]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6E6E73]">{t('bb.wallet.avgSweepTime')}</div>
                      <div className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>~12 min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Assets Pending Sweep ── */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.wallet.pendingSweepAssets')}
                    </h3>
                    <div className="text-sm text-[#6E6E73] mt-1">{t('bb.wallet.pendingSweepAssets.sub')}</div>
                  </div>
                  <span className="px-3 py-1 bg-[#FF9F0A]/10 text-[#FF9F0A] rounded-lg text-sm" style={{ fontWeight: 600 }}>
                    3 {t('bb.wallet.col.tempAddress').toLowerCase()}s
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.col.tempAddress')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.col.received')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.col.pendingAmount')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.usdEq')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.col.sweepStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { address: 'bc1q...x7k2m', clientId: 'CA-001', asset: 'BTC', received: '5 min ago', pending: '2.5 BTC', usd: '$262,500', status: 'confirming' },
                        { address: '0x3f...a9c1', clientId: 'CA-003', asset: 'ETH', received: '12 min ago', pending: '45.0 ETH', usd: '$171,000', status: 'awaiting_sweep' },
                        { address: '5Fu...kL9p', clientId: 'CA-010', asset: 'SOL', received: '9 min ago', pending: '320 SOL', usd: '$62,400', status: 'awaiting_sweep' },
                      ].map((item) => (
                        <tr key={item.address} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-[#6E6E73]" />
                              <span className="text-sm text-[#1D1D1F] font-mono" style={{ fontWeight: 600 }}>{item.address}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{item.clientId}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">{item.received}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#FF9F0A]" style={{ fontWeight: 600 }}>{item.pending}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.usd}</td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={item.status === 'confirming' ? 'blue' : 'amber'}
                              text={item.status === 'confirming' ? t('status.confirming') : t('status.pending')}
                              size="sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Temp Deposit Addresses */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('bb.wallet.depositAddressList')}
                  </h3>
                  <span className="text-sm text-[#6E6E73]">{t('bb.wallet.activeAddresses')} 48</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.addressId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.address')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.network')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.lastDeposit')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'DA-001', address: 'bc1q...x7k2m', clientId: 'CA-001', network: 'Bitcoin', status: 'active', lastDeposit: '2026-06-03 14:22' },
                        { id: 'DA-002', address: '0x3f...a9c1', clientId: 'CA-003', network: 'Ethereum', status: 'active', lastDeposit: '2026-06-02 09:15' },
                        { id: 'DA-003', address: 'TJ9q...3vN7', clientId: 'CA-005', network: 'Tron', status: 'used', lastDeposit: '2026-05-28 18:40' },
                        { id: 'DA-004', address: 'bc1q...p4w8', clientId: 'CA-007', network: 'Bitcoin', status: 'active', lastDeposit: '2026-06-01 11:05' },
                        { id: 'DA-005', address: '0x7a...d2e4', clientId: 'CA-002', network: 'Ethereum', status: 'active', lastDeposit: '2026-05-30 16:33' },
                        { id: 'DA-006', address: '5Fu...kL9p', clientId: 'CA-010', network: 'Solana', status: 'active', lastDeposit: '2026-06-03 08:12' },
                      ].map((addr) => (
                        <tr key={addr.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-[#6E6E73]" />
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{addr.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73] font-mono">{addr.address}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{addr.clientId}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{addr.network}</td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={addr.status === 'active' ? 'green' : 'blue'}
                              text={t(`status.${addr.status}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{addr.lastDeposit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Latest VA Deposits & Withdrawals */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('bb.wallet.latestVaMovements')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.txId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.direction')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { txId: 'TX-1001', dir: 'Deposit', clientId: 'CA-001', asset: 'BTC', amount: 2.5, status: 'confirming', time: '5 min ago' },
                        { txId: 'TX-1002', dir: 'Withdraw', clientId: 'CA-003', asset: 'ETH', amount: 15.8, status: 'pending_approval', time: '12 min ago' },
                        { txId: 'TX-1003', dir: 'Deposit', clientId: 'CA-005', asset: 'USDT', amount: 50000, status: 'completed', time: '18 min ago' },
                        { txId: 'TX-1004', dir: 'Deposit', clientId: 'CA-007', asset: 'SOL', amount: 320, status: 'confirming', time: '25 min ago' },
                        { txId: 'TX-1005', dir: 'Withdraw', clientId: 'CA-002', asset: 'BTC', amount: 1.2, status: 'completed', time: '42 min ago' },
                        { txId: 'TX-1006', dir: 'Deposit', clientId: 'CA-010', asset: 'ETH', amount: 45.0, status: 'completed', time: '1 hr ago' },
                        { txId: 'TX-1007', dir: 'Withdraw', clientId: 'CA-004', asset: 'USDT', amount: 25000, status: 'pending_approval', time: '1.5 hr ago' },
                        { txId: 'TX-1008', dir: 'Deposit', clientId: 'CA-011', asset: 'BTC', amount: 0.75, status: 'completed', time: '2 hr ago' },
                      ].map((tx) => (
                        <tr key={tx.txId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{tx.txId}</td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={tx.dir === 'Deposit' ? 'green' : 'amber'}
                              text={t(statusKey(tx.dir))}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{tx.clientId}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{tx.asset}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">{tx.amount.toLocaleString()}</td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={tx.status === 'completed' ? 'green' : tx.status === 'pending_approval' ? 'amber' : 'blue'}
                              text={t(`status.${tx.status}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Compliance (BeanBank) ── */}
          {activeNav === 'compliance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <MetricCard
                  label={t('bb.compliance.flaggedAddresses')}
                  value="5"
                  subtitle={t('bb.compliance.flaggedAddresses.sub')}
                  color="red"
                />
                <MetricCard
                  label={t('bb.compliance.pendingReview')}
                  value="3"
                  subtitle={t('bb.compliance.pendingReview.sub')}
                  color="amber"
                />
                <MetricCard
                  label={t('bb.compliance.clearedToday')}
                  value="12"
                  subtitle={t('bb.compliance.clearedToday.sub')}
                  color="green"
                />
                <MetricCard
                  label={t('bb.compliance.retroFlagged')}
                  value="3"
                  subtitle={t('bb.compliance.retroFlagged.sub')}
                  color="blue"
                />
              </div>

              {/* Vendor Screening Integration */}
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.compliance.vendorScreening')}
                    </h3>
                    <div className="text-sm text-[#6E6E73] mt-1">{t('bb.compliance.vendorScreening.sub')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { vendor: t('bb.compliance.vendors.chainalysis'), coverage: 'Sanctions, KYT, Risk Scoring', status: 'active', screened: '48,291' },
                    { vendor: t('bb.compliance.vendors.elliptic'), coverage: 'Wallet Screening, Transaction Tracing', status: 'active', screened: '45,877' },
                    { vendor: t('bb.compliance.vendors.bitrace'), coverage: 'AML/CFT, Address Labeling', status: 'active', screened: '42,350' },
                  ].map((v) => (
                    <div key={v.vendor} className="bg-[#F5F5F7] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{v.vendor}</span>
                        <StatusBadge color="green" text={t('status.active')} size="sm" />
                      </div>
                      <div className="text-xs text-[#6E6E73] mb-2">{v.coverage}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6E6E73]">{t('bb.compliance.vendorCoverage')}</span>
                        <span className="text-sm text-[#0A84FF]" style={{ fontWeight: 600 }}>{v.screened} addresses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flagged Addresses — with vendor source and new actions */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[#FF9F0A]" />
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.compliance.actionsNow')}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-[#FF9F0A] text-white rounded-lg text-sm" style={{ fontWeight: 600 }}>
                    {t('bb.compliance.requiresAction')}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">ID</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.address')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.vendor')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.flagReason')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.riskScore')}</th>
                        <th className="text-center text-sm text-[#6E6E73] py-4 px-6">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'DEP-001', address: 'bc1q...x7k2m', clientId: 'CA-001', vendor: 'bb.compliance.vendors.chainalysis', reason: 'bb.compliance.issue.sanctionsHit', risk: 95, severity: 'critical' },
                        { id: 'DEP-002', address: '0x3f...a9c1', clientId: 'CA-003', vendor: 'bb.compliance.vendors.elliptic', reason: 'bb.compliance.issue.pepMatch', risk: 78, severity: 'high' },
                        { id: 'DEP-003', address: 'TJ9q...3vN7', clientId: 'CA-005', vendor: 'bb.compliance.vendors.bitrace', reason: 'bb.compliance.issue.largeTransaction', risk: 45, severity: 'medium' },
                        { id: 'DEP-004', address: 'bc1q...n8w1', clientId: 'CA-009', vendor: 'bb.compliance.vendors.chainalysis', reason: 'bb.compliance.issue.sanctionsHit', risk: 88, severity: 'critical' },
                        { id: 'DEP-005', address: '0x7a...d2e4', clientId: 'CA-002', vendor: 'bb.compliance.vendors.elliptic', reason: 'bb.compliance.issue.pepMatch', risk: 62, severity: 'high' },
                      ].map((item) => (
                        <tr key={item.id} className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors ${
                          item.severity === 'critical' ? 'bg-[#FFF0F0]' : item.severity === 'high' ? 'bg-[#FFF8F0]' : ''
                        }`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={`w-4 h-4 ${
                                item.severity === 'critical' ? 'text-[#FF3B30]' :
                                item.severity === 'high' ? 'text-[#FF9F0A]' :
                                'text-[#6E6E73]'
                              }`} />
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73] font-mono">{item.address}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{item.clientId}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-[#0A84FF]/10 text-[#0A84FF] rounded-lg text-xs" style={{ fontWeight: 600 }}>
                              {t(item.vendor)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{t(item.reason)}</td>
                          <td className="py-4 px-6 text-right">
                            <span className={`text-sm px-2.5 py-1 rounded-lg ${
                              item.risk >= 80 ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                              item.risk >= 60 ? 'bg-[#FF9F0A]/10 text-[#FF9F0A]' :
                              'bg-[#E5E5EA] text-[#6E6E73]'
                            }`} style={{ fontWeight: 600 }}>
                              {item.risk}/100
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6E6E73]/10 text-[#6E6E73] rounded-lg text-xs hover:bg-[#6E6E73]/20 transition-colors" style={{ fontWeight: 600 }}>
                                <Eye className="w-3.5 h-3.5" />
                                {t('bb.compliance.action.ignore')}
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3B30] text-white rounded-lg text-xs hover:bg-[#FF3B30]/90 transition-colors" style={{ fontWeight: 600 }}>
                                <XCircle className="w-3.5 h-3.5" />
                                {t('bb.compliance.action.freezeAsset')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-xl p-4">
                  {t('bb.compliance.action.blockAddress.sub')}
                </div>
              </div>

              {/* Historical Incoming — deposits that were initially green but flagged later */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('bb.compliance.historicalDeposits')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t('bb.compliance.searchDeposits')}
                        className="pl-9 pr-4 py-2 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors"
                      />
                      <svg className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.txId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.address')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.initialScreen')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.currentStatus')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.compliance.flaggedLater')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { txId: 'TX-0981', address: 'bc1q...x7k2m', clientId: 'CA-001', asset: 'BTC', amount: 2.5, initial: 'cleared', current: 'flagged', flaggedLater: true, flagDate: '2026-06-03' },
                        { txId: 'TX-0972', address: '0x3f...a9c1', clientId: 'CA-003', asset: 'ETH', amount: 45.0, initial: 'cleared', current: 'flagged', flaggedLater: true, flagDate: '2026-06-02' },
                        { txId: 'TX-0965', address: 'TJ9q...3vN7', clientId: 'CA-005', asset: 'USDT', amount: 15000, initial: 'cleared', current: 'flagged', flaggedLater: true, flagDate: '2026-06-01' },
                        { txId: 'TX-0954', address: 'bc1q...n8w1', clientId: 'CA-009', asset: 'BTC', amount: 0.45, initial: 'cleared', current: 'cleared', flaggedLater: false },
                        { txId: 'TX-0948', address: '0x7a...d2e4', clientId: 'CA-002', asset: 'ETH', amount: 130.0, initial: 'cleared', current: 'cleared', flaggedLater: false },
                        { txId: 'TX-0940', address: '5Kj...tR2m', clientId: 'CA-007', asset: 'SOL', amount: 580, initial: 'cleared', current: 'cleared', flaggedLater: false },
                        { txId: 'TX-0933', address: 'bc1q...q4e9', clientId: 'CA-011', asset: 'BTC', amount: 3.2, initial: 'cleared', current: 'cleared', flaggedLater: false },
                      ].map((dep) => (
                        <tr key={dep.txId} className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors ${dep.flaggedLater ? 'bg-[#FFF8F0]' : ''}`}>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{dep.txId}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73] font-mono">{dep.address}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{dep.clientId}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{dep.asset}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">{dep.amount.toLocaleString()}</td>
                          <td className="py-4 px-6">
                            <StatusBadge color="green" text={t('bb.compliance.cleared')} size="sm" />
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={dep.current === 'flagged' ? 'red' : dep.current === 'under_review' ? 'amber' : 'green'}
                              text={dep.current === 'flagged' ? t('bb.compliance.flagged') : dep.current === 'under_review' ? t('status.under_review') : t('bb.compliance.cleared')}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6">
                            {dep.flaggedLater ? (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-[#FF9F0A]" />
                                <span className="text-sm text-[#FF9F0A]">{dep.flagDate}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-[#34C759]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Compliance-Frozen Assets ── */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-[#FF3B30]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[#FF3B30]" />
                    <div>
                      <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        {t('bb.wallet.frozenAssets')}
                      </h3>
                      <div className="text-sm text-[#6E6E73] mt-1">{t('bb.wallet.frozenAssets.sub')}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#FF3B30]/10 text-[#FF3B30] rounded-lg text-sm" style={{ fontWeight: 600 }}>
                    3 {t('status.blocked').toLowerCase()}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.col.tempAddress')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.usdEq')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.frozenReason')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.wallet.frozenAt')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { address: 'bc1q...x7k2m', clientId: 'CA-001', asset: 'BTC', amount: '2.5 BTC', usd: '$262,500', reason: t('bb.compliance.issue.sanctionsHit'), frozenAt: '2026-06-03 14:22' },
                        { address: '0x3f...a9c1', clientId: 'CA-003', asset: 'ETH', amount: '45.0 ETH', usd: '$171,000', reason: t('bb.compliance.issue.pepMatch'), frozenAt: '2026-06-02 09:15' },
                        { address: 'TJ9q...3vN7', clientId: 'CA-005', asset: 'USDT', amount: '15,000 USDT', usd: '$15,000', reason: t('bb.compliance.issue.largeTransaction'), frozenAt: '2026-06-01 18:40' },
                      ].map((item) => (
                        <tr key={item.address} className="border-b border-[#E5E5EA] bg-[#FFF8F0] hover:bg-[#FFF0F0] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-[#FF3B30]" />
                              <span className="text-sm text-[#1D1D1F] font-mono" style={{ fontWeight: 600 }}>{item.address}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{item.clientId}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#FF3B30]" style={{ fontWeight: 600 }}>{item.amount}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.usd}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                              <span className="text-sm text-[#FF3B30]">{item.reason}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{item.frozenAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ── Bank & Trust Account ── */}
          {activeNav === 'bank' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <Landmark className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('bb.bank.title')}</div>
                  <div className="text-sm text-[#6E6E73] mt-1">{t('bb.bank.subtitle')}</div>
                </div>
              </div>

              {/* Top Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <MetricCard
                  label={t('bb.bank.trustBalance')}
                  value="$12.4M"
                  subtitle={t('bb.bank.trustBalance.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('bb.bank.vatpLiquidityReserve')}
                  value="$2.0M"
                  subtitle={t('bb.bank.vatpLiquidityReserve.sub')}
                  color="green"
                />
                <MetricCard
                  label={t('bb.bank.availableBalance')}
                  value="$10.4M"
                  subtitle={t('bb.bank.availableBalance.sub')}
                  color="blue"
                />
              </div>

              {/* Order-Linked Fund Movements */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.bank.orderLinkedFunds')}
                    </h3>
                    <div className="text-sm text-[#6E6E73] mt-1">{t('bb.bank.orderLinkedFunds.sub')}</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.referenceId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.orderId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.direction')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('common.asset')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.vaAmount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.fiatCurrency')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.fiatAmount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.receivedAt')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('bb.bank.col.settlementStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ref: 'BNK-REF-001', orderId: 'ORD-4522', clientId: 'CA-001', dir: 'buy', asset: 'BTC', vaAmount: '2.5 BTC', fiatCurrency: 'HKD', fiatAmount: '2,047,500', receivedAt: '2026-06-07 14:05', status: 'paid' },
                        { ref: 'BNK-REF-002', orderId: 'ORD-4521', clientId: 'CA-003', dir: 'buy', asset: 'ETH', vaAmount: '45.0 ETH', fiatCurrency: 'USD', fiatAmount: '171,000', receivedAt: '2026-06-07 13:42', status: 'paid' },
                        { ref: 'BNK-REF-003', orderId: 'ORD-4520', clientId: 'CA-005', dir: 'sell', asset: 'USDT', vaAmount: '50,000 USDT', fiatCurrency: 'HKD', fiatAmount: '390,000', receivedAt: '2026-06-07 12:18', status: 'paid' },
                        { ref: 'BNK-REF-004', orderId: 'ORD-4519', clientId: 'CA-007', dir: 'buy', asset: 'BTC', vaAmount: '1.0 BTC', fiatCurrency: 'USD', fiatAmount: '105,000', receivedAt: '—', status: 'pending' },
                        { ref: 'BNK-REF-005', orderId: 'ORD-4518', clientId: 'CA-002', dir: 'sell', asset: 'ETH', vaAmount: '130.0 ETH', fiatCurrency: 'HKD', fiatAmount: '3,853,200', receivedAt: '2026-06-07 10:55', status: 'paid' },
                        { ref: 'BNK-REF-006', orderId: 'ORD-4517', clientId: 'CA-009', dir: 'buy', asset: 'SOL', vaAmount: '320 SOL', fiatCurrency: 'HKD', fiatAmount: '486,720', receivedAt: '2026-06-07 09:30', status: 'paid' },
                        { ref: 'BNK-REF-007', orderId: 'ORD-4516', clientId: 'CA-004', dir: 'sell', asset: 'BTC', vaAmount: '1.8 BTC', fiatCurrency: 'USD', fiatAmount: '189,000', receivedAt: '2026-06-07 08:12', status: 'paid' },
                        { ref: 'BNK-REF-008', orderId: 'ORD-4515', clientId: 'CA-011', dir: 'buy', asset: 'ETH', vaAmount: '22.0 ETH', fiatCurrency: 'HKD', fiatAmount: '652,080', receivedAt: '—', status: 'failed' },
                        { ref: 'BNK-REF-009', orderId: 'ORD-4514', clientId: 'CA-010', dir: 'buy', asset: 'BTC', vaAmount: '0.5 BTC', fiatCurrency: 'USD', fiatAmount: '52,500', receivedAt: '2026-06-07 07:45', status: 'paid' },
                        { ref: 'BNK-REF-010', orderId: 'ORD-4513', clientId: 'CA-006', dir: 'sell', asset: 'USDT', vaAmount: '25,000 USDT', fiatCurrency: 'HKD', fiatAmount: '195,000', receivedAt: '2026-06-07 07:10', status: 'paid' },
                      ].map((item) => (
                        <tr key={item.ref} className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors ${
                          item.status === 'failed' ? 'bg-[#FFF0F0]' : item.status === 'pending' ? 'bg-[#FFF8F0]' : ''
                        }`}>
                          <td className="py-4 px-4 text-sm text-[#1D1D1F] font-mono" style={{ fontWeight: 600 }}>{item.ref}</td>
                          <td className="py-4 px-4">
                            <button onClick={() => { setActiveNav('orders'); setOrderTab('byDate'); setOrderPage(0); scrollToTop(); }} className="text-sm text-[#0A84FF] hover:underline" style={{ fontWeight: 600 }}>{item.orderId}</button>
                          </td>
                          <td className="py-4 px-4">
                            <button onClick={() => navigateToClientOrders(item.clientId)} className="text-sm text-[#0A84FF] hover:underline" style={{ fontWeight: 600 }}>{item.clientId}</button>
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge
                              color={item.dir === 'buy' ? 'green' : 'amber'}
                              text={item.dir === 'buy' ? t('status.buy') : t('status.sell')}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</td>
                          <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]">{item.vaAmount}</td>
                          <td className="py-4 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            <span className={`px-2 py-0.5 rounded text-xs ${item.fiatCurrency === 'HKD' ? 'bg-[#0A84FF]/10 text-[#0A84FF]' : 'bg-[#34C759]/10 text-[#34C759]'}`} style={{ fontWeight: 600 }}>{item.fiatCurrency}</span>
                          </td>
                          <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {item.fiatAmount}
                          </td>
                          <td className="py-4 px-4 text-sm text-[#6E6E73]">{item.receivedAt}</td>
                          <td className="py-4 px-4">
                            <StatusBadge
                              color={item.status === 'paid' ? 'green' : item.status === 'pending' ? 'amber' : 'red'}
                              text={t(`bb.bank.settlement.${item.status}`)}
                              size="sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-xl p-4">
                  Each Reference ID is linked 1:1 with an Order ID. If 10 orders of 100 USDT are placed and only 9 payments received, the Reference ID mapping identifies exactly which order failed to settle.
                </div>
              </div>

              {/* Historical Fiat Flow */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {t('bb.bank.historicalFlow')}
                    </h3>
                    <div className="text-sm text-[#6E6E73] mt-1">{t('bb.bank.historicalFlow.sub')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Incoming */}
                  <div className="bg-[#F0FFF4] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowDownLeft className="w-5 h-5 text-[#34C759]" />
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('bb.bank.incoming')}</span>
                    </div>
                    <div className="text-sm text-[#6E6E73] mb-4">{t('bb.bank.incoming.sub')}</div>
                    <div className="space-y-3">
                      {[
                        { date: '2026-06-07', amount: '9.4M', orders: 52 },
                        { date: '2026-06-06', amount: '7.6M', orders: 41 },
                        { date: '2026-06-05', amount: '8.6M', orders: 48 },
                        { date: '2026-06-04', amount: '6.8M', orders: 35 },
                        { date: '2026-06-03', amount: '10.1M', orders: 55 },
                      ].map((day) => (
                        <div key={day.date} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{day.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-[#6E6E73]">{day.orders} orders</span>
                            <span className="text-sm text-[#34C759]" style={{ fontWeight: 600 }}>{day.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Outgoing */}
                  <div className="bg-[#FFF8F0] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUpRight className="w-5 h-5 text-[#FF9F0A]" />
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('bb.bank.outgoing')}</span>
                    </div>
                    <div className="text-sm text-[#6E6E73] mb-4">{t('bb.bank.outgoing.sub')}</div>
                    <div className="space-y-3">
                      {[
                        { date: '2026-06-07', amount: '6.6M', orders: 38 },
                        { date: '2026-06-06', amount: '5.6M', orders: 29 },
                        { date: '2026-06-05', amount: '7.1M', orders: 42 },
                        { date: '2026-06-04', amount: '5.3M', orders: 25 },
                        { date: '2026-06-03', amount: '7.8M', orders: 44 },
                      ].map((day) => (
                        <div key={day.date} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{day.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-[#6E6E73]">{day.orders} orders</span>
                            <span className="text-sm text-[#FF9F0A]" style={{ fontWeight: 600 }}>{day.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!['dashboard', 'clients', 'orders', 'wallet', 'compliance', 'reports', 'bank'].includes(activeNav) && (
            <div className="text-center py-12">
              <h2 className="text-2xl text-[#1D1D1F] mb-4" style={{ fontWeight: 600 }}>
                {(() => {
                  const item = navItems.find(item => item.id === activeNav);
                  return item ? t(item.labelKey) : '';
                })()}
              </h2>
              <p className="text-[#6E6E73]">{t('common.contentComingSoon')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}