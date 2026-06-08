import { useState } from 'react';
import { TopNav } from './shared/TopNav';
import { SidebarNav } from './shared/SidebarNav';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { useLanguage } from '../shared/LanguageContext';
import {
  referredClients,
  revenueSettlements,
  referralOrders,
  bankAccounts,
} from '../shared/mockData';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  Landmark,
  Settings,
  Building2,
  TrendingUp,
  Info,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Save,
  ChevronRight,
} from 'lucide-react';

interface ReferralAccountDashboardProps {
  onSwitchRole: () => void;
}

const navItems = [
  { id: 'dashboard', labelKey: 'nav.ref.dashboard', icon: LayoutDashboard },
  { id: 'users', labelKey: 'nav.ref.users', icon: Users },
  { id: 'orders', labelKey: 'nav.ref.orders', icon: ShoppingCart },
  { id: 'revenue', labelKey: 'nav.ref.revenue', icon: DollarSign },
  { id: 'reports', labelKey: 'nav.ref.reports', icon: FileText },
  { id: 'bank', labelKey: 'nav.ref.bank', icon: Landmark },
  { id: 'settings', labelKey: 'nav.ref.settings', icon: Settings },
];

export function ReferralAccountDashboard({ onSwitchRole }: ReferralAccountDashboardProps) {
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showOrders, setShowOrders] = useState(true);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  // Derived stats
  const totalReferred = referredClients.length;
  const activeUsers = referredClients.filter(c => c.accountStatus === 'active').length;
  const totalVolume = referredClients.reduce((s, c) => s + c.totalVolumeUsd, 0);
  const currentMonthRevenue = revenueSettlements.find(r => r.period === '2026-06')?.totalRevenue ?? 0;
  const lifetimeRevenue = revenueSettlements.reduce((s, r) => s + r.totalRevenue, 0);
  const lastSettled = revenueSettlements.find(r => r.settlementStatus === 'settled');
  const pendingSettlement = revenueSettlements.find(r => r.settlementStatus === 'pending');

  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <TopNav
        title="FI Referral"
        subtitle={t('ref.subtitle')}
        badge={{ text: t('ref.referralBadge'), color: 'green' }}
        onSwitchRole={onSwitchRole}
        rightContent={
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F7] rounded-xl">
            <Building2 className="w-5 h-5 text-[#6E6E73]" />
            <div className="text-sm text-[#1D1D1F]">{t('ref.adminName')}</div>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white border-r border-[#E5E5EA] overflow-y-auto">
          <SidebarNav items={navItems} activeId={activeNav} onItemClick={handleNavClick} />
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {/* ── Dashboard ── */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#34C759] rounded-2xl p-6 flex items-start gap-4">
                <Info className="w-6 h-6 text-[#34C759] flex-shrink-0 mt-0.5" />
                <div className="text-base text-[#1D1D1F]">
                  <span style={{ fontWeight: 600 }}>{t('ref.referralActive.label')}</span>{t('ref.referralActive.body')}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <MetricCard
                  label={t('ref.metric.totalReferred')}
                  value={totalReferred.toString()}
                  subtitle={t('ref.metric.totalReferred.sub')}
                />
                <MetricCard
                  label={t('ref.metric.activeUsers')}
                  value={activeUsers.toString()}
                  subtitle={t('ref.metric.activeUsers.sub')}
                  color="green"
                />
                <MetricCard
                  label={t('ref.metric.totalVolume')}
                  value={`$${(totalVolume / 1e6).toFixed(1)}M`}
                  subtitle={t('ref.metric.totalVolume.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('ref.metric.revenueThisMonth')}
                  value={`$${currentMonthRevenue.toLocaleString()}`}
                  subtitle={t('ref.metric.revenueThisMonth.sub')}
                  color="green"
                />
              </div>

              {/* Revenue Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.revenue.title')}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[#F0F7FF] rounded-xl p-6">
                    <div className="text-sm text-[#6E6E73] mb-2">{t('ref.revenue.feeShare')}</div>
                    <div className="text-3xl text-[#0A84FF]" style={{ fontWeight: 600 }}>15%</div>
                    <div className="text-sm text-[#6E6E73] mt-2">{t('ref.revenue.feeShare.sub')}</div>
                  </div>
                  <div className="bg-[#F0FFF4] rounded-xl p-6">
                    <div className="text-sm text-[#6E6E73] mb-2">{t('ref.revenue.lifetimeRevenue')}</div>
                    <div className="text-3xl text-[#34C759]" style={{ fontWeight: 600 }}>{`$${lifetimeRevenue.toLocaleString()}`}</div>
                    <div className="text-sm text-[#6E6E73] mt-2">{t('ref.revenue.lifetimeRevenue.sub')}</div>
                  </div>
                  <div className="bg-[#FFF8F0] rounded-xl p-6">
                    <div className="text-sm text-[#6E6E73] mb-2">{t('ref.revenue.pendingSettlement')}</div>
                    <div className="text-3xl text-[#FF9F0A]" style={{ fontWeight: 600 }}>{`$${pendingSettlement?.totalRevenue.toLocaleString() ?? '0'}`}</div>
                    <div className="text-sm text-[#6E6E73] mt-2">{t('ref.revenue.pendingSettlement.sub')}</div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E5E5EA]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        {t('ref.revenue.lastSettlement')}: {lastSettled?.period} — {`$${lastSettled?.settledAmount.toLocaleString()}`}
                      </span>
                    </div>
                    <span className="text-sm text-[#6E6E73]">{lastSettled?.settlementDate} · Ref: {lastSettled?.bankRef}</span>
                  </div>
                </div>
              </div>

              {/* Recent referred users summary */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('ref.users.recentActivity')}
                  </h3>
                  <button
                    onClick={() => setActiveNav('users')}
                    className="text-sm text-[#0A84FF] hover:underline flex items-center gap-1"
                    style={{ fontWeight: 600 }}
                  >
                    {t('ref.users.viewAll')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.kycStatus')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.accountStatus')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.volume')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.lastActivity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referredClients.slice(0, 5).map((client) => (
                        <tr key={client.clientId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {client.clientId}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={client.kycStatus === 'passed' ? 'green' : client.kycStatus === 'pending' ? 'amber' : 'red'}
                              text={t(`status.${client.kycStatus}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={client.accountStatus === 'active' ? 'green' : client.accountStatus === 'pending' ? 'amber' : 'red'}
                              text={t(`status.${client.accountStatus}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {`$${client.totalVolumeUsd.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{client.lastActivity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custody notice */}
              <div className="bg-white border border-[#FF9F0A] rounded-2xl p-6 flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
                <div className="text-base text-[#1D1D1F]">
                  <span style={{ fontWeight: 600 }}>{t('ref.custodyNotice.label')}</span>{t('ref.custodyNotice.body')}
                </div>
              </div>
            </div>
          )}

          {/* ── Referred Users ── */}
          {activeNav === 'users' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <Users className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div className="text-base text-[#1D1D1F]">
                  <span style={{ fontWeight: 600 }}>{t('ref.users.notice.label')}</span>{t('ref.users.notice.body')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <MetricCard
                  label={t('ref.metric.totalReferred')}
                  value={totalReferred.toString()}
                  subtitle={t('ref.metric.totalReferred.sub')}
                />
                <MetricCard
                  label={t('ref.metric.activeUsers')}
                  value={activeUsers.toString()}
                  subtitle={t('ref.metric.activeUsers.sub')}
                  color="green"
                />
                <MetricCard
                  label={t('ref.metric.pendingKyc')}
                  value={referredClients.filter(c => c.kycStatus === 'pending').length.toString()}
                  subtitle={t('ref.metric.pendingKyc.sub')}
                  color="amber"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('ref.users.table.title')}
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('ref.users.searchPh')}
                      className="pl-9 pr-4 py-2 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors"
                    />
                    <svg className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.kycStatus')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.accountStatus')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.orderCount')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.volume')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.referredAt')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.lastActivity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referredClients.map((client) => (
                        <tr key={client.clientId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {client.clientId}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={client.kycStatus === 'passed' ? 'green' : client.kycStatus === 'pending' ? 'amber' : 'red'}
                              text={t(`status.${client.kycStatus}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={client.accountStatus === 'active' ? 'green' : client.accountStatus === 'pending' ? 'amber' : 'red'}
                              text={t(`status.${client.accountStatus}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {client.orderCount}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                            {`$${client.totalVolumeUsd.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{client.referredAt}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{client.lastActivity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Orders (Optional) ── */}
          {activeNav === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <ShoppingCart className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-base text-[#1D1D1F]">
                    <span style={{ fontWeight: 600 }}>{t('ref.orders.notice.label')}</span>{t('ref.orders.notice.body')}
                  </div>
                </div>
                <button
                  onClick={() => setShowOrders(!showOrders)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-colors"
                >
                  {showOrders ? <EyeOff className="w-4 h-4 text-[#6E6E73]" /> : <Eye className="w-4 h-4 text-[#0A84FF]" />}
                  <span className="text-sm" style={{ fontWeight: 600 }}>
                    {showOrders ? t('ref.orders.hideOrders') : t('ref.orders.showOrders')}
                  </span>
                </button>
              </div>

              {showOrders ? (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    <MetricCard
                      label={t('ref.orders.totalOrders')}
                      value={referralOrders.length.toString()}
                      subtitle={t('ref.orders.totalOrders.sub')}
                      color="blue"
                    />
                    <MetricCard
                      label={t('ref.orders.buyOrders')}
                      value={referralOrders.filter(o => o.side === 'Buy').length.toString()}
                      color="green"
                    />
                    <MetricCard
                      label={t('ref.orders.sellOrders')}
                      value={referralOrders.filter(o => o.side === 'Sell').length.toString()}
                      color="red"
                    />
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                      {t('ref.orders.table.title')}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E5E5EA]">
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.orders.col.orderId')}</th>
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.col.clientId')}</th>
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.orders.col.side')}</th>
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                            <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                            <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.orders.col.usdValue')}</th>
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                            <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.orders.col.placedAt')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referralOrders.map((order) => (
                            <tr key={order.orderId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                              <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                                {order.orderId}
                              </td>
                              <td className="py-4 px-6 text-sm text-[#6E6E73]">
                                {order.clientId}
                              </td>
                              <td className="py-4 px-6">
                                <StatusBadge
                                  color={order.side === 'Buy' ? 'green' : 'red'}
                                  text={t(`status.${order.side.toLowerCase()}`)}
                                  size="sm"
                                />
                              </td>
                              <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                                {order.asset}
                              </td>
                              <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">
                                {order.amount.toLocaleString()}
                              </td>
                              <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                                {`$${order.usd.toLocaleString()}`}
                              </td>
                              <td className="py-4 px-6">
                                <StatusBadge
                                  color={order.status === 'completed' ? 'green' : order.status === 'pending' ? 'amber' : 'red'}
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
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <EyeOff className="w-12 h-12 text-[#6E6E73] mx-auto mb-4" />
                  <h3 className="text-lg text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                    {t('ref.orders.hiddenTitle')}
                  </h3>
                  <p className="text-sm text-[#6E6E73]">{t('ref.orders.hiddenBody')}</p>
                  <button
                    onClick={() => setShowOrders(true)}
                    className="mt-4 px-6 py-2.5 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    {t('ref.orders.showOrders')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Revenue ── */}
          {activeNav === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <MetricCard
                  label={t('ref.revenue.lifetimeRevenue')}
                  value={`$${lifetimeRevenue.toLocaleString()}`}
                  subtitle={t('ref.revenue.lifetimeRevenue.sub')}
                  color="green"
                />
                <MetricCard
                  label={t('ref.metric.revenueThisMonth')}
                  value={`$${currentMonthRevenue.toLocaleString()}`}
                  subtitle={t('ref.metric.revenueThisMonth.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('ref.revenue.feeShare')}
                  value="15%"
                  subtitle={t('ref.revenue.feeShare.sub')}
                />
              </div>

              {/* Revenue Breakdown — This Month (2026-06) */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('ref.revenue.breakdown.title')}
                  </h3>
                  <span className="text-sm text-[#6E6E73]">{t('ref.revenue.thisMonth')} · 2026-06</span>
                </div>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-[#E5E5EA]">
                    <div className="text-sm text-[#6E6E73] mb-2">{t('ref.revenue.tradingFees')}</div>
                    <div className="text-3xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                      {`$${(revenueSettlements.find(r => r.period === '2026-06')?.tradingFeeRevenue ?? 0).toLocaleString()}`}
                    </div>
                    {/* Fee Derivation */}
                    {(() => {
                      const thisMonthOrders = referralOrders.filter(o => o.placedAt.startsWith('2026-06') && o.status === 'completed');
                      const totalVolume = thisMonthOrders.reduce((s, o) => s + o.usd, 0);
                      const FEE_RATE = 0.007; // 0.7%
                      const derivedFee = Math.round(totalVolume * FEE_RATE);
                      return (
                        <div className="mt-4 bg-[#F5F5F7] rounded-xl p-4">
                          <div className="text-xs text-[#6E6E73] mb-3" style={{ fontWeight: 600 }}>Fee Derivation</div>
                          <div className="space-y-1.5">
                            {thisMonthOrders.map(o => (
                              <div key={o.orderId} className="flex justify-between text-xs">
                                <span className="text-[#6E6E73]">{o.orderId} · {o.side} {o.asset}</span>
                                <span className="text-[#1D1D1F]">{`$${o.usd.toLocaleString()} × 0.7% = $${Math.round(o.usd * FEE_RATE).toLocaleString()}`}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#E5E5EA] flex justify-between text-xs">
                            <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>Total Volume × 0.7%</span>
                            <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>{`$${totalVolume.toLocaleString()} × 0.7% = $${derivedFee.toLocaleString()}`}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <div className="text-sm text-[#6E6E73] mb-4">{t('ref.revenue.oneTimeBonuses')}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6E6E73]">{t('ref.revenue.signup')}</span>
                        <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          {`$${(revenueSettlements.find(r => r.period === '2026-06')?.signupBonuses ?? 0).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6E6E73]">{t('ref.revenue.firstTrade')}</span>
                        <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          {`$${(revenueSettlements.find(r => r.period === '2026-06')?.firstTradeBonuses ?? 0).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6E6E73]">{t('ref.revenue.volume')}</span>
                        <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          {`$${(revenueSettlements.find(r => r.period === '2026-06')?.volumeBonuses ?? 0).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-3 border-t border-[#E5E5EA]">
                        <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>Total Bonuses</span>
                        <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          {`$${(() => { const m = revenueSettlements.find(r => r.period === '2026-06'); return (m ? m.signupBonuses + m.firstTradeBonuses + m.volumeBonuses : 0); })().toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E5E5EA]">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>Total Revenue (This Month)</span>
                      <span className="text-2xl text-[#34C759]" style={{ fontWeight: 600 }}>
                        {`$${currentMonthRevenue.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="text-sm text-[#6E6E73] mt-1">Trading Fees + Total Bonuses</div>
                  </div>
                </div>
              </div>

              {/* Settlement History */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.revenue.settlementHistory')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.period')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.tradingFees')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.bonuses')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.totalRevenue')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.settledAmount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.settlementDate')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.revenue.col.bankRef')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSettlements.map((settlement) => (
                        <tr key={settlement.period} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {settlement.period}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                            {`$${settlement.tradingFeeRevenue.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">
                            {`$${(settlement.signupBonuses + settlement.firstTradeBonuses + settlement.volumeBonuses).toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {`$${settlement.totalRevenue.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {`$${settlement.settledAmount.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">
                            {settlement.settlementDate || '—'}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge
                              color={settlement.settlementStatus === 'settled' ? 'green' : settlement.settlementStatus === 'processing' ? 'blue' : 'amber'}
                              text={t(`ref.revenue.settlement.${settlement.settlementStatus}`)}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">
                            {settlement.bankRef || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Reports ── */}
          {activeNav === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <FileText className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ref.reports.title')}</div>
                  <div className="text-sm text-[#6E6E73] mt-1">{t('ref.reports.subtitle')}</div>
                </div>
              </div>

              {/* Generate Report */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.reports.generate')}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.reports.reportType')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>{t('ref.reports.types.revenueSharing')}</option>
                      <option>{t('ref.reports.types.settlementConfirmation')}</option>
                      <option>{t('ref.reports.types.referralActivity')}</option>
                      <option>{t('ref.reports.types.monthlySummary')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.reports.period')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>{t('month.may_2026')}</option>
                      <option>{t('month.april_2026')}</option>
                      <option>{t('month.march_2026')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.reports.format')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>PDF</option>
                      <option>CSV</option>
                      <option>XLSX</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                    {t('ref.reports.generateBtn')}
                  </button>
                </div>
              </div>

              {/* Settlement Confirmation — Auto-generated */}
              <div className="bg-white border border-[#34C759] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                    <div>
                      <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ref.reports.types.settlementConfirmation')}</h3>
                      <div className="text-xs text-[#6E6E73]">{t('ref.reports.settlement.autoGenerated')}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6E6E73]" />
                    <span className="text-[#6E6E73]">{t('ref.reports.settlement.lastGenerated')}:</span>
                    <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>2026-06-05</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0A84FF]" />
                    <span className="text-[#6E6E73]">{t('ref.reports.settlement.nextGeneration')}:</span>
                    <span className="text-[#0A84FF]" style={{ fontWeight: 600 }}>2026-07-05</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ref.reports.settlement.col.period')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ref.reports.settlement.col.amount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ref.reports.settlement.col.bankRef')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ref.reports.settlement.col.confirmed')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSettlements.filter(r => r.settlementStatus === 'settled').slice(0, 4).map((s) => (
                        <tr key={s.period} className="border-b border-[#E5E5EA]">
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{s.period}</td>
                          <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]">{`$${s.settledAmount.toLocaleString()}`}</td>
                          <td className="py-3 px-4 text-sm text-[#6E6E73]">{s.bankRef}</td>
                          <td className="py-3 px-4">
                            <StatusBadge color="green" text={t('ref.reports.settlement.confirmed')} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report History */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.reports.exportHistory')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.reports.col.type')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.reports.col.period')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.reports.col.generatedAt')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.reports.col.format')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: t('ref.reports.types.revenueSharing'), period: '2026-05', generatedAt: '2026-06-01 10:00', status: 'completed', format: 'PDF' },
                        { type: t('ref.reports.types.settlementConfirmation'), period: '2026-05', generatedAt: '2026-06-05 08:00', status: 'completed', format: 'PDF' },
                        { type: t('ref.reports.types.referralActivity'), period: '2026-05', generatedAt: '2026-06-02 14:30', status: 'completed', format: 'CSV' },
                        { type: t('ref.reports.types.monthlySummary'), period: '2026-04', generatedAt: '2026-05-01 09:00', status: 'completed', format: 'PDF' },
                      ].map((report, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{report.type}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{report.period}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{report.generatedAt}</td>
                          <td className="py-4 px-6">
                            <StatusBadge color="green" text={t('status.completed')} size="sm" />
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

          {/* ── Bank ── */}
          {activeNav === 'bank' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
                <Landmark className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ref.bank.title')}</div>
                  <div className="text-sm text-[#6E6E73] mt-1">{t('ref.bank.subtitle')}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <MetricCard
                  label={t('ref.bank.nextSettlement')}
                  value={`$${pendingSettlement?.totalRevenue.toLocaleString() ?? '0'}`}
                  subtitle={t('ref.bank.nextSettlement.sub')}
                  color="blue"
                />
                <MetricCard
                  label={t('ref.bank.settlementFrequency')}
                  value={t('ref.bank.monthly')}
                  subtitle={t('ref.bank.settlementFrequency.sub')}
                />
              </div>

              {/* Bank Accounts */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    {t('ref.bank.accounts')}
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                    <Plus className="w-4 h-4" />
                    {t('ref.bank.addAccount')}
                  </button>
                </div>
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className={`border rounded-xl p-6 transition-all ${account.isPrimary ? 'border-[#0A84FF] bg-[#F0F7FF]' : 'border-[#E5E5EA]'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#E5E5EA]">
                            <Landmark className="w-6 h-6 text-[#0A84FF]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{account.bankName}</span>
                              {account.isPrimary && (
                                <span className="px-2 py-0.5 bg-[#0A84FF] text-white text-xs rounded-md" style={{ fontWeight: 600 }}>
                                  {t('ref.bank.primary')}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-[#6E6E73] mt-1">
                              {account.accountNumber} · {account.accountName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-[#6E6E73]">{account.currency}</div>
                            <StatusBadge
                              color={account.status === 'active' ? 'green' : 'amber'}
                              text={t(account.status === 'active' ? 'status.active' : 'status.pending_verification')}
                              size="sm"
                            />
                          </div>
                          <button className="px-4 py-2 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors" style={{ fontWeight: 600 }}>
                            {t('ref.bank.edit')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlement Preferences */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.bank.settlementPrefs')}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.bank.settlementCurrency')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>USD</option>
                      <option>HKD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.bank.settlementDay')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      <option>{t('ref.bank.day5')}</option>
                      <option>{t('ref.bank.day10')}</option>
                      <option>{t('ref.bank.day15')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.bank.primaryAccount')}</label>
                    <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors">
                      {bankAccounts.filter(a => a.status === 'active').map(a => (
                        <option key={a.id}>{a.bankName} ({a.accountNumber})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.bank.autoSettle')}</label>
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-11 h-6 bg-[#34C759] rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                      </div>
                      <span className="text-sm text-[#1D1D1F]">{t('ref.bank.autoSettle.enabled')}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                    <Save className="w-4 h-4" />
                    {t('ref.bank.savePrefs')}
                  </button>
                </div>
              </div>

              {/* Recent Settlements */}
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.bank.recentSettlements')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.bank.col.period')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ref.bank.col.amount')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.bank.col.destination')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.bank.col.date')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ref.bank.col.bankRef')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSettlements.filter(r => r.settlementStatus === 'settled').map((s) => (
                        <tr key={s.period} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{s.period}</td>
                          <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                            {`$${s.settledAmount.toLocaleString()}`}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">
                            HSBC ****-****-4521
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{s.settlementDate}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{s.bankRef}</td>
                          <td className="py-4 px-6">
                            <StatusBadge color="green" text={t('ref.revenue.settlement.settled')} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {activeNav === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                  {t('ref.settings.title')}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.settings.orgName')}</label>
                    <input
                      type="text"
                      defaultValue="FI Referral Corp"
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.settings.apiKey')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue="sk-ref-****-****-a3f8"
                        readOnly
                        className="flex-1 px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#6E6E73] border border-transparent"
                      />
                      <button className="px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm hover:bg-[#E5E5EA] transition-colors" style={{ fontWeight: 600 }}>
                        {t('ref.settings.rotate')}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.settings.webhookUrl')}</label>
                    <input
                      type="text"
                      defaultValue="https://api.fireferral.com/webhooks/bxc"
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0A84FF] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6E6E73] mb-2">{t('ref.settings.referralCode')}</label>
                    <input
                      type="text"
                      defaultValue="FI-REF-2026"
                      readOnly
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#6E6E73] border border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#0A84FF] text-white rounded-xl text-sm hover:bg-[#0A84FF]/90 transition-colors" style={{ fontWeight: 600 }}>
                    <Save className="w-4 h-4" />
                    {t('ref.settings.save')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}