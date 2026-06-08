import { useState } from 'react';
import { TopNav } from './shared/TopNav';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { useLanguage, statusKey } from '../shared/LanguageContext';
import {
  Wallet,
  Shield,
  Thermometer,
  Flame,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface WalletCustodyScreenProps {
  onSwitchRole: () => void;
  onBack: () => void;
}

const walletBreakdown = [
  { type: 'Cold Storage', percentage: 85, amount: 46070000, color: '#0A84FF' },
  { type: 'Hot Wallet', percentage: 15, amount: 8130000, color: '#FF9F0A' },
];

const pendingTransactions = [
  { id: 'TX-001', type: 'Withdrawal', asset: 'BTC', amount: 2.5, value: 108800, status: 'Pending Approval', time: '5 min ago' },
  { id: 'TX-002', type: 'Cold → Hot', asset: 'ETH', amount: 50, value: 114000, status: 'In Progress', time: '12 min ago' },
  { id: 'TX-003', type: 'Deposit', asset: 'USDT', amount: 50000, value: 50000, status: 'Confirming', time: '18 min ago' },
];

export function WalletCustodyScreen({ onSwitchRole, onBack }: WalletCustodyScreenProps) {
  const { t } = useLanguage();
  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <TopNav
        title={t('wallet.title')}
        subtitle={t('wallet.subtitle')}
        onSwitchRole={onSwitchRole}
        rightContent={
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-colors text-sm text-[#1D1D1F]"
          >
            {t('common.backToDashboard')}
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0A84FF] to-[#0A84FF]/80 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm opacity-90 mb-2">{t('wallet.totalAuc')}</div>
                <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>$54.2M</div>
                <div className="text-sm opacity-90">{t('wallet.totalAuc.sub')}</div>
              </div>
              <Shield className="w-16 h-16 opacity-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-[#0A84FF]">
                  <Thermometer className="w-5 h-5" />
                  <span className="text-sm">{t('wallet.cold')}</span>
                </div>
                <div className="text-2xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>$46.1M</div>
                <div className="text-xs text-[#6E6E73]">{t('wallet.coldPct')}</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-[#0A84FF]">
                  <Flame className="w-5 h-5" />
                  <span className="text-sm">{t('wallet.hot')}</span>
                </div>
                <div className="text-2xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>$8.1M</div>
                <div className="text-xs text-[#6E6E73]">{t('wallet.hotPct')}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <MetricCard
              label={t('wallet.multiSig')}
              value="12"
              subtitle={t('wallet.multiSig.sub')}
              color="blue"
            />
            <MetricCard
              label={t('wallet.pendingApprovals')}
              value="3"
              subtitle={t('wallet.pendingApprovals.sub')}
              color="amber"
            />
            <MetricCard
              label={t('wallet.dailyTransfers')}
              value="$1.8M"
              subtitle={t('wallet.dailyTransfers.sub')}
              color="green"
            />
            <MetricCard
              label={t('wallet.insurance')}
              value="$50M"
              subtitle={t('wallet.insurance.sub')}
              color="green"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
              {t('wallet.storageAllocation')}
            </h3>

            <div className="space-y-6">
              {walletBreakdown.map((wallet) => (
                <div key={wallet.type}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {wallet.type === 'Cold Storage' ? (
                        <Thermometer className="w-5 h-5 text-[#0A84FF]" />
                      ) : (
                        <Flame className="w-5 h-5 text-[#FF9F0A]" />
                      )}
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        {wallet.type === 'Cold Storage' ? t('wallet.cold') : t('wallet.hot')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        ${(wallet.amount / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-[#6E6E73]">{wallet.percentage}%</div>
                    </div>
                  </div>
                  <div className="h-3 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${wallet.percentage}%`,
                        backgroundColor: wallet.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                {t('wallet.coldDetails')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#0A84FF]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.hsm')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.hsm.sub')}</div>
                    </div>
                  </div>
                  <StatusBadge color="green" text={t('status.active')} icon="check" size="sm" />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#0A84FF]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.geo')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.geo.sub')}</div>
                    </div>
                  </div>
                  <StatusBadge color="green" text={t('status.distributed')} icon="check" size="sm" />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0A84FF]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.multiSigDetail')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.multiSigDetail.sub')}</div>
                    </div>
                  </div>
                  <StatusBadge color="blue" text="3/5" size="sm" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
                {t('wallet.hotOps')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Unlock className="w-5 h-5 text-[#FF9F0A]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.dailyTradingLimit')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.dailyTradingLimit.sub')}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>$2.5M</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <ArrowDownLeft className="w-5 h-5 text-[#34C759]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.deposits24')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.deposits24.sub')}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#34C759]" style={{ fontWeight: 600 }}>$1.2M</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="w-5 h-5 text-[#FF9F0A]" />
                    <div>
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('wallet.withdrawals24')}</div>
                      <div className="text-xs text-[#6E6E73]">{t('wallet.withdrawals24.sub')}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#FF9F0A]" style={{ fontWeight: 600 }}>$845K</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>
              {t('wallet.pendingTx')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('wallet.col.txId')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.type')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.asset')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.amount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.value')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('wallet.col.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                      <td className="py-4 px-6 text-sm text-[#6E6E73]">{tx.id}</td>
                      <td className="py-4 px-6">
                        <StatusBadge
                          color={tx.type === 'Deposit' ? 'green' : tx.type === 'Withdrawal' ? 'amber' : 'blue'}
                          text={t(statusKey(tx.type))}
                          size="sm"
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{tx.asset}</td>
                      <td className="py-4 px-6 text-sm text-[#1D1D1F]">{tx.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm text-[#1D1D1F]">${tx.value.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <StatusBadge
                          color={tx.status === 'Pending Approval' ? 'amber' : 'blue'}
                          text={t(statusKey(tx.status))}
                          icon="clock"
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
      </main>
    </div>
  );
}
