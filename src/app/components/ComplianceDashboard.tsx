import { useState } from 'react';
import { BeanIcon } from './BeanIcon';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage, statusKey } from '../shared/LanguageContext';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Download,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Users,
  Coins,
  Activity,
  ChevronDown,
  ChevronRight,
  Bell,
  Settings,
  Calendar,
} from 'lucide-react';

type ComplianceTab = 'classification' | 'tokens' | 'monitoring' | 'reporting' | 'audit';

const clientData = [
  { id: 'C001', name: 'Alice Chan', type: 'Retail', suitability: 'Conservative', risk: 'Low', status: 'Active', lastReview: '2026-05-15' },
  { id: 'C002', name: 'Bob Wong', type: 'Professional', suitability: 'Aggressive', risk: 'High', status: 'Active', lastReview: '2026-06-01' },
  { id: 'C003', name: 'Charlie Lee', type: 'Retail', suitability: 'Moderate', risk: 'Medium', status: 'Under Review', lastReview: '2026-04-20' },
  { id: 'C004', name: 'Diana Ng', type: 'Professional', suitability: 'Moderate', risk: 'Medium', status: 'Active', lastReview: '2026-05-28' },
  { id: 'C005', name: 'Eric Tam', type: 'Retail', suitability: 'Conservative', risk: 'Low', status: 'Active', lastReview: '2026-06-02' },
];

const tokenData = [
  { symbol: 'BTC', name: 'Bitcoin', status: 'Approved', ddStatus: 'Complete', listedDate: '2025-01-15', reviewer: 'Compliance Team', riskRating: 'Low' },
  { symbol: 'ETH', name: 'Ethereum', status: 'Approved', ddStatus: 'Complete', listedDate: '2025-01-15', reviewer: 'Compliance Team', riskRating: 'Low' },
  { symbol: 'SOL', name: 'Solana', status: 'Approved', ddStatus: 'Complete', listedDate: '2025-03-01', reviewer: 'Compliance Team', riskRating: 'Medium' },
  { symbol: 'USDT', name: 'Tether', status: 'Approved', ddStatus: 'Complete', listedDate: '2025-01-15', reviewer: 'Compliance Team', riskRating: 'Low' },
  { symbol: 'ARB', name: 'Arbitrum', status: 'Pending Review', ddStatus: 'In Progress', listedDate: '-', reviewer: 'Pending', riskRating: 'Medium' },
];

const monitoringAlerts = [
  { id: 'A001', type: 'PEP Match', client: 'Bob Wong', severity: 'High', description: 'Potential PEP match detected - requires manual review', timestamp: '2026-06-05 14:23', status: 'Open' },
  { id: 'A002', type: 'Large Transaction', client: 'Diana Ng', severity: 'Medium', description: 'Transaction exceeds threshold: $52,000', timestamp: '2026-06-05 12:15', status: 'Reviewed' },
  { id: 'A003', type: 'Sanctions', client: 'Unknown', severity: 'Critical', description: 'Wallet address flagged on OFAC sanctions list', timestamp: '2026-06-05 09:34', status: 'Blocked' },
  { id: 'A004', type: 'Velocity', client: 'Charlie Lee', severity: 'Low', description: 'Unusual trading velocity detected', timestamp: '2026-06-04 18:42', status: 'Reviewed' },
];

const auditLog = [
  { id: 'L001', timestamp: '2026-06-05 15:30:12', user: 'admin@beanexchange.hk', action: 'Client Classification Updated', target: 'C002 - Bob Wong', details: 'Changed from Retail to Professional', ip: '192.168.1.100' },
  { id: 'L002', timestamp: '2026-06-05 14:25:33', user: 'compliance@beanexchange.hk', action: 'Token Listing Approved', target: 'SOL - Solana', details: 'Due diligence completed and approved', ip: '192.168.1.101' },
  { id: 'L003', timestamp: '2026-06-05 13:10:45', user: 'system', action: 'PEP Screening Run', target: 'All Active Clients', details: 'Automated daily screening completed', ip: 'Internal' },
  { id: 'L004', timestamp: '2026-06-05 11:42:18', user: 'admin@beanexchange.hk', action: 'Report Generated', target: 'SFC Monthly Report - May 2026', details: 'Exported for regulatory submission', ip: '192.168.1.100' },
  { id: 'L005', timestamp: '2026-06-05 09:15:22', user: 'compliance@beanexchange.hk', action: 'Alert Reviewed', target: 'A002 - Large Transaction', details: 'Marked as legitimate - no action required', ip: '192.168.1.102' },
];

interface ComplianceDashboardProps {
  onSwitchRole: () => void;
  onBack: () => void;
}

