import { useState } from 'react';
import { BeanIcon } from './BeanIcon';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../shared/LanguageContext';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  ShoppingCart,
  Wallet,
  DollarSign,
  Shield,
  FileText,
  Settings,
  Bell,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Code,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', labelKey: 'nav.sc.dashboard', icon: LayoutDashboard },
  { id: 'users', labelKey: 'nav.sc.users', icon: Users },
  { id: 'kyc', labelKey: 'nav.sc.kyc', icon: FileCheck },
  { id: 'orders', labelKey: 'nav.sc.orders', icon: ShoppingCart },
  { id: 'positions', labelKey: 'nav.sc.positions', icon: TrendingUp },
  { id: 'wallet', labelKey: 'nav.sc.wallet', icon: Wallet },
  { id: 'revenue', labelKey: 'nav.sc.revenue', icon: DollarSign },
  { id: 'compliance', labelKey: 'nav.sc.compliance', icon: Shield },
  { id: 'reports', labelKey: 'nav.sc.reports', icon: FileText },
  { id: 'settings', labelKey: 'nav.sc.settings', icon: Settings },
];

const referredUsers = [
  { id: 'U001', name: 'A*** C***', kyc: 'Passed', account: 'BXC-SC-001', volume: '$125,420', created: '2026-05-15 14:32' },
  { id: 'U002', name: 'B*** W***', kyc: 'Re-KYC Required', account: 'Pending', volume: '$0', created: '2026-05-20 09:15' },
  { id: 'U003', name: 'C*** L***', kyc: 'Passed', account: 'BXC-SC-003', volume: '$89,230', created: '2026-06-01 11:45' },
  { id: 'U004', name: 'D*** N***', kyc: 'Passed', account: 'BXC-SC-004', volume: '$254,890', created: '2026-06-03 16:20' },
  { id: 'U005', name: 'E*** T***', kyc: 'Re-KYC Required', account: 'Pending', volume: '$0', created: '2026-06-05 10:10' },
];

interface SCSecuritiesDashboardProps {
  onSwitchRole: () => void;
  onNavigate: (screen: 'wallet' | 'compliance') => void;
  onPreviewH5: () => void;
}

export function SCSecuritiesDashboard({ onSwitchRole, onNavigate, onPreviewH5 }: SCSecuritiesDashboardProps) {
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <header className="bg-white border-b border-[#E5E5EA] px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A84FF] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    SC Securities
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-[#34C759] text-[#34C759] text-xs rounded-lg" style={{ fontWeight: 600 }}>
                    {t('sc.referralBadge')}
                  </span>
                </div>
                <div className="text-xs text-[#6E6E73]">{t('sc.subtitle')}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors">
              <Bell className="w-5 h-5 text-[#6E6E73]" />
            </button>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F7] rounded-xl">
              <div className="w-8 h-8 bg-[#0A84FF] rounded-full flex items-center justify-center">
                <span className="text-sm text-white" style={{ fontWeight: 600 }}>SC</span>
              </div>
              <div className="text-sm text-[#1D1D1F]">{t('sc.adminName')}</div>
            </div>
            <LanguageToggle />
            <button
              onClick={onSwitchRole}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-all"
            >
              <span className="text-sm text-[#1D1D1F]">{t('common.switchRole')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white border-r border-[#E5E5EA] overflow-y-auto">
          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all ${
                    isActive
                      ? 'bg-white border border-[#0A84FF] text-[#0A84FF]'
                      : 'text-[#6E6E73] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm flex-1 text-left" style={{ fontWeight: isActive ? 600 : 400 }}>{t(item.labelKey)}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#0A84FF] rounded-2xl p-6 flex items-start gap-4">
              <Info className="w-6 h-6 text-[#0A84FF] flex-shrink-0 mt-0.5" />
              <div className="text-base text-[#1D1D1F]">
                <span style={{ fontWeight: 600 }}>{t('sc.referralActive.label')}</span>{t('sc.referralActive.body')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-sm text-[#6E6E73] mb-3">{t('sc.metric.totalReferred')}</div>
                <div className="text-4xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>247</div>
                <div className="text-sm text-[#34C759]">{t('sc.metric.totalReferred.sub')}</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-sm text-[#6E6E73] mb-3">{t('sc.metric.activeUsers')}</div>
                <div className="text-4xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>189</div>
                <div className="text-sm text-[#6E6E73]">{t('sc.metric.activeUsers.sub')}</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-sm text-[#6E6E73] mb-3">{t('sc.metric.bonuses')}</div>
                <div className="text-4xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>$24,700</div>
                <div className="text-sm text-[#34C759]">{t('sc.metric.bonuses.sub')}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>{t('sc.revenue.title')}</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-[#E5E5EA]">
                  <div>
                    <div className="text-sm text-[#6E6E73] mb-2">{t('sc.revenue.feeShare')}</div>
                    <div className="text-3xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>15%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#6E6E73] mb-2">{t('sc.revenue.thisMonth')}</div>
                    <div className="text-2xl text-[#34C759]" style={{ fontWeight: 600 }}>$8,450</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#6E6E73] mb-4">{t('sc.revenue.oneTime')}</div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6E6E73]">{t('sc.revenue.signup')}</span>
                      <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>$50 × 12 = $600</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6E6E73]">{t('sc.revenue.firstTrade')}</span>
                      <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>$100 × 8 = $800</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6E6E73]">{t('sc.revenue.volume')}</span>
                      <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>$200 × 5 = $1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>{t('sc.users.title')}</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5EA]">
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('sc.col.userId')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.name')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('sc.col.created')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('sc.col.kycStatus')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('sc.col.accountVatp')}</th>
                      <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('sc.col.volume')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-4 px-6 text-sm text-[#6E6E73]">{user.id}</td>
                        <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{user.name}</td>
                        <td className="py-4 px-6 text-sm text-[#6E6E73]">{user.created}</td>
                        <td className="py-4 px-6">
                          {user.kyc === 'Passed' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#34C759] text-[#34C759] text-sm rounded-lg">
                              <CheckCircle2 className="w-4 h-4" />
                              {t('status.passed')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#FF9F0A] text-[#FF9F0A] text-sm rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              {t('status.re_kyc_required')}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-[#1D1D1F]">{user.account === 'Pending' ? t('status.pending') : user.account}</td>
                        <td className="py-4 px-6 text-sm text-[#1D1D1F] text-right" style={{ fontWeight: 600 }}>{user.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-[#FF9F0A] rounded-2xl p-6 flex items-start gap-4">
              <Wallet className="w-6 h-6 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
              <div className="text-base text-[#1D1D1F]">
                <span style={{ fontWeight: 600 }}>{t('sc.custodyNotice.label')}</span>{t('sc.custodyNotice.body')}
              </div>
            </div>
          </div>
          )}

          {activeNav === 'wallet' && (
            <div className="text-center py-12">
              <h2 className="text-2xl text-[#1D1D1F] mb-4" style={{ fontWeight: 600 }}>{t('nav.sc.wallet')}</h2>
              <p className="text-[#6E6E73]">{t('bb.walletPlaceholder.body')}</p>
            </div>
          )}

          {activeNav === 'compliance' && (
            <div className="text-center py-12">
              <h2 className="text-2xl text-[#1D1D1F] mb-4" style={{ fontWeight: 600 }}>{t('nav.sc.compliance')}</h2>
              <p className="text-[#6E6E73]">{t('bb.compliancePlaceholder.body')}</p>
            </div>
          )}

          {!['dashboard', 'wallet', 'compliance'].includes(activeNav) && (
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