export function ComplianceDashboard({ onSwitchRole, onBack }: ComplianceDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ComplianceTab>('classification');
  const [selectedClassification, setSelectedClassification] = useState<'all' | 'retail' | 'professional'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <header className="bg-white border-b border-[#E5E5EA] px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BeanIcon className="w-10 h-10" />
            <div>
              <h1 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('comp.title')}
              </h1>
              <div className="text-sm text-[#6E6E73]">{t('comp.subtitle')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-colors">
              <Download className="w-5 h-5 text-[#6E6E73]" />
              <span className="text-sm text-[#1D1D1F]">{t('comp.exportReports')}</span>
            </button>
            <button className="p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors">
              <Bell className="w-5 h-5 text-[#6E6E73]" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors">
              <Settings className="w-5 h-5 text-[#6E6E73]" />
            </button>
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
            {[
              { id: 'classification' as const, labelKey: 'nav.comp.classification', icon: Users, badge: clientData.length },
              { id: 'tokens' as const, labelKey: 'nav.comp.tokens', icon: Coins, badge: tokenData.length },
              { id: 'monitoring' as const, labelKey: 'nav.comp.monitoring', icon: Activity, badge: monitoringAlerts.filter(a => a.status === 'Open').length },
              { id: 'reporting' as const, labelKey: 'nav.comp.reporting', icon: FileText, badge: null },
              { id: 'audit' as const, labelKey: 'nav.comp.audit', icon: Shield, badge: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all ${
                    isActive
                      ? 'bg-white border border-[#0A84FF] text-[#0A84FF]'
                      : 'text-[#6E6E73] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm flex-1 text-left" style={{ fontWeight: isActive ? 600 : 400 }}>
                    {t(item.labelKey)}
                  </span>
                  {item.badge !== null && (
                    <span className={`px-2 py-0.5 rounded-lg text-xs ${
                      isActive
                        ? 'bg-[#0A84FF] text-white'
                        : 'bg-[#E5E5EA] text-[#6E6E73]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5E5EA]">
            <div className="text-xs text-[#6E6E73] mb-3">{t('comp.quickStats')}</div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#6E6E73]">{t('comp.quickStats.totalClients')}</span>
                <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>247</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6E6E73]">{t('comp.quickStats.proInvestors')}</span>
                <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>42</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6E6E73]">{t('comp.quickStats.activeAlerts')}</span>
                <span className="text-[#FF9F0A]" style={{ fontWeight: 600 }}>2</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6E6E73]">{t('comp.quickStats.listedTokens')}</span>
                <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>24</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'classification' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                    {t('comp.cls.title')}
                  </h2>
                  <p className="text-sm text-[#6E6E73]">
                    {t('comp.cls.subtitle')}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A84FF] text-white rounded-xl hover:opacity-90 transition-opacity">
                  <FileCheck className="w-5 h-5" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>{t('comp.cls.runReassess')}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="text-sm text-[#6E6E73] mb-3">{t('comp.cls.retail')}</div>
                  <div className="text-4xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>205</div>
                  <div className="text-sm text-[#6E6E73]">{t('comp.cls.retailSub')}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="text-sm text-[#6E6E73] mb-3">{t('comp.cls.pro')}</div>
                  <div className="text-4xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>42</div>
                  <div className="text-sm text-[#6E6E73]">{t('comp.cls.proSub')}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="text-sm text-[#6E6E73] mb-3">{t('comp.cls.pending')}</div>
                  <div className="text-4xl text-[#FF9F0A] mb-2" style={{ fontWeight: 600 }}>3</div>
                  <div className="text-sm text-[#6E6E73]">{t('common.requiresAction')}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('comp.cls.records')}</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t('comp.cls.searchPh')}
                        className="pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:bg-white transition-all"
                      />
                    </div>
                    <select
                      value={selectedClassification}
                      onChange={(e) => setSelectedClassification(e.target.value as any)}
                      className="px-4 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                    >
                      <option value="all">{t('comp.cls.allTypes')}</option>
                      <option value="retail">{t('status.retail')}</option>
                      <option value="professional">{t('status.professional')}</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-colors">
                      <Filter className="w-4 h-4 text-[#6E6E73]" />
                      <span className="text-sm text-[#1D1D1F]">{t('common.filter')}</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('bb.col.clientId')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.name')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.cls.col.classification')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.cls.col.suitability')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.cls.col.risk')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.lastReview')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientData.map((client) => (
                        <tr key={client.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{client.id}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{client.name}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white border ${
                              client.type === 'Professional'
                                ? 'border-[#0A84FF] text-[#0A84FF]'
                                : 'border-[#6E6E73] text-[#6E6E73]'
                            }`}>
                              {t(statusKey(client.type))}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{t(statusKey(client.suitability))}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white border ${
                              client.risk === 'High'
                                ? 'border-[#FF3B30] text-[#FF3B30]'
                                : client.risk === 'Medium'
                                ? 'border-[#FF9F0A] text-[#FF9F0A]'
                                : 'border-[#34C759] text-[#34C759]'
                            }`}>
                              {t(statusKey(client.risk))}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white border ${
                              client.status === 'Active'
                                ? 'border-[#34C759] text-[#34C759]'
                                : 'border-[#FF9F0A] text-[#FF9F0A]'
                            }`}>
                              {client.status === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              {t(statusKey(client.status))}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{client.lastReview}</td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors">
                              <Eye className="w-4 h-4 text-[#6E6E73]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                    {t('comp.tok.title')}
                  </h2>
                  <p className="text-sm text-[#6E6E73]">
                    {t('comp.tok.subtitle')}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A84FF] text-white rounded-xl hover:opacity-90 transition-opacity">
                  <Coins className="w-5 h-5" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>{t('comp.tok.requestNew')}</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">{t('comp.tok.approved')}</div>
                  <div className="text-3xl text-[#34C759] mb-1" style={{ fontWeight: 600 }}>24</div>
                  <div className="text-xs text-[#6E6E73]">{t('comp.tok.approved.sub')}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">{t('comp.tok.pending')}</div>
                  <div className="text-3xl text-[#FF9F0A] mb-1" style={{ fontWeight: 600 }}>3</div>
                  <div className="text-xs text-[#6E6E73]">{t('comp.tok.pending.sub')}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">{t('comp.tok.dd')}</div>
                  <div className="text-3xl text-[#0A84FF] mb-1" style={{ fontWeight: 600 }}>5</div>
                  <div className="text-xs text-[#6E6E73]">{t('comp.tok.dd.sub')}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">{t('comp.tok.rejected')}</div>
                  <div className="text-3xl text-[#FF3B30] mb-1" style={{ fontWeight: 600 }}>7</div>
                  <div className="text-xs text-[#6E6E73]">{t('comp.tok.rejected.sub')}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>{t('comp.tok.registry')}</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.symbol')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.name')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('common.status')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.tok.col.ddStatus')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.tok.col.risk')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.tok.col.listed')}</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('comp.tok.col.reviewer')}</th>
                        <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenData.map((token) => (
                        <tr key={token.symbol} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center">
                                <span className="text-xs" style={{ fontWeight: 600 }}>{token.symbol[0]}</span>
                              </div>
                              <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{token.symbol}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{token.name}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white border ${
                              token.status === 'Approved'
                                ? 'border-[#34C759] text-[#34C759]'
                                : 'border-[#FF9F0A] text-[#FF9F0A]'
                            }`}>
                              {token.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              {token.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{token.ddStatus}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white border ${
                              token.riskRating === 'Low'
                                ? 'border-[#34C759] text-[#34C759]'
                                : 'border-[#FF9F0A] text-[#FF9F0A]'
                            }`}>
                              {token.riskRating}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{token.listedDate}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{token.reviewer}</td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors">
                              <FileText className="w-4 h-4 text-[#6E6E73]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                    Transaction Monitoring & Sanctions
                  </h2>
                  <p className="text-sm text-[#6E6E73]">
                    Real-time AML/CTF monitoring, PEP screening, and sanctions checks
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A84FF] text-white rounded-xl hover:opacity-90 transition-opacity">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>Run Manual Scan</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">Active Alerts</div>
                  <div className="text-3xl text-[#FF3B30] mb-1" style={{ fontWeight: 600 }}>2</div>
                  <div className="text-xs text-[#6E6E73]">Requires review</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">PEP Matches</div>
                  <div className="text-3xl text-[#FF9F0A] mb-1" style={{ fontWeight: 600 }}>1</div>
                  <div className="text-xs text-[#6E6E73]">Pending verification</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">Sanctions Hits</div>
                  <div className="text-3xl text-[#FF3B30] mb-1" style={{ fontWeight: 600 }}>1</div>
                  <div className="text-xs text-[#6E6E73]">Blocked</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-[#6E6E73] mb-2">Reviewed (24h)</div>
                  <div className="text-3xl text-[#34C759] mb-1" style={{ fontWeight: 600 }}>18</div>
                  <div className="text-xs text-[#6E6E73]">Cleared</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>Alert Dashboard</h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value as any)}
                      className="px-4 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                    >
                      <option value="all">All Severity</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {monitoringAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-6 rounded-xl border-2 ${
                        alert.severity === 'Critical'
                          ? 'border-[#FF3B30] bg-white'
                          : alert.severity === 'High'
                          ? 'border-[#FF9F0A] bg-white'
                          : 'border-[#E5E5EA] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${
                              alert.severity === 'Critical' ? 'text-[#FF3B30]' :
                              alert.severity === 'High' ? 'text-[#FF9F0A]' :
                              alert.severity === 'Medium' ? 'text-[#FF9F0A]' :
                              'text-[#6E6E73]'
                            }`} />
                            <span className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                              {alert.type}
                            </span>
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${
                              alert.severity === 'Critical'
                                ? 'bg-[#FF3B30] text-white'
                                : alert.severity === 'High'
                                ? 'bg-[#FF9F0A] text-white'
                                : 'bg-[#E5E5EA] text-[#6E6E73]'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${
                              alert.status === 'Open'
                                ? 'bg-white border border-[#FF3B30] text-[#FF3B30]'
                                : alert.status === 'Blocked'
                                ? 'bg-[#FF3B30] text-white'
                                : 'bg-white border border-[#34C759] text-[#34C759]'
                            }`}>
                              {alert.status}
                            </span>
                          </div>
                          <div className="text-sm text-[#1D1D1F] mb-2">{alert.description}</div>
                          <div className="flex items-center gap-4 text-xs text-[#6E6E73]">
                            <span>Alert ID: {alert.id}</span>
                            <span>•</span>
                            <span>Client: {alert.client}</span>
                            <span>•</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-[#0A84FF] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reporting' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                  SFC Regulatory Reporting
                </h2>
                <p className="text-sm text-[#6E6E73]">
                  Generate and export compliance reports for Securities and Futures Commission
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-lg text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>Monthly Reports</h3>
                  <div className="space-y-4">
                    {[
                      { month: 'May 2026', status: 'Submitted', date: '2026-06-02' },
                      { month: 'April 2026', status: 'Submitted', date: '2026-05-03' },
                      { month: 'March 2026', status: 'Submitted', date: '2026-04-01' },
                    ].map((report) => (
                      <div key={report.month} className="flex items-center justify-between p-4 border border-[#E5E5EA] rounded-xl">
                        <div>
                          <div className="text-sm text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>{report.month}</div>
                          <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Submitted: {report.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-white border border-[#34C759] text-[#34C759] text-xs rounded-lg">
                            {report.status}
                          </span>
                          <button className="p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors">
                            <Download className="w-4 h-4 text-[#6E6E73]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-lg text-[#1D1D1F] mb-6" style={{ fontWeight: 600 }}>Generate New Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#6E6E73] mb-2">Report Type</label>
                      <select className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]">
                        <option>Monthly Trading Activity</option>
                        <option>Client Classification Summary</option>
                        <option>Token Admission Report</option>
                        <option>AML/CTF Activity Report</option>
                        <option>Suspicious Transaction Report (STR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6E6E73] mb-2">Reporting Period</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          className="px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                        />
                        <input
                          type="date"
                          className="px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6E6E73] mb-2">Export Format</label>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2.5 bg-white border border-[#0A84FF] text-[#0A84FF] rounded-xl text-sm">
                          PDF
                        </button>
                        <button className="flex-1 py-2.5 bg-[#F5F5F7] text-[#6E6E73] rounded-xl text-sm">
                          Excel
                        </button>
                        <button className="flex-1 py-2.5 bg-[#F5F5F7] text-[#6E6E73] rounded-xl text-sm">
                          CSV
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-[#0A84FF] text-white rounded-xl mt-4" style={{ fontWeight: 600 }}>
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                  Audit Trail & Books-and-Records
                </h2>
                <p className="text-sm text-[#6E6E73]">
                  Complete immutable log of all system activities and compliance actions
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search audit logs..."
                        className="pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:bg-white transition-all w-80"
                      />
                    </div>
                    <select className="px-4 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]">
                      <option>All Actions</option>
                      <option>Client Updates</option>
                      <option>Token Listings</option>
                      <option>Compliance Actions</option>
                      <option>Report Generation</option>
                    </select>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-colors">
                    <Download className="w-4 h-4 text-[#6E6E73]" />
                    <span className="text-sm text-[#1D1D1F]">Export Logs</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">Timestamp</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">User</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">Action</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">Target</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">Details</th>
                        <th className="text-left text-sm text-[#6E6E73] py-4 px-6">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map((log) => (
                        <tr key={log.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{log.timestamp}</td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{log.user}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#0A84FF] text-[#0A84FF] rounded-lg text-sm">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">{log.target}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{log.details}</td>
                          <td className="py-4 px-6 text-sm text-[#6E6E73]">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
