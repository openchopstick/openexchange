import { useState, useMemo, useRef, Fragment } from 'react';
import { TopNav } from './shared/TopNav';
import { SidebarNav } from './shared/SidebarNav';
import { MetricCard } from './shared/MetricCard';
import { useLanguage } from '../shared/LanguageContext';
import {
  clients,
  referredClients,
  clientKYCDetails,
  getOmnibusWalletBalance,
  getStorageBreakdown,
  ASSET_PRICES,
} from '../shared/mockData';
import {
  Building2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Wallet,
  Layers,
  Thermometer,
  Flame,
  Shield,
  LayoutDashboard,
  Landmark,
  FileText,
  Settings,
  Users,
  ArrowRightLeft,
  Search,
  Clock,
  DollarSign,
} from 'lucide-react';

interface BeanExchangeOperationDashboardProps {
  onSwitchRole: () => void;
  onNavigate?: (screen: 'compliance') => void;
}

// ─── DATA MODEL ───

interface VAHolding {
  asset: string;
  amount: number;
  usdValue: number;
}

interface ClientAccount {
  clientId: string;
  institutionId: string;
  institutionName: string;
  displayName: string; // Real name for referral, anonymized ID for omnibus
  hasKYCDetails: boolean;
  kycStatus: 'passed' | 'pending_review' | 're_kyc_required';
  holdingsUSD: number;
  totalVolumeUsd: number;
  orderCount: number;
  lastActivity: string;
}

interface CustodyPerAsset {
  asset: string;
  hot: number;
  cold: number;
}

interface TimeseriesPoint {
  date: string;
  fiatIn: number;
  fiatOut: number;
  vaIn: number;
  vaOut: number;
}

interface Institution {
  id: string;
  name: string;
  model: 'omnibus' | 'referral';
  liquidity: { availableUSD: number; totalUSD: number };
  reserveUSD: number; // VATP capital reserve put in by the institution
  fiatFlows: { in24h: number; out24h: number; in7d: number; out7d: number };
  vaFlows: { in24hUSD: number; out24hUSD: number; in7dUSD: number; out7dUSD: number };
  clients: { count: number };
  vaHoldings: VAHolding[];
  custody: {
    coldUSD: number;
    hotUSD: number;
    addresses: { total: number; cold: number; hot: number; whitelisted: number };
    perAsset: CustodyPerAsset[];
  };
  reconciliation: { status: 'matched' | 'mismatch'; lastCheckedISO: string; diffUSD: number };
  timeseries: TimeseriesPoint[];
}

// ─── MOCK DATA ───

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function genTimeseries(seed: number): TimeseriesPoint[] {
  const rng = mulberry32(seed);
  const points: TimeseriesPoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date('2026-06-07');
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const scale = 0.7 + rng() * 0.6;
    const grow = 1 + (14 - i) * 0.02;
    points.push({
      date,
      fiatIn: Math.round((400 + rng() * 600) * scale * grow),
      fiatOut: Math.round((200 + rng() * 400) * scale * grow),
      vaIn: Math.round((300 + rng() * 500) * scale * grow),
      vaOut: Math.round((150 + rng() * 350) * scale * grow),
    });
  }
  return points;
}

// ── Derive BeanBank data from shared mockData (same source as BeanBank dashboard) ──
const bbWallet = getOmnibusWalletBalance();
const bbStorage = getStorageBreakdown();
const bbTotalUSD = Math.round(bbWallet.reduce((s, w) => s + w.usd, 0));

const institutions: Institution[] = [
  {
    id: 'BB-001',
    name: 'BeanBank',
    model: 'omnibus',
    liquidity: { availableUSD: Math.round(bbTotalUSD * 0.8), totalUSD: bbTotalUSD },
    reserveUSD: 2_000_000, // BeanBank put in $2M capital reserve
    fiatFlows: { in24h: 1_850_000, out24h: 920_000, in7d: 12_400_000, out7d: 6_100_000 },
    vaFlows: { in24hUSD: 1_200_000, out24hUSD: 845_000, in7dUSD: 8_100_000, out7dUSD: 5_600_000 },
    clients: { count: 1247 },
    vaHoldings: bbWallet.map(w => ({ asset: w.symbol, amount: w.amount, usdValue: Math.round(w.usd) })),
    custody: {
      coldUSD: Math.round(bbStorage.cold.totalUsd),
      hotUSD: Math.round(bbStorage.hot.totalUsd),
      addresses: { total: 342, cold: 280, hot: 46, whitelisted: 16 },
      perAsset: bbStorage.cold.assets.map((coldA, i) => ({
        asset: coldA.asset,
        cold: coldA.amount,
        hot: bbStorage.hot.assets[i].amount,
      })),
    },
    reconciliation: { status: 'matched' as const, lastCheckedISO: '2026-06-07T19:00:00+08:00', diffUSD: 0 },
    timeseries: genTimeseries(1001),
  },
  {
    id: 'SC-002',
    name: 'SC Securities',
    model: 'referral' as const,
    liquidity: { availableUSD: 1_200_000, totalUSD: 1_580_000 },
    reserveUSD: 0, // Referral — no capital reserve
    fiatFlows: { in24h: 185_000, out24h: 95_000, in7d: 1_200_000, out7d: 610_000 },
    vaFlows: { in24hUSD: 320_000, out24hUSD: 180_000, in7dUSD: 2_100_000, out7dUSD: 1_400_000 },
    clients: { count: referredClients.length },
    vaHoldings: [
      { asset: 'BTC', amount: 8.25, usdValue: Math.round(8.25 * ASSET_PRICES.BTC) },
      { asset: 'ETH', amount: 185.0, usdValue: Math.round(185.0 * ASSET_PRICES.ETH) },
      { asset: 'USDT', amount: 420_000, usdValue: Math.round(420_000 * ASSET_PRICES.USDT) },
      { asset: 'SOL', amount: 2800, usdValue: Math.round(2800 * ASSET_PRICES.SOL) },
    ],
    custody: {
      coldUSD: Math.round(1_548_000),
      hotUSD: Math.round(32_000),   // ~2% — compliant
      addresses: { total: 48, cold: 38, hot: 6, whitelisted: 4 },
      perAsset: [
        { asset: 'BTC', hot: 0.16, cold: 8.09 },
        { asset: 'ETH', hot: 3.7, cold: 181.3 },
        { asset: 'USDT', hot: 8400, cold: 411_600 },
        { asset: 'SOL', hot: 56, cold: 2744 },
      ],
    },
    reconciliation: { status: 'matched' as const, lastCheckedISO: '2026-06-07T18:45:00+08:00', diffUSD: 0 },
    timeseries: genTimeseries(2002),
  },
  {
    id: 'DS-003',
    name: 'Dragon Securities',
    model: 'omnibus' as const,
    liquidity: { availableUSD: 3_200_000, totalUSD: 8_100_000 },
    reserveUSD: 1_500_000, // Dragon Securities put in $1.5M capital reserve
    fiatFlows: { in24h: 280_000, out24h: 150_000, in7d: 1_800_000, out7d: 950_000 },
    vaFlows: { in24hUSD: 190_000, out24hUSD: 120_000, in7dUSD: 1_200_000, out7dUSD: 780_000 },
    clients: { count: 312 },
    vaHoldings: [
      { asset: 'BTC', amount: 45.2, usdValue: Math.round(45.2 * ASSET_PRICES.BTC) },
      { asset: 'ETH', amount: 680.0, usdValue: Math.round(680.0 * ASSET_PRICES.ETH) },
      { asset: 'USDT', amount: 3_400_000, usdValue: Math.round(3_400_000 * ASSET_PRICES.USDT) },
      { asset: 'SOL', amount: 2840, usdValue: Math.round(2840 * ASSET_PRICES.SOL) },
    ],
    custody: {
      coldUSD: 7_030_000,
      hotUSD: 1_690_000,   // intentionally ~19% to demo SFC breach
      addresses: { total: 98, cold: 72, hot: 20, whitelisted: 6 },
      perAsset: [
        { asset: 'BTC', hot: 3.5, cold: 41.7 },
        { asset: 'ETH', hot: 136.0, cold: 544.0 },
        { asset: 'USDT', hot: 800_000, cold: 2_600_000 },
        { asset: 'SOL', hot: 568, cold: 2272 },
      ],
    },
    reconciliation: { status: 'mismatch' as const, lastCheckedISO: '2026-06-07T18:30:00+08:00', diffUSD: 42_500 },
    timeseries: genTimeseries(3003),
  },
];

// ── VATP-level aggregate: ALL institutions combined (god view) ──
const vatpTotalUSD = institutions.reduce((s, i) => s + i.custody.coldUSD + i.custody.hotUSD, 0);
const vatpColdUSD = institutions.reduce((s, i) => s + i.custody.coldUSD, 0);
const vatpHotUSD = institutions.reduce((s, i) => s + i.custody.hotUSD, 0);
const vatpColdPct = vatpTotalUSD > 0 ? (vatpColdUSD / vatpTotalUSD) * 100 : 0;
const vatpHotPct = vatpTotalUSD > 0 ? (vatpHotUSD / vatpTotalUSD) * 100 : 0;

// Merge per-asset custody across all institutions
const vatpCustodyPerAsset = new Map<string, { asset: string; cold: number; hot: number }>();
institutions.forEach(inst => {
  inst.custody.perAsset.forEach(ca => {
    const existing = vatpCustodyPerAsset.get(ca.asset);
    if (existing) { existing.cold += ca.cold; existing.hot += ca.hot; }
    else { vatpCustodyPerAsset.set(ca.asset, { asset: ca.asset, cold: ca.cold, hot: ca.hot }); }
  });
});
const vatpCustodyPerAssetArr = Array.from(vatpCustodyPerAsset.values());

// ─── SCOPED DATA AGGREGATION ───

interface ScopedData {
  scopeLabel: string;
  institutionCount: number;
  isAggregate: boolean;
  liquidity: { availableUSD: number; totalUSD: number };
  fiatFlows: { in24h: number; out24h: number; in7d: number; out7d: number };
  vaFlows: { in24hUSD: number; out24hUSD: number; in7dUSD: number; out7dUSD: number };
  clients: { count: number };
  vaHoldings: VAHolding[];
  custody: {
    coldUSD: number;
    hotUSD: number;
    addresses: { total: number; cold: number; hot: number; whitelisted: number };
    perAsset: CustodyPerAsset[];
  };
  reconciliation: { allMatched: boolean; mismatchCount: number; lastCheckedISO: string; totalDiffUSD: number };
  timeseries: TimeseriesPoint[];
}

function getScopedData(scope: string): ScopedData {
  if (scope === 'aggregate') {
    // Aggregate all institutions
    const all = institutions;
    const mergedHoldings = new Map<string, VAHolding>();
    all.forEach(inst => {
      inst.vaHoldings.forEach(h => {
        const existing = mergedHoldings.get(h.asset);
        if (existing) {
          existing.amount += h.amount;
          existing.usdValue += h.usdValue;
        } else {
          mergedHoldings.set(h.asset, { ...h });
        }
      });
    });

    const mergedCustodyPerAsset = new Map<string, CustodyPerAsset>();
    all.forEach(inst => {
      inst.custody.perAsset.forEach(ca => {
        const existing = mergedCustodyPerAsset.get(ca.asset);
        if (existing) {
          existing.hot += ca.hot;
          existing.cold += ca.cold;
        } else {
          mergedCustodyPerAsset.set(ca.asset, { ...ca });
        }
      });
    });

    // Merge timeseries by date
    const mergedTs = new Map<string, TimeseriesPoint>();
    all.forEach(inst => {
      inst.timeseries.forEach(pt => {
        const existing = mergedTs.get(pt.date);
        if (existing) {
          existing.fiatIn += pt.fiatIn;
          existing.fiatOut += pt.fiatOut;
          existing.vaIn += pt.vaIn;
          existing.vaOut += pt.vaOut;
        } else {
          mergedTs.set(pt.date, { ...pt });
        }
      });
    });
    const timeseries = Array.from(mergedTs.values()).sort((a, b) => a.date.localeCompare(b.date));

    const mismatchInstitutions = all.filter(i => i.reconciliation.status === 'mismatch');
    const latestCheck = all.reduce((latest, i) =>
      i.reconciliation.lastCheckedISO > latest ? i.reconciliation.lastCheckedISO : latest, '');

    return {
      scopeLabel: 'All Omnibus Institutions',
      institutionCount: all.length,
      isAggregate: true,
      liquidity: {
        availableUSD: all.reduce((s, i) => s + i.liquidity.availableUSD, 0),
        totalUSD: all.reduce((s, i) => s + i.liquidity.totalUSD, 0),
      },
      fiatFlows: {
        in24h: all.reduce((s, i) => s + i.fiatFlows.in24h, 0),
        out24h: all.reduce((s, i) => s + i.fiatFlows.out24h, 0),
        in7d: all.reduce((s, i) => s + i.fiatFlows.in7d, 0),
        out7d: all.reduce((s, i) => s + i.fiatFlows.out7d, 0),
      },
      vaFlows: {
        in24hUSD: all.reduce((s, i) => s + i.vaFlows.in24hUSD, 0),
        out24hUSD: all.reduce((s, i) => s + i.vaFlows.out24hUSD, 0),
        in7dUSD: all.reduce((s, i) => s + i.vaFlows.in7dUSD, 0),
        out7dUSD: all.reduce((s, i) => s + i.vaFlows.out7dUSD, 0),
      },
      clients: { count: all.reduce((s, i) => s + i.clients.count, 0) },
      vaHoldings: Array.from(mergedHoldings.values()),
      custody: {
        coldUSD: all.reduce((s, i) => s + i.custody.coldUSD, 0),
        hotUSD: all.reduce((s, i) => s + i.custody.hotUSD, 0),
        addresses: {
          total: all.reduce((s, i) => s + i.custody.addresses.total, 0),
          cold: all.reduce((s, i) => s + i.custody.addresses.cold, 0),
          hot: all.reduce((s, i) => s + i.custody.addresses.hot, 0),
          whitelisted: all.reduce((s, i) => s + i.custody.addresses.whitelisted, 0),
        },
        perAsset: Array.from(mergedCustodyPerAsset.values()),
      },
      reconciliation: {
        allMatched: mismatchInstitutions.length === 0,
        mismatchCount: mismatchInstitutions.length,
        lastCheckedISO: latestCheck,
        totalDiffUSD: all.reduce((s, i) => s + i.reconciliation.diffUSD, 0),
      },
      timeseries,
    };
  }

  // Single institution
  const inst = institutions.find(i => i.id === scope)!;
  return {
    scopeLabel: inst.name,
    institutionCount: 1,
    isAggregate: false,
    liquidity: inst.liquidity,
    fiatFlows: inst.fiatFlows,
    vaFlows: inst.vaFlows,
    clients: inst.clients,
    vaHoldings: inst.vaHoldings,
    custody: inst.custody,
    reconciliation: {
      allMatched: inst.reconciliation.status === 'matched',
      mismatchCount: inst.reconciliation.status === 'mismatch' ? 1 : 0,
      lastCheckedISO: inst.reconciliation.lastCheckedISO,
      totalDiffUSD: inst.reconciliation.diffUSD,
    },
    timeseries: inst.timeseries,
  };
}

// ─── HELPERS ───

function fmtUSD(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

// ─── COMPONENT ───

type TimeWindow = '24h' | '7d';
type SortKey = 'name' | 'model' | 'vaHoldings' | 'clients' | 'fiatNet' | 'vaNet';
type SortDir = 'asc' | 'desc';

const navItems = [
  { id: 'overview', labelKey: 'ops.nav.overview', icon: LayoutDashboard },
  { id: 'wallet', labelKey: 'ops.nav.wallet', icon: Wallet },
  { id: 'omnibus', labelKey: 'ops.nav.omnibus', icon: Landmark },
  { id: 'clients', labelKey: 'ops.nav.clients', icon: Users },
  { id: 'clientDetails', labelKey: 'ops.nav.clientDetails', icon: Users },
  { id: 'bank', labelKey: 'ops.nav.bank', icon: DollarSign },
  { id: 'reports', labelKey: 'ops.nav.reports', icon: FileText },
  { id: 'settings', labelKey: 'ops.nav.settings', icon: Settings },
];

export function BeanExchangeOperationDashboard({ onSwitchRole, onNavigate }: BeanExchangeOperationDashboardProps) {
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState('overview');
  const [selectedScope, setSelectedScope] = useState<string>('aggregate');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('24h');
  const [sortBy, setSortBy] = useState<SortKey>('vaHoldings');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    scrollToTop();
  };

  // Computed scoped data
  const scoped = useMemo(() => getScopedData(selectedScope), [selectedScope]);

  // Time-window dependent flows
  const fiatIn = timeWindow === '24h' ? scoped.fiatFlows.in24h : scoped.fiatFlows.in7d;
  const fiatOut = timeWindow === '24h' ? scoped.fiatFlows.out24h : scoped.fiatFlows.out7d;
  const vaIn = timeWindow === '24h' ? scoped.vaFlows.in24hUSD : scoped.vaFlows.in7dUSD;
  const vaOut = timeWindow === '24h' ? scoped.vaFlows.out24hUSD : scoped.vaFlows.out7dUSD;
  const netFlow = (fiatIn + vaIn) - (fiatOut + vaOut);

  // VA holdings total
  const totalVA_USD = scoped.vaHoldings.reduce((s, h) => s + h.usdValue, 0);

  // Custody percentages
  const totalCustodyUSD = scoped.custody.coldUSD + scoped.custody.hotUSD;
  const coldPct = totalCustodyUSD > 0 ? (scoped.custody.coldUSD / totalCustodyUSD) * 100 : 0;
  const hotPct = totalCustodyUSD > 0 ? (scoped.custody.hotUSD / totalCustodyUSD) * 100 : 0;

  // SFC compliance check: hot% must be ≤ 2%
  const isSFCBreach = hotPct > 2;

  // Average holding per client
  const avgPerClient = scoped.clients.count > 0 ? totalVA_USD / scoped.clients.count : 0;

  // Sorted institution table
  const sortedInstitutions = useMemo(() => {
    const sorted = [...institutions].sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortBy) {
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'model': aVal = a.model; bVal = b.model; break;
        case 'vaHoldings': aVal = a.vaHoldings.reduce((s, h) => s + h.usdValue, 0); bVal = b.vaHoldings.reduce((s, h) => s + h.usdValue, 0); break;
        case 'clients': aVal = a.clients.count; bVal = b.clients.count; break;
        case 'fiatNet': aVal = a.fiatFlows.in24h - a.fiatFlows.out24h; bVal = b.fiatFlows.in24h - b.fiatFlows.out24h; break;
        case 'vaNet': aVal = a.vaFlows.in24hUSD - a.vaFlows.out24hUSD; bVal = b.vaFlows.in24hUSD - b.vaFlows.out24hUSD; break;
        default: aVal = 0; bVal = 0;
      }
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [sortBy, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  // Aggregate totals for institution table footer
  const aggVA = institutions.reduce((s, i) => s + i.vaHoldings.reduce((s2, h) => s2 + h.usdValue, 0), 0);
  const aggClients = institutions.reduce((s, i) => s + i.clients.count, 0);
  const aggFiatNet = institutions.reduce((s, i) => s + (i.fiatFlows.in24h - i.fiatFlows.out24h), 0);
  const aggVANet = institutions.reduce((s, i) => s + (i.vaFlows.in24hUSD - i.vaFlows.out24hUSD), 0);

  // ── Client Accounts Data ──
  // Generate hundreds of omnibus clients aligned with institution counts
  // BeanBank: 1,247 clients, Dragon Securities: 312 clients, SC Securities: 12 (from referredClients)
  const clientAccounts: ClientAccount[] = useMemo(() => {
    const instMap = new Map(institutions.map(i => [i.id, i.name]));
    const result: ClientAccount[] = [];
    const kycStatuses: ('passed' | 'pending_review' | 're_kyc_required')[] = ['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'pending_review', 're_kyc_required'];

    // BeanBank omnibus clients (1,247)
    const bbRng = mulberry32(42100);
    for (let i = 1; i <= 1247; i++) {
      const id = `BB-${String(i).padStart(4, '0')}`;
      const rng = bbRng();
      const holdingsUSD = Math.round((rng < 0.05 ? 500000 : rng < 0.2 ? 100000 : rng < 0.5 ? 30000 : 5000) * (0.5 + bbRng() * 1.5));
      const orderCount = Math.round(rng < 0.05 ? 200 : rng < 0.2 ? 80 : rng < 0.5 ? 25 : 5 + bbRng() * 20);
      const totalVolumeUsd = Math.round(holdingsUSD * (2 + bbRng() * 8));
      const daysAgo = Math.round(bbRng() * 365);
      const d = new Date('2026-06-07'); d.setDate(d.getDate() - daysAgo);
      const lastActivity = d.toISOString().slice(0, 10);
      const kycIdx = Math.floor(bbRng() * kycStatuses.length);
      result.push({
        clientId: id,
        institutionId: 'BB-001',
        institutionName: instMap.get('BB-001') ?? 'BeanBank',
        displayName: id,
        hasKYCDetails: false,
        kycStatus: kycStatuses[kycIdx],
        holdingsUSD,
        totalVolumeUsd,
        orderCount,
        lastActivity,
      });
    }

    // Dragon Securities omnibus clients (312)
    const dsRng = mulberry32(42300);
    for (let i = 1; i <= 312; i++) {
      const id = `DS-${String(i).padStart(4, '0')}`;
      const rng = dsRng();
      const holdingsUSD = Math.round((rng < 0.05 ? 800000 : rng < 0.2 ? 200000 : rng < 0.5 ? 50000 : 8000) * (0.5 + dsRng() * 1.5));
      const orderCount = Math.round(rng < 0.05 ? 150 : rng < 0.2 ? 60 : rng < 0.5 ? 20 : 3 + dsRng() * 15);
      const totalVolumeUsd = Math.round(holdingsUSD * (2 + dsRng() * 6));
      const daysAgo = Math.round(dsRng() * 300);
      const d = new Date('2026-06-07'); d.setDate(d.getDate() - daysAgo);
      const lastActivity = d.toISOString().slice(0, 10);
      const kycIdx = Math.floor(dsRng() * kycStatuses.length);
      result.push({
        clientId: id,
        institutionId: 'DS-003',
        institutionName: instMap.get('DS-003') ?? 'Dragon Securities',
        displayName: id,
        hasKYCDetails: false,
        kycStatus: kycStatuses[kycIdx],
        holdingsUSD,
        totalVolumeUsd,
        orderCount,
        lastActivity,
      });
    }

    // SC Securities referral clients (12 — from referredClients mock data)
    referredClients.forEach(rc => {
      const volUsd = rc.totalVolumeUsd;
      const holdingsUSD = Math.round(volUsd * (0.3 + Math.random() * 0.4));
      const mappedKyc: ClientAccount['kycStatus'] = rc.kycStatus === 'pending' ? 'pending_review' : rc.kycStatus === 're_kyc_required' ? 're_kyc_required' : 'passed';
      result.push({
        clientId: rc.clientId,
        institutionId: 'SC-002',
        institutionName: instMap.get('SC-002') ?? 'SC Securities',
        displayName: rc.clientId,
        hasKYCDetails: true,
        kycStatus: mappedKyc,
        holdingsUSD,
        totalVolumeUsd: volUsd,
        orderCount: rc.orderCount,
        lastActivity: rc.lastActivity,
      });
    });

    return result;
  }, []);

  const [clientFilterInst, setClientFilterInst] = useState<string>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [clientPage, setClientPage] = useState(0);
  const CLIENT_PAGE_SIZE = 50;

  const filteredClients = useMemo(() => {
    let filtered = clientAccounts;
    if (clientFilterInst !== 'all') {
      filtered = filtered.filter(c => c.institutionId === clientFilterInst);
    }
    if (clientSearch.trim()) {
      const q = clientSearch.trim().toLowerCase();
      filtered = filtered.filter(c => c.clientId.toLowerCase().includes(q) || c.institutionName.toLowerCase().includes(q));
    }
    return filtered;
  }, [clientAccounts, clientFilterInst, clientSearch]);

  const clientAgg = useMemo(() => {
    const totalHoldings = filteredClients.reduce((s, c) => s + c.holdingsUSD, 0);
    const totalVolume = filteredClients.reduce((s, c) => s + c.totalVolumeUsd, 0);
    const totalOrders = filteredClients.reduce((s, c) => s + c.orderCount, 0);
    const passed = filteredClients.filter(c => c.kycStatus === 'passed').length;
    const pending = filteredClients.filter(c => c.kycStatus === 'pending_review').length;
    const reKyc = filteredClients.filter(c => c.kycStatus === 're_kyc_required').length;
    const referralCount = filteredClients.filter(c => c.institutionId === 'SC-002').length;
    const omnibusCount = filteredClients.filter(c => c.institutionId !== 'SC-002').length;
    return { totalHoldings, totalVolume, totalOrders, passed, pending, reKyc, referralCount, omnibusCount };
  }, [filteredClients]);

  type ClientSortKey = 'clientId' | 'institutionName' | 'kycStatus' | 'holdingsUSD' | 'totalVolumeUsd' | 'orderCount' | 'lastActivity';
  const [clientSortBy, setClientSortBy] = useState<ClientSortKey>('holdingsUSD');
  const [clientSortDir, setClientSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (clientSortBy) {
        case 'clientId': aVal = a.clientId; bVal = b.clientId; break;
        case 'institutionName': aVal = a.institutionName; bVal = b.institutionName; break;
        case 'kycStatus': aVal = a.kycStatus; bVal = b.kycStatus; break;
        case 'holdingsUSD': aVal = a.holdingsUSD; bVal = b.holdingsUSD; break;
        case 'totalVolumeUsd': aVal = a.totalVolumeUsd; bVal = b.totalVolumeUsd; break;
        case 'orderCount': aVal = a.orderCount; bVal = b.orderCount; break;
        case 'lastActivity': aVal = a.lastActivity; bVal = b.lastActivity; break;
        default: aVal = 0; bVal = 0;
      }
      if (typeof aVal === 'string') {
        return clientSortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return clientSortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredClients, clientSortBy, clientSortDir]);

  const pagedClients = useMemo(() => {
    const start = clientPage * CLIENT_PAGE_SIZE;
    return sortedClients.slice(start, start + CLIENT_PAGE_SIZE);
  }, [sortedClients, clientPage]);

  const totalPages = Math.ceil(sortedClients.length / CLIENT_PAGE_SIZE);

  const handleClientSort = (key: ClientSortKey) => {
    if (clientSortBy === key) {
      setClientSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setClientSortBy(key);
      setClientSortDir('desc');
    }
  };

  const ClientSortIcon = ({ column }: { column: ClientSortKey }) => {
    if (clientSortBy !== column) return <span className="text-[#D1D1D6] ml-1">⇅</span>;
    return clientSortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 inline text-[#0A84FF]" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 inline text-[#0A84FF]" />;
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortBy !== column) return <span className="text-[#D1D1D6] ml-1">⇅</span>;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 inline text-[#0A84FF]" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 inline text-[#0A84FF]" />;
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F5F7]">
      <TopNav
        title={t('ops.title')}
        subtitle={t('ops.subtitle')}
        badge={{ text: t('ops.badge'), color: 'blue' }}
        onSwitchRole={onSwitchRole}
        rightContent={
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F7] rounded-xl">
            <Eye className="w-5 h-5 text-[#6E6E73]" />
            <div className="text-sm text-[#1D1D1F]">{t('ops.rightLabel')}</div>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white border-r border-[#E5E5EA] overflow-y-auto">
          <SidebarNav items={navItems} activeId={activeNav} onItemClick={handleNavClick} />
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* ── Overview ── */}
        {activeNav === 'overview' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
              {t('ops.nav.overview')}
            </h2>
          </div>

          {/* Account Type Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-[#0A84FF]" />
              <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.overview.accountTypes')}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label={t('ops.overview.omnibusAccounts')} value={String(institutions.filter(i => i.model === 'omnibus').length)} subtitle={t('ops.overview.omnibusAccounts.sub')} color="blue" />
              <MetricCard label={t('ops.overview.referralAccounts')} value={String(institutions.filter(i => i.model === 'referral').length)} subtitle={t('ops.overview.referralAccounts.sub')} color="green" />
            </div>

            {/* Client Breakdown Pie Chart */}
            <div className="mt-6 grid grid-cols-2 gap-6 items-center">
              {/* SVG Pie Chart */}
              <div className="flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  {(() => {
                    const total = institutions.reduce((s, i) => s + i.clients.count, 0);
                    const slices = [
                      { label: 'BeanBank', count: 1247, color: '#0A84FF' },
                      { label: 'Dragon Securities', count: 312, color: '#5AC8FA' },
                      { label: 'SC Securities', count: 12, color: '#34C759' },
                    ];
                    let cumulativeAngle = -90; // start at top
                    return slices.map(slice => {
                      const pct = slice.count / total;
                      const angle = pct * 360;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + angle;
                      cumulativeAngle = endAngle;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      const d = `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`;
                      const midRad = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                      const labelR = 52;
                      const lx = 100 + labelR * Math.cos(midRad);
                      const ly = 100 + labelR * Math.sin(midRad);
                      return (
                        <g key={slice.label}>
                          <path d={d} fill={slice.color} stroke="white" strokeWidth="2" />
                          {pct > 0.05 && (
                            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="600">
                              {(pct * 100).toFixed(0)}%
                            </text>
                          )}
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
              {/* Legend */}
              <div className="space-y-3">
                <div className="text-sm text-[#6E6E73] mb-2" style={{ fontWeight: 600 }}>
                  {t('ops.overview.totalClients')}: {institutions.reduce((s, i) => s + i.clients.count, 0).toLocaleString()}
                </div>
                {institutions.map(inst => {
                  const total = institutions.reduce((s, i) => s + i.clients.count, 0);
                  const pct = ((inst.clients.count / total) * 100).toFixed(1);
                  const color = inst.id === 'BB-001' ? '#0A84FF' : inst.id === 'DS-003' ? '#5AC8FA' : '#34C759';
                  const modelLabel = inst.model === 'omnibus' ? t('ops.institutions.omnibus') : t('ops.institutions.referral');
                  return (
                    <div key={inst.id} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{inst.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${inst.model === 'omnibus' ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'bg-[#F0FFF4] text-[#34C759]'}`} style={{ fontWeight: 600 }}>{modelLabel}</span>
                        </div>
                        <div className="text-xs text-[#6E6E73]">
                          {inst.clients.count.toLocaleString()} clients · {pct}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Referral Payout Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-[#34C759]" />
              <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.overview.referralPayout')}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <MetricCard label={t('ops.overview.totalPayout')} value="$18,450" subtitle={t('ops.time.last24h')} color="green" />
              <MetricCard label={t('ops.overview.tradingFeeShare')} value="$12,800" subtitle="69.4% of total" color="blue" />
              <MetricCard label={t('ops.overview.referralBonuses')} value="$5,650" subtitle="30.6% of total" color="amber" />
            </div>

            {/* Bar chart: Payout per referral institution */}
            <div className="text-sm text-[#6E6E73] mb-4" style={{ fontWeight: 600 }}>
              {t('ops.overview.payoutByInstitution')}
            </div>
            <div className="space-y-4">
              {[
                { name: 'SC Securities', model: 'referral' as const, payout: 18450, tradingFees: 12800, bonuses: 5650, color: '#34C759' },
                { name: 'Future Partner A', model: 'referral' as const, payout: 0, tradingFees: 0, bonuses: 0, color: '#5AC8FA' },
              ].map(inst => {
                const maxPayout = 20000;
                const payoutPct = Math.max((inst.payout / maxPayout) * 100, 2); // min 2% for label visibility
                const tradingPct = (inst.tradingFees / maxPayout) * 100;
                const bonusPct = (inst.bonuses / maxPayout) * 100;
                return (
                  <div key={inst.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" style={{ color: inst.color }} />
                        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{inst.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-xs bg-[#F0FFF4] text-[#34C759]" style={{ fontWeight: 600 }}>
                          {t('ops.institutions.referral')}
                        </span>
                      </div>
                      <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        {inst.payout > 0 ? `$${inst.payout.toLocaleString()}` : '—'}
                      </span>
                    </div>
                    {inst.payout > 0 ? (
                      <div className="w-full h-8 bg-[#F5F5F7] rounded-lg overflow-hidden flex">
                        <div className="h-full bg-[#0A84FF] flex items-center justify-center" style={{ width: `${tradingPct}%` }}>
                          {tradingPct > 12 && <span className="text-[10px] text-white" style={{ fontWeight: 600 }}>Trading ${inst.tradingFees.toLocaleString()}</span>}
                        </div>
                        <div className="h-full bg-[#FF9F0A] flex items-center justify-center" style={{ width: `${bonusPct}%` }}>
                          {bonusPct > 12 && <span className="text-[10px] text-white" style={{ fontWeight: 600 }}>Bonus ${inst.bonuses.toLocaleString()}</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-8 bg-[#F5F5F7] rounded-lg flex items-center px-3">
                        <span className="text-xs text-[#D1D1D6]">No payout yet</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 text-xs text-[#6E6E73]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#0A84FF] rounded-sm inline-block" />{t('ops.overview.tradingFeeShare')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#FF9F0A] rounded-sm inline-block" />{t('ops.overview.referralBonuses')}</span>
            </div>
          </div>

          {/* Fiat In/Out & VA In/Out */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#0A84FF]" />
                <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                  {t('ops.overview.flows')}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] p-1">
                <button
                  onClick={() => setTimeWindow('24h')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeWindow === '24h' ? 'bg-[#0A84FF] text-white' : 'text-[#6E6E73] hover:bg-[#F5F5F7]'}`}
                  style={{ fontWeight: 600 }}
                >
                  {t('ops.time.24h')}
                </button>
                <button
                  onClick={() => setTimeWindow('7d')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeWindow === '7d' ? 'bg-[#0A84FF] text-white' : 'text-[#6E6E73] hover:bg-[#F5F5F7]'}`}
                  style={{ fontWeight: 600 }}
                >
                  {t('ops.time.7d')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <MetricCard label={t('ops.metric.fiatIn')} value={fmtUSD(fiatIn)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="green" />
              <MetricCard label={t('ops.metric.fiatOut')} value={fmtUSD(fiatOut)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="amber" />
              <MetricCard label={t('ops.metric.vaIn')} value={fmtUSD(vaIn)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="green" />
              <MetricCard label={t('ops.metric.vaOut')} value={fmtUSD(vaOut)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="amber" />
            </div>

            {/* Net Flow */}
            <div className={`rounded-xl p-6 flex items-center justify-between ${netFlow >= 0 ? 'bg-[#F0FFF4] border border-[#34C759]/30' : 'bg-[#FFF5F5] border border-[#FF3B30]/30'}`}>
              <div>
                <div className="text-sm text-[#6E6E73] mb-1">
                  {t('ops.netFlow.label')} ({timeWindow}) = {t('ops.netFlow.formula')}
                </div>
                <div className={`text-3xl ${netFlow >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                  {netFlow >= 0 ? '+' : ''}{fmtUSD(netFlow)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="text-[#6E6E73]">{t('ops.metric.fiatIn').replace(' (USD)', '')}: <span className="text-[#34C759]">+{fmtUSD(fiatIn)}</span> / <span className="text-[#FF9F0A]">−{fmtUSD(fiatOut)}</span></div>
                <div className="text-[#6E6E73]">VA: <span className="text-[#34C759]">+{fmtUSD(vaIn)}</span> / <span className="text-[#FF9F0A]">−{fmtUSD(vaOut)}</span></div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── Wallet: Omnibus Temporary Account, KYT, Sweeping ── */}
        {activeNav === 'wallet' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
              {t('ops.wallet.title')}
            </h2>
          </div>

          {/* VATP Assets Summary (all institutions combined — god view) */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0A84FF]" />
                <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                  {t('ops.wallet.vatpAssets')}
                </h3>
              </div>
              <span className="px-2 py-1 rounded-lg text-xs bg-[#F0F7FF] text-[#0A84FF]" style={{ fontWeight: 600 }}>
                {institutions.length} institutions
              </span>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MetricCard label={t('ops.wallet.totalBalance')} value={fmtUSD(vatpTotalUSD)} subtitle={t('ops.metric.totalVA.sub')} color="blue" />
              <MetricCard label={t('ops.wallet.coldStorage')} value={fmtUSD(vatpColdUSD)} subtitle={`${fmtPct(vatpColdPct)} cold`} color="green" />
              <MetricCard label={t('ops.wallet.hotWallet')} value={fmtUSD(vatpHotUSD)} subtitle={`${fmtPct(vatpHotPct)} hot`} color="amber" />
              <MetricCard label={t('ops.wallet.pendingSweep')} value="3" subtitle={t('ops.wallet.pendingSweep.sub')} color="amber" />
            </div>

            {/* Cold/Hot split visual */}
            <div className="rounded-xl p-4 bg-[#F5F5F7] mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#6E6E73]" style={{ fontWeight: 600 }}>{t('ops.wallet.storageSplit')}</span>
                <span className="text-xs text-[#6E6E73]">SFC requirement: ≤2% hot</span>
              </div>
              <div className="w-full h-4 bg-[#E5E5EA] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#0A84FF] rounded-l-full" style={{ width: `${vatpColdPct}%` }} />
                <div className={`h-full rounded-r-full ${vatpHotPct > 2 ? 'bg-[#FF3B30]' : 'bg-[#FF9F0A]'}`} style={{ width: `${vatpHotPct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#6E6E73]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#0A84FF] rounded-sm inline-block" /> Cold {fmtPct(vatpColdPct)}</span>
                <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-sm inline-block ${vatpHotPct > 2 ? 'bg-[#FF3B30]' : 'bg-[#FF9F0A]'}`} /> Hot {fmtPct(vatpHotPct)} {vatpHotPct > 2 && '⚠'}</span>
              </div>
            </div>

            {/* Per-asset cold/hot balance table (all institutions aggregated) */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.asset')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.custody.coldAmount')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.custody.hotAmount')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.custody.hotPct')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.usdValue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {vatpCustodyPerAssetArr.map(ca => {
                    const totalAmt = ca.hot + ca.cold;
                    const hotRatio = totalAmt > 0 ? (ca.hot / totalAmt) * 100 : 0;
                    const isBreach = hotRatio > 2;
                    const price = (ASSET_PRICES as Record<string, number>)[ca.asset];
                    const usdVal = ca.asset === 'USDT' || ca.asset === 'USDC'
                      ? ca.cold + ca.hot
                      : (ca.cold + ca.hot) * (price ?? 0);
                    return (
                      <tr key={ca.asset} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{ca.asset}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#0A84FF]">
                          {ca.asset === 'USDT' || ca.asset === 'USDC' ? `$${Math.round(ca.cold).toLocaleString()}` : ca.cold.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        </td>
                        <td className={`py-3 px-4 text-right text-sm ${isBreach ? 'text-[#FF3B30]' : 'text-[#FF9F0A]'}`}>
                          {ca.asset === 'USDT' || ca.asset === 'USDC' ? `$${Math.round(ca.hot).toLocaleString()}` : ca.hot.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        </td>
                        <td className={`py-3 px-4 text-right text-sm ${isBreach ? 'text-[#FF3B30]' : 'text-[#6E6E73]'}`} style={{ fontWeight: isBreach ? 600 : 400 }}>
                          {fmtPct(hotRatio)} {isBreach && '⚠'}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(usdVal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* KYT (Know Your Transaction) Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.wallet.kyt')}
              </h3>
            </div>

            {/* KYT Summary metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MetricCard label={t('ops.wallet.kyt.screened')} value="2,847" subtitle={t('ops.time.last24h')} color="blue" />
              <MetricCard label={t('ops.wallet.kyt.flagged')} value="12" subtitle={t('ops.time.last24h')} color="amber" />
              <MetricCard label={t('ops.wallet.kyt.blocked')} value="3" subtitle={t('ops.time.last24h')} color="red" />
              <MetricCard label={t('ops.wallet.kyt.riskScore')} value="Low" subtitle={t('ops.wallet.kyt.riskScore.sub')} color="green" />
            </div>

            {/* Recent KYT alerts */}
            <div className="text-sm text-[#6E6E73] mb-3" style={{ fontWeight: 600 }}>{t('ops.wallet.kyt.recentAlerts')}</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">TX ID</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.source')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.rule')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.amount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.riskLevel')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.action')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { txId: 'KYT-0301', source: 'bc1q...x7k2m', rule: 'Sanctions Match', amount: '2.5 BTC', riskLevel: 'critical', action: 'blocked', time: '5 min ago' },
                    { txId: 'KYT-0302', source: '0x3f...a9c1', rule: 'PEP Association', amount: '45.0 ETH', riskLevel: 'high', action: 'flagged', time: '12 min ago' },
                    { txId: 'KYT-0303', source: 'TJ9q...3vN7', rule: 'Mixer Exposure', amount: '$50K USDT', riskLevel: 'medium', action: 'flagged', time: '18 min ago' },
                    { txId: 'KYT-0304', source: '5Fu...kL9p', rule: 'High-Risk Jurisdiction', amount: '320 SOL', riskLevel: 'medium', action: 'review', time: '25 min ago' },
                    { txId: 'KYT-0305', source: 'bc1q...p4w8', rule: 'Rapid Movement', amount: '1.2 BTC', riskLevel: 'low', action: 'cleared', time: '42 min ago' },
                  ].map(alert => {
                    const riskColors: Record<string, string> = { critical: 'bg-[#FFF5F5] text-[#FF3B30]', high: 'bg-[#FFF5F5] text-[#FF6B6B]', medium: 'bg-[#FFF8F0] text-[#FF9F0A]', low: 'bg-[#F0FFF4] text-[#34C759]' };
                    const actionColors: Record<string, string> = { blocked: 'bg-[#FFF5F5] text-[#FF3B30]', flagged: 'bg-[#FFF8F0] text-[#FF9F0A]', review: 'bg-[#F0F7FF] text-[#0A84FF]', cleared: 'bg-[#F0FFF4] text-[#34C759]' };
                    return (
                      <tr key={alert.txId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{alert.txId}</td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73] font-mono">{alert.source}</td>
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]">{alert.rule}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{alert.amount}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg text-xs ${riskColors[alert.riskLevel]}`} style={{ fontWeight: 600 }}>{alert.riskLevel}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg text-xs ${actionColors[alert.action]}`} style={{ fontWeight: 600 }}>{alert.action}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73]">{alert.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sweeping Details */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <ArrowRightLeft className="w-5 h-5 text-[#34C759]" />
              <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.wallet.sweeping')}
              </h3>
            </div>

            {/* Sweeping metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MetricCard label={t('ops.wallet.sweep.today')} value="47" subtitle={t('ops.wallet.sweep.today.sub')} color="green" />
              <MetricCard label={t('ops.wallet.sweep.pending')} value="3" subtitle={t('ops.wallet.sweep.pending.sub')} color="amber" />
              <MetricCard label={t('ops.wallet.sweep.avgTime')} value="12 min" subtitle={t('ops.wallet.sweep.avgTime.sub')} />
              <MetricCard label={t('ops.wallet.sweep.lastRun')} value="2 min ago" subtitle={t('ops.wallet.sweep.autoSweep')} color="blue" />
            </div>

            {/* Sweeping threshold config */}
            <div className="rounded-xl p-4 bg-[#F0FFF4] border border-[#34C759]/20 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.wallet.sweep.threshold')}</span>
              </div>
              <div className="text-xs text-[#6E6E73]">
                BTC: ≥0.1 → cold &nbsp;·&nbsp; ETH: ≥5.0 → cold &nbsp;·&nbsp; USDT: ≥$10,000 → cold &nbsp;·&nbsp; SOL: ≥500 → cold
              </div>
            </div>

            {/* Recent sweep log */}
            <div className="text-sm text-[#6E6E73] mb-3" style={{ fontWeight: 600 }}>{t('ops.wallet.sweep.recent')}</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">Sweep ID</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.asset')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.amount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.sweep.from')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.sweep.to')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.kyt.status')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.wallet.sweep.completedAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'SW-401', asset: 'BTC', amount: '0.85', from: 'Hot (bc1q...p4w8)', to: 'Cold (bc1q...c9m2)', status: 'completed', completedAt: '2 min ago' },
                    { id: 'SW-402', asset: 'ETH', amount: '12.5', from: 'Hot (0x7a...d2e4)', to: 'Cold (0x9f...b1a3)', status: 'completed', completedAt: '8 min ago' },
                    { id: 'SW-403', asset: 'USDT', amount: '$25,000', from: 'Hot (TJ9q...3vN7)', to: 'Cold (TK4m...8pR2)', status: 'completed', completedAt: '15 min ago' },
                    { id: 'SW-404', asset: 'SOL', amount: '680', from: 'Hot (5Fu...kL9p)', to: 'Cold (7Hj...nQ3x)', status: 'completed', completedAt: '22 min ago' },
                    { id: 'SW-405', asset: 'BTC', amount: '1.2', from: 'Hot (bc1q...x7k2m)', to: 'Cold (bc1q...v5t1)', status: 'pending', completedAt: '—' },
                    { id: 'SW-406', asset: 'USDT', amount: '$50,000', from: 'Hot (TJ9q...6wE4)', to: 'Cold (TK4m...2dF8)', status: 'pending', completedAt: '—' },
                    { id: 'SW-407', asset: 'ETH', amount: '8.0', from: 'Hot (0x3f...a9c1)', to: 'Cold (0x9f...e7c5)', status: 'confirming', completedAt: '—' },
                  ].map(sweep => {
                    const statusColors: Record<string, string> = { completed: 'bg-[#F0FFF4] text-[#34C759]', pending: 'bg-[#FFF8F0] text-[#FF9F0A]', confirming: 'bg-[#F0F7FF] text-[#0A84FF]' };
                    return (
                      <tr key={sweep.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{sweep.id}</td>
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{sweep.asset}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{sweep.amount}</td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73] font-mono">{sweep.from}</td>
                        <td className="py-3 px-4 text-sm text-[#0A84FF] font-mono">{sweep.to}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg text-xs ${statusColors[sweep.status]}`} style={{ fontWeight: 600 }}>{sweep.status}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73]">{sweep.completedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Next scheduled sweep */}
            <div className="mt-6 rounded-xl p-4 bg-[#F0F7FF] border border-[#0A84FF]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0A84FF]" />
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.wallet.sweep.nextScheduled')}</span>
              </div>
              <div className="text-sm text-[#0A84FF]" style={{ fontWeight: 600 }}>2026-06-07 20:00 HKT (in 10 min)</div>
            </div>
          </div>
        </div>
        )}

        {/* ── Omnibus: Institution selector cards + Time Window ── */}
        {activeNav === 'omnibus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.nav.omnibus')}
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E5E5EA] p-1">
              <button
                onClick={() => setTimeWindow('24h')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeWindow === '24h' ? 'bg-[#0A84FF] text-white' : 'text-[#6E6E73] hover:bg-[#F5F5F7]'}`}
                style={{ fontWeight: 600 }}
              >
                {t('ops.time.24h')}
              </button>
              <button
                onClick={() => setTimeWindow('7d')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeWindow === '7d' ? 'bg-[#0A84FF] text-white' : 'text-[#6E6E73] hover:bg-[#F5F5F7]'}`}
                style={{ fontWeight: 600 }}
              >
                {t('ops.time.7d')}
              </button>
            </div>
          </div>
          {/* Institution selector table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5EA] bg-[#F5F5F7]">
                  <th className="text-left text-sm text-[#6E6E73] py-3 px-5">{t('ops.institutions.institution')}</th>
                  <th className="text-left text-sm text-[#6E6E73] py-3 px-5">{t('ops.institutions.model')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-3 px-5">{t('ops.institutions.clients')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-3 px-5">{t('ops.institutions.vaHoldings')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-3 px-5">Hot %</th>
                  <th className="text-left text-sm text-[#6E6E73] py-3 px-5">{t('ops.institutions.reconciliation')}</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(inst => {
                  const vaTotal = inst.vaHoldings.reduce((s, h) => s + h.usdValue, 0);
                  const instHotPct = (inst.custody.hotUSD / (inst.custody.coldUSD + inst.custody.hotUSD)) * 100;
                  const isSelected = selectedScope === inst.id;
                  const isMismatch = inst.reconciliation.status === 'mismatch';
                  return (
                    <tr
                      key={inst.id}
                      onClick={() => setSelectedScope(isSelected ? 'aggregate' : inst.id)}
                      className={`border-b border-[#E5E5EA] cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0F7FF] border-l-4 border-l-[#0A84FF]'
                          : isMismatch
                            ? 'bg-[#FFF5F5] hover:bg-[#FFE5E5]'
                            : 'hover:bg-[#F5F5F7]'
                      }`}
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0A84FF]" />
                          <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{inst.name}</span>
                          <span className="text-xs text-[#6E6E73]">{inst.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-1 rounded-lg text-xs ${inst.model === 'omnibus' ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'bg-[#F0FFF4] text-[#34C759]'}`} style={{ fontWeight: 600 }}>
                          {inst.model === 'omnibus' ? t('ops.institutions.omnibus') : t('ops.institutions.referral')}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right text-sm text-[#1D1D1F]">{inst.clients.count.toLocaleString()}</td>
                      <td className="py-3 px-5 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(vaTotal)}</td>
                      <td className={`py-3 px-5 text-right text-sm ${instHotPct > 2 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`} style={{ fontWeight: 600 }}>
                        {fmtPct(instHotPct)}{instHotPct > 2 ? ' ⚠' : ''}
                      </td>
                      <td className="py-3 px-5 text-sm">
                        {isMismatch ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
                            <span className="text-[#FF3B30]" style={{ fontWeight: 600 }}>{t('ops.institutions.mismatch')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                            <span className="text-[#34C759]" style={{ fontWeight: 600 }}>{t('ops.institutions.matched')}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ── Section 1: Overview ── */}
        {activeNav === 'omnibus' && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
              {t('ops.nav.overview')} — {scoped.scopeLabel}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <MetricCard label={t('ops.metric.fiatIn')} value={fmtUSD(fiatIn)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="green" />
            <MetricCard label={t('ops.metric.fiatOut')} value={fmtUSD(fiatOut)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="amber" />
            <MetricCard label={t('ops.metric.vaIn')} value={fmtUSD(vaIn)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="green" />
            <MetricCard label={t('ops.metric.vaOut')} value={fmtUSD(vaOut)} subtitle={timeWindow === '24h' ? t('ops.time.last24h') : t('ops.time.last7d')} color="amber" />
          </div>

          {/* Net Flow */}
          <div className={`rounded-xl p-6 flex items-center justify-between ${netFlow >= 0 ? 'bg-[#F0FFF4] border border-[#34C759]/30' : 'bg-[#FFF5F5] border border-[#FF3B30]/30'}`}>
            <div>
              <div className="text-sm text-[#6E6E73] mb-1">
                {t('ops.netFlow.label')} ({timeWindow}) = {t('ops.netFlow.formula')}
              </div>
              <div className={`text-3xl ${netFlow >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                {netFlow >= 0 ? '+' : ''}{fmtUSD(netFlow)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
              <div className="text-[#6E6E73]">{t('ops.metric.fiatIn').replace(' (USD)', '')}: <span className="text-[#34C759]">+{fmtUSD(fiatIn)}</span> / <span className="text-[#FF9F0A]">−{fmtUSD(fiatOut)}</span></div>
              <div className="text-[#6E6E73]">VA: <span className="text-[#34C759]">+{fmtUSD(vaIn)}</span> / <span className="text-[#FF9F0A]">−{fmtUSD(vaOut)}</span></div>
            </div>
          </div>
        </div>
        )}

        {/* ── Section 2: VA Holdings Breakdown ── */}
        {activeNav === 'omnibus' && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
              {t('ops.section.vaHoldings')} — {scoped.scopeLabel}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <MetricCard label={t('ops.metric.totalVA')} value={fmtUSD(totalVA_USD)} subtitle={t('ops.metric.totalVA.sub')} color="blue" />
            <MetricCard label={t('ops.metric.totalClients')} value={scoped.clients.count.toLocaleString()} subtitle={t('ops.metric.totalClients.sub').replace('{count}', String(scoped.institutionCount))} />
            <MetricCard label={t('ops.metric.institutionCount')} value={scoped.institutionCount.toString()} subtitle={scoped.isAggregate ? t('ops.metric.institutionCount.subAll') : t('ops.metric.institutionCount.subSingle')} color="green" />
            <MetricCard label={t('ops.metric.avgPerClient')} value={fmtUSD(avgPerClient)} subtitle={t('ops.metric.avgPerClient.sub')} color="amber" />
          </div>

          {/* VA holdings table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5EA]">
                  <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ops.table.asset')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.table.amount')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.table.usdValue')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.table.share')}</th>
                </tr>
              </thead>
              <tbody>
                {scoped.vaHoldings
                  .sort((a, b) => b.usdValue - a.usdValue)
                  .map(h => (
                    <tr key={h.asset} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                      <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{h.asset}</td>
                      <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]">
                        {h.asset === 'USDT' || h.asset === 'USDC'
                          ? `$${h.amount.toLocaleString()}`
                          : h.amount.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(h.usdValue)}</td>
                      <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">{fmtPct(totalVA_USD > 0 ? (h.usdValue / totalVA_USD) * 100 : 0)}</td>
                    </tr>
                  ))}
                <tr className="bg-[#F5F5F7]">
                  <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.table.total')}</td>
                  <td className="py-4 px-6"></td>
                  <td className="py-4 px-6 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(totalVA_USD)}</td>
                  <td className="py-4 px-6 text-right text-sm text-[#6E6E73]">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ── Section 3: Custody (Hot/Cold) ── */}
        {activeNav === 'omnibus' && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.section.custody')} — {scoped.scopeLabel}
              </h2>
            </div>
            {/* SFC Compliance badge */}
            {isSFCBreach ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF5F5] border border-[#FF3B30]/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
                <span className="text-sm text-[#FF3B30]" style={{ fontWeight: 600 }}>{t('ops.sfc.breach')} {fmtPct(hotPct)} {'>'} {t('ops.sfc.threshold')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#F0FFF4] border border-[#34C759]/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                <span className="text-sm text-[#34C759]" style={{ fontWeight: 600 }}>{t('ops.sfc.compliant')} {fmtPct(hotPct)} ≤ {t('ops.sfc.threshold')}</span>
              </div>
            )}
          </div>

          {/* Cold/Hot split + addresses */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F0F7FF] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-[#0A84FF]" />
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.custody.cold')} — {fmtPct(coldPct)}</span>
              </div>
              <div className="text-3xl text-[#0A84FF]" style={{ fontWeight: 600 }}>{fmtUSD(scoped.custody.coldUSD)}</div>
              <div className="text-sm text-[#6E6E73] mt-2">{scoped.custody.addresses.cold} {t('ops.custody.coldAddresses')}</div>
            </div>
            <div className={`rounded-xl p-6 ${isSFCBreach ? 'bg-[#FFF5F5]' : 'bg-[#FFF8F0]'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Flame className={`w-5 h-5 ${isSFCBreach ? 'text-[#FF3B30]' : 'text-[#FF9F0A]'}`} />
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.custody.hot')} — {fmtPct(hotPct)}</span>
              </div>
              <div className={`text-3xl ${isSFCBreach ? 'text-[#FF3B30]' : 'text-[#FF9F0A]'}`} style={{ fontWeight: 600 }}>{fmtUSD(scoped.custody.hotUSD)}</div>
              <div className="text-sm text-[#6E6E73] mt-2">{scoped.custody.addresses.hot} {t('ops.custody.hotAddresses')}</div>
            </div>
            <div className="bg-[#F5F5F7] rounded-xl p-6 space-y-3">
              <div className="text-sm text-[#6E6E73] mb-2" style={{ fontWeight: 600 }}>{t('ops.custody.addressSummary')}</div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6E6E73]">{t('ops.custody.totalAddresses')}</span>
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{scoped.custody.addresses.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6E6E73]">{t('ops.custody.cold')}</span>
                <span className="text-sm text-[#0A84FF]" style={{ fontWeight: 600 }}>{scoped.custody.addresses.cold}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6E6E73]">{t('ops.custody.hot')}</span>
                <span className="text-sm text-[#FF9F0A]" style={{ fontWeight: 600 }}>{scoped.custody.addresses.hot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6E6E73]">{t('ops.custody.whitelisted')}</span>
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{scoped.custody.addresses.whitelisted}</span>
              </div>
            </div>
          </div>

          {/* Per-asset hot vs cold table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5EA]">
                  <th className="text-left text-sm text-[#6E6E73] py-4 px-6">{t('ops.table.asset')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.custody.coldAmount')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.custody.hotAmount')}</th>
                  <th className="text-right text-sm text-[#6E6E73] py-4 px-6">{t('ops.custody.hotPct')}</th>
                </tr>
              </thead>
              <tbody>
                {scoped.custody.perAsset.map(ca => {
                  const totalAmt = ca.hot + ca.cold;
                  const hotRatio = totalAmt > 0 ? (ca.hot / totalAmt) * 100 : 0;
                  const isBreach = hotRatio > 2;
                  return (
                    <tr key={ca.asset} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                      <td className="py-4 px-6 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{ca.asset}</td>
                      <td className="py-4 px-6 text-right text-sm text-[#0A84FF]">
                        {ca.asset === 'USDT' || ca.asset === 'USDC'
                          ? `$${ca.cold.toLocaleString()}`
                          : ca.cold.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>
                      <td className={`py-4 px-6 text-right text-sm ${isBreach ? 'text-[#FF3B30]' : 'text-[#FF9F0A]'}`}>
                        {ca.asset === 'USDT' || ca.asset === 'USDC'
                          ? `$${ca.hot.toLocaleString()}`
                          : ca.hot.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>
                      <td className={`py-4 px-6 text-right text-sm ${isBreach ? 'text-[#FF3B30]' : 'text-[#6E6E73]'}`} style={{ fontWeight: isBreach ? 600 : 400 }}>
                        {fmtPct(hotRatio)} {isBreach && '⚠'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reconciliation status */}
          <div className={`mt-6 rounded-xl p-4 flex items-center justify-between ${scoped.reconciliation.allMatched ? 'bg-[#F0FFF4] border border-[#34C759]/30' : 'bg-[#FFF5F5] border border-[#FF3B30]/30'}`}>
            <div className="flex items-center gap-2">
              {scoped.reconciliation.allMatched
                ? <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                : <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />}
              <span className={`text-sm ${scoped.reconciliation.allMatched ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                {scoped.reconciliation.allMatched ? t('ops.reconciliation.matched') : `${scoped.reconciliation.mismatchCount} ${t('ops.reconciliation.mismatch')}`}
              </span>
            </div>
            <div className="text-sm text-[#6E6E73]">
              {!scoped.reconciliation.allMatched && <span className="text-[#FF3B30]" style={{ fontWeight: 600 }}>{t('ops.reconciliation.diff')}: {fmtUSD(scoped.reconciliation.totalDiffUSD)} · </span>}
              {t('ops.reconciliation.lastChecked')}: {new Date(scoped.reconciliation.lastCheckedISO).toLocaleString()}
            </div>
          </div>
        </div>
        )}

        {/* ── Section 4: Per-Institution Table ── */}
        {activeNav === 'institutions' && scoped.isAggregate && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.section.institutions')}
              </h2>
            </div>
            <div className="text-sm text-[#6E6E73] mb-4">{t('ops.institutions.clickHint')}</div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('name')}>
                      {t('ops.institutions.institution')} <SortIcon column="name" />
                    </th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('model')}>
                      {t('ops.institutions.model')} <SortIcon column="model" />
                    </th>
                    <th className="text-right text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('vaHoldings')}>
                      {t('ops.institutions.vaHoldings')} <SortIcon column="vaHoldings" />
                    </th>
                    <th className="text-right text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('clients')}>
                      {t('ops.institutions.clients')} <SortIcon column="clients" />
                    </th>
                    <th className="text-right text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('fiatNet')}>
                      {t('ops.institutions.fiatNet')} <SortIcon column="fiatNet" />
                    </th>
                    <th className="text-right text-sm text-[#6E6E73] py-4 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleSort('vaNet')}>
                      {t('ops.institutions.vaNet')} <SortIcon column="vaNet" />
                    </th>
                    <th className="text-left text-sm text-[#6E6E73] py-4 px-4">{t('ops.institutions.reconciliation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInstitutions.map(inst => {
                    const vaTotal = inst.vaHoldings.reduce((s, h) => s + h.usdValue, 0);
                    const fiatNet = inst.fiatFlows.in24h - inst.fiatFlows.out24h;
                    const vaNet = inst.vaFlows.in24hUSD - inst.vaFlows.out24hUSD;
                    const isMismatch = inst.reconciliation.status === 'mismatch';
                    return (
                      <tr
                        key={inst.id}
                        className={`border-b border-[#E5E5EA] cursor-pointer transition-colors ${
                          isMismatch ? 'bg-[#FFF5F5] hover:bg-[#FFE5E5]' : 'hover:bg-[#F5F5F7]'
                        }`}
                        onClick={() => setSelectedScope(inst.id)}
                      >
                        <td className="py-4 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#0A84FF]" />
                            {inst.name}
                          </div>
                          <div className="text-xs text-[#6E6E73]">{inst.id}</div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg text-xs ${inst.model === 'omnibus' ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'bg-[#F0FFF4] text-[#34C759]'}`} style={{ fontWeight: 600 }}>
                            {inst.model === 'omnibus' ? t('ops.institutions.omnibus') : t('ops.institutions.referral')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(vaTotal)}</td>
                        <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]">{inst.clients.count.toLocaleString()}</td>
                        <td className={`py-4 px-4 text-right text-sm ${fiatNet >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                          {fiatNet >= 0 ? '+' : ''}{fmtUSD(fiatNet)}
                        </td>
                        <td className={`py-4 px-4 text-right text-sm ${vaNet >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                          {vaNet >= 0 ? '+' : ''}{fmtUSD(vaNet)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {isMismatch ? (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
                              <span className="text-[#FF3B30]" style={{ fontWeight: 600 }}>{t('ops.institutions.mismatch')}</span>
                              <span className="text-xs text-[#6E6E73] ml-1">({fmtUSD(inst.reconciliation.diffUSD)})</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                              <span className="text-[#34C759]" style={{ fontWeight: 600 }}>{t('ops.institutions.matched')}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Footer totals row */}
                  <tr className="bg-[#F5F5F7]">
                    <td className="py-4 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.institutions.total')} ({institutions.length})</td>
                    <td className="py-4 px-4 text-sm text-[#6E6E73]">—</td>
                    <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(aggVA)}</td>
                    <td className="py-4 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{aggClients.toLocaleString()}</td>
                    <td className={`py-4 px-4 text-right text-sm ${aggFiatNet >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                      {aggFiatNet >= 0 ? '+' : ''}{fmtUSD(aggFiatNet)}
                    </td>
                    <td className={`py-4 px-4 text-right text-sm ${aggVANet >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                      {aggVANet >= 0 ? '+' : ''}{fmtUSD(aggVANet)}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#6E6E73]">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Client Accounts ── */}
        {activeNav === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.clients.title')}
              </h2>
            </div>
            <div className="text-sm text-[#6E6E73]">{t('ops.clients.description')}</div>

            {/* Summary metrics */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard label={t('ops.clients.total')} value={clientAccounts.length.toString()} subtitle={`${clientAgg.passed} ${t('ops.clients.passed')} · ${clientAgg.pending} ${t('ops.clients.pending')} · ${clientAgg.reKyc} ${t('ops.clients.reKyc')}`} color="blue" />
              <MetricCard label={t('ops.clients.holdings')} value={fmtUSD(clientAgg.totalHoldings)} subtitle={t('ops.metric.totalVA.sub')} color="green" />
              <MetricCard label={t('ops.clients.volume')} value={fmtUSD(clientAgg.totalVolume)} subtitle={`${clientAgg.totalOrders.toLocaleString()} ${t('ops.clients.orders').toLowerCase()}`} color="amber" />
              <MetricCard label={t('ops.clients.institution')} value={`${clientAgg.omnibusCount} / ${clientAgg.referralCount}`} subtitle={`Omnibus / Referral`} />
            </div>

            {/* Filter + Search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E5E5EA] p-1">
                {[{ id: 'all', label: 'All' }, ...institutions.map(i => ({ id: i.id, label: i.name }))].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setClientFilterInst(opt.id); setClientPage(0); }}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${clientFilterInst === opt.id ? 'bg-[#0A84FF] text-white' : 'text-[#6E6E73] hover:bg-[#F5F5F7]'}`}
                    style={{ fontWeight: 600 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={clientSearch}
                onChange={e => { setClientSearch(e.target.value); setClientPage(0); }}
                placeholder="Search client ID..."
                className="px-3 py-2 text-sm bg-white border border-[#E5E5EA] rounded-xl focus:outline-none focus:border-[#0A84FF] w-48"
              />
              <div className="text-xs text-[#6E6E73]">
                {sortedClients.length.toLocaleString()} result{sortedClients.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Client accounts table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5EA] bg-[#F5F5F7]">
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('clientId')}>
                        {t('ops.clients.clientId')} <ClientSortIcon column="clientId" />
                      </th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('institutionName')}>
                        {t('ops.clients.institution')} <ClientSortIcon column="institutionName" />
                      </th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('kycStatus')}>
                        {t('ops.clients.kycStatus')} <ClientSortIcon column="kycStatus" />
                      </th>
                      <th className="text-center text-sm text-[#6E6E73] py-3 px-4">{t('ops.clients.kycDetails')}</th>
                      <th className="text-right text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('holdingsUSD')}>
                        {t('ops.clients.holdings')} <ClientSortIcon column="holdingsUSD" />
                      </th>
                      <th className="text-right text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('totalVolumeUsd')}>
                        {t('ops.clients.volume')} <ClientSortIcon column="totalVolumeUsd" />
                      </th>
                      <th className="text-right text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('orderCount')}>
                        {t('ops.clients.orders')} <ClientSortIcon column="orderCount" />
                      </th>
                      <th className="text-right text-sm text-[#6E6E73] py-3 px-4 cursor-pointer select-none hover:text-[#0A84FF]" onClick={() => handleClientSort('lastActivity')}>
                        {t('ops.clients.lastActivity')} <ClientSortIcon column="lastActivity" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedClients.map(c => {
                      const kycColor = c.kycStatus === 'passed' ? 'bg-[#F0FFF4] text-[#34C759]' : c.kycStatus === 'pending_review' ? 'bg-[#FFF8F0] text-[#FF9F0A]' : 'bg-[#FFF5F5] text-[#FF3B30]';
                      const kycLabel = c.kycStatus === 'passed' ? t('ops.clients.passed') : c.kycStatus === 'pending_review' ? t('ops.clients.pending') : t('ops.clients.reKyc');
                      return (
                        <tr key={c.clientId} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                          <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{c.clientId}</td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#0A84FF]" />
                              <span className="text-[#1D1D1F]">{c.institutionName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-lg text-xs ${kycColor}`} style={{ fontWeight: 600 }}>{kycLabel}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-center">
                            {c.hasKYCDetails ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveNav('clientDetails'); }}
                                className="text-[#0A84FF] hover:underline text-xs"
                                style={{ fontWeight: 600 }}
                              >
                                {t('ops.clients.kycDetails.view')}
                              </button>
                            ) : (
                              <span className="text-xs text-[#D1D1D6]">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(c.holdingsUSD)}</td>
                          <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]">{fmtUSD(c.totalVolumeUsd)}</td>
                          <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]">{c.orderCount}</td>
                          <td className="py-3 px-4 text-right text-sm text-[#6E6E73]">{c.lastActivity}</td>
                        </tr>
                      );
                    })}
                    {/* Footer totals */}
                    <tr className="bg-[#F5F5F7]">
                      <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.clients.total')} ({filteredClients.length.toLocaleString()})</td>
                      <td className="py-3 px-4 text-sm text-[#6E6E73]">—</td>
                      <td className="py-3 px-4 text-sm text-[#6E6E73]">—</td>
                      <td className="py-3 px-4 text-sm text-[#6E6E73]">—</td>
                      <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(clientAgg.totalHoldings)}</td>
                      <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{fmtUSD(clientAgg.totalVolume)}</td>
                      <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{clientAgg.totalOrders.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-[#6E6E73]">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5EA] bg-[#F5F5F7]">
                  <div className="text-xs text-[#6E6E73]">
                    Page {clientPage + 1} of {totalPages} · Showing {clientPage * CLIENT_PAGE_SIZE + 1}–{Math.min((clientPage + 1) * CLIENT_PAGE_SIZE, sortedClients.length)} of {sortedClients.length.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setClientPage(p => Math.max(0, p - 1))}
                      disabled={clientPage === 0}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E5E5EA] disabled:opacity-40 hover:bg-[#F5F5F7]"
                      style={{ fontWeight: 600 }}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setClientPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={clientPage >= totalPages - 1}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E5E5EA] disabled:opacity-40 hover:bg-[#F5F5F7]"
                      style={{ fontWeight: 600 }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Client Details (KYC) ── */}
        {activeNav === 'clientDetails' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.clientDetails.title')}
              </h2>
            </div>
            <div className="text-sm text-[#6E6E73]">{t('ops.clientDetails.description')}</div>

            {/* KYC Details table for referral clients */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5EA] bg-[#F5F5F7]">
                      <th className="w-8 text-sm text-[#6E6E73] py-3 px-2"></th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clients.clientId')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.fullName')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.idCardType')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.idCardNumber')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.nationality')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.countryOfResidence')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.address')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.dateOfBirth')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.institution')}</th>
                      <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.clientDetails.kycStatus')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientKYCDetails.map(kyc => {
                      const client = clientAccounts.find(c => c.clientId === kyc.clientId);
                      const kycColor = client?.kycStatus === 'passed' ? 'bg-[#F0FFF4] text-[#34C759]' : client?.kycStatus === 'pending_review' ? 'bg-[#FFF8F0] text-[#FF9F0A]' : 'bg-[#FFF5F5] text-[#FF3B30]';
                      const kycLabel = client?.kycStatus === 'passed' ? t('ops.clients.passed') : client?.kycStatus === 'pending_review' ? t('ops.clients.pending') : t('ops.clients.reKyc');
                      const isExpanded = expandedClient === kyc.clientId;
                      // Mock document labels based on ID type
                      const docLabels = kyc.idCardType === 'HKID'
                        ? [t('ops.clientDetails.doc.hkidFront'), t('ops.clientDetails.doc.hkidBack'), t('ops.clientDetails.doc.addressProof')]
                        : [t('ops.clientDetails.doc.passportPhoto'), t('ops.clientDetails.doc.passportInfo'), t('ops.clientDetails.doc.addressProof')];
                      return (
                        <Fragment key={kyc.clientId}>
                          <tr
                            className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors cursor-pointer ${isExpanded ? 'bg-[#F0F7FF]' : ''}`}
                            onClick={() => setExpandedClient(isExpanded ? null : kyc.clientId)}
                          >
                            <td className="py-3 px-2 text-center">
                              {isExpanded
                                ? <ChevronUp className="w-4 h-4 text-[#0A84FF] inline" />
                                : <ChevronDown className="w-4 h-4 text-[#D1D1D6] inline" />
                              }
                            </td>
                            <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{kyc.clientId}</td>
                            <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{kyc.fullName}</td>
                            <td className="py-3 px-4 text-sm text-[#6E6E73]">{kyc.idCardType}</td>
                            <td className="py-3 px-4 text-sm text-[#1D1D1F] font-mono">{kyc.idCardNumber}</td>
                            <td className="py-3 px-4 text-sm text-[#1D1D1F]">{kyc.nationality}</td>
                            <td className="py-3 px-4 text-sm text-[#1D1D1F]">{kyc.countryOfResidence}</td>
                            <td className="py-3 px-4 text-sm text-[#6E6E73] max-w-[200px] truncate" title={kyc.address}>{kyc.address}</td>
                            <td className="py-3 px-4 text-sm text-[#6E6E73]">{kyc.dateOfBirth}</td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-[#0A84FF]" />
                                <span className="text-[#1D1D1F]">{client?.institutionName ?? '—'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`px-2 py-1 rounded-lg text-xs ${kycColor}`} style={{ fontWeight: 600 }}>{kycLabel}</span>
                            </td>
                          </tr>
                          {/* Expanded: Document images */}
                          {isExpanded && (
                            <tr className="border-b border-[#E5E5EA] bg-[#FAFAFA]">
                              <td colSpan={11} className="py-4 px-6">
                                <div className="text-sm text-[#6E6E73] mb-3" style={{ fontWeight: 600 }}>
                                  {t('ops.clientDetails.documents')}
                                </div>
                                <div className="flex gap-4">
                                  {docLabels.map((label, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                      <div className="w-48 h-32 bg-[#E5E5EA] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[#D1D1D6]">
                                        <svg className="w-8 h-8 text-[#C7C7CC] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                        </svg>
                                        <span className="text-xs text-[#C7C7CC]">{t('ops.clientDetails.doc.placeholder')}</span>
                                      </div>
                                      <span className="text-xs text-[#6E6E73]" style={{ fontWeight: 600 }}>{label}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Omnibus clients notice */}
            <div className="bg-[#F5F5F7] rounded-xl p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#6E6E73]" />
              <div className="text-sm text-[#6E6E73]">{t('ops.clientDetails.noData')}</div>
            </div>
          </div>
        )}

        {/* ── Bank: Money In/Out from all institutions ── */}
        {activeNav === 'bank' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
              {t('ops.bank.title')}
            </h2>
          </div>
          <div className="text-sm text-[#6E6E73]">{t('ops.bank.subtitle')}</div>

          {/* Aggregate fiat flows */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label={t('ops.bank.totalFiatIn')} value={fmtUSD(institutions.reduce((s, i) => s + i.fiatFlows.in24h, 0))} subtitle={t('ops.time.last24h')} color="green" />
            <MetricCard label={t('ops.bank.totalFiatOut')} value={fmtUSD(institutions.reduce((s, i) => s + i.fiatFlows.out24h, 0))} subtitle={t('ops.time.last24h')} color="amber" />
            <MetricCard label={t('ops.bank.totalVaIn')} value={fmtUSD(institutions.reduce((s, i) => s + i.vaFlows.in24hUSD, 0))} subtitle={t('ops.time.last24h')} color="green" />
            <MetricCard label={t('ops.bank.totalVaOut')} value={fmtUSD(institutions.reduce((s, i) => s + i.vaFlows.out24hUSD, 0))} subtitle={t('ops.time.last24h')} color="amber" />
          </div>

          {/* Per-institution breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-sm text-[#6E6E73] mb-4" style={{ fontWeight: 600 }}>{t('ops.bank.byInstitution')}</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.institutions.institution')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.institutions.model')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.bank.fiatIn')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.bank.fiatOut')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.bank.vaIn')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.bank.vaOut')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('ops.bank.netFlow')}</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map(inst => {
                    const net = (inst.fiatFlows.in24h - inst.fiatFlows.out24h) + (inst.vaFlows.in24hUSD - inst.vaFlows.out24hUSD);
                    return (
                      <tr key={inst.id} className="border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors">
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#0A84FF]" />
                            {inst.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg text-xs ${inst.model === 'omnibus' ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'bg-[#F0FFF4] text-[#34C759]'}`} style={{ fontWeight: 600 }}>
                            {inst.model === 'omnibus' ? t('ops.institutions.omnibus') : t('ops.institutions.referral')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-[#34C759]" style={{ fontWeight: 600 }}>+{fmtUSD(inst.fiatFlows.in24h)}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#FF9F0A]">−{fmtUSD(inst.fiatFlows.out24h)}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#34C759]" style={{ fontWeight: 600 }}>+{fmtUSD(inst.vaFlows.in24hUSD)}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#FF9F0A]">−{fmtUSD(inst.vaFlows.out24hUSD)}</td>
                        <td className={`py-3 px-4 text-right text-sm ${net >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>
                          {net >= 0 ? '+' : ''}{fmtUSD(net)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total row */}
                  <tr className="bg-[#F5F5F7]">
                    <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.institutions.total')}</td>
                    <td className="py-3 px-4 text-sm text-[#6E6E73]">—</td>
                    <td className="py-3 px-4 text-right text-sm text-[#34C759]" style={{ fontWeight: 600 }}>+{fmtUSD(institutions.reduce((s, i) => s + i.fiatFlows.in24h, 0))}</td>
                    <td className="py-3 px-4 text-right text-sm text-[#FF9F0A]">−{fmtUSD(institutions.reduce((s, i) => s + i.fiatFlows.out24h, 0))}</td>
                    <td className="py-3 px-4 text-right text-sm text-[#34C759]" style={{ fontWeight: 600 }}>+{fmtUSD(institutions.reduce((s, i) => s + i.vaFlows.in24hUSD, 0))}</td>
                    <td className="py-3 px-4 text-right text-sm text-[#FF9F0A]">−{fmtUSD(institutions.reduce((s, i) => s + i.vaFlows.out24hUSD, 0))}</td>
                    {(() => {
                      const totalNet = institutions.reduce((s, i) => s + (i.fiatFlows.in24h - i.fiatFlows.out24h) + (i.vaFlows.in24hUSD - i.vaFlows.out24hUSD), 0);
                      return <td className={`py-3 px-4 text-right text-sm ${totalNet >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`} style={{ fontWeight: 600 }}>{totalNet >= 0 ? '+' : ''}{fmtUSD(totalNet)}</td>;
                    })()}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order-Linked Fund Movements */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                  {t('ops.bank.orderLinkedFunds')}
                </h3>
                <div className="text-sm text-[#6E6E73] mt-1">{t('ops.bank.orderLinkedFunds.sub')}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.referenceId')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.orderId')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.institutions.institution')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.clientId')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.direction')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.table.asset')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.vaAmount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.fiatCurrency')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.fiatAmount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.receivedAt')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.settlementStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ref: 'BNK-REF-001', orderId: 'ORD-4522', inst: 'BeanBank', clientId: 'BB-0001', dir: 'buy', asset: 'BTC', vaAmount: '2.5 BTC', fiatCurrency: 'HKD', fiatAmount: '2,047,500', receivedAt: '2026-06-07 14:05', status: 'paid' },
                    { ref: 'BNK-REF-002', orderId: 'ORD-4521', inst: 'BeanBank', clientId: 'BB-0003', dir: 'buy', asset: 'ETH', vaAmount: '45.0 ETH', fiatCurrency: 'USD', fiatAmount: '171,000', receivedAt: '2026-06-07 13:42', status: 'paid' },
                    { ref: 'BNK-REF-003', orderId: 'ORD-4520', inst: 'BeanBank', clientId: 'BB-0005', dir: 'sell', asset: 'USDT', vaAmount: '50,000 USDT', fiatCurrency: 'HKD', fiatAmount: '390,000', receivedAt: '2026-06-07 12:18', status: 'paid' },
                    { ref: 'BNK-REF-004', orderId: 'ORD-4519', inst: 'BeanBank', clientId: 'BB-0007', dir: 'buy', asset: 'BTC', vaAmount: '1.0 BTC', fiatCurrency: 'USD', fiatAmount: '105,000', receivedAt: '—', status: 'pending' },
                    { ref: 'BNK-REF-005', orderId: 'ORD-3512', inst: 'Dragon Securities', clientId: 'DS-0015', dir: 'sell', asset: 'ETH', vaAmount: '130.0 ETH', fiatCurrency: 'HKD', fiatAmount: '3,853,200', receivedAt: '2026-06-07 10:55', status: 'paid' },
                    { ref: 'BNK-REF-006', orderId: 'ORD-3511', inst: 'Dragon Securities', clientId: 'DS-0042', dir: 'buy', asset: 'SOL', vaAmount: '320 SOL', fiatCurrency: 'HKD', fiatAmount: '486,720', receivedAt: '2026-06-07 09:30', status: 'paid' },
                    { ref: 'BNK-REF-007', orderId: 'ORD-2201', inst: 'SC Securities', clientId: 'SC-001', dir: 'buy', asset: 'BTC', vaAmount: '1.8 BTC', fiatCurrency: 'USD', fiatAmount: '189,000', receivedAt: '2026-06-07 08:12', status: 'paid' },
                    { ref: 'BNK-REF-008', orderId: 'ORD-2200', inst: 'SC Securities', clientId: 'SC-003', dir: 'buy', asset: 'ETH', vaAmount: '22.0 ETH', fiatCurrency: 'HKD', fiatAmount: '652,080', receivedAt: '—', status: 'failed' },
                    { ref: 'BNK-REF-009', orderId: 'ORD-4514', inst: 'BeanBank', clientId: 'BB-0010', dir: 'buy', asset: 'BTC', vaAmount: '0.5 BTC', fiatCurrency: 'USD', fiatAmount: '52,500', receivedAt: '2026-06-07 07:45', status: 'paid' },
                    { ref: 'BNK-REF-010', orderId: 'ORD-3510', inst: 'Dragon Securities', clientId: 'DS-0088', dir: 'sell', asset: 'USDT', vaAmount: '25,000 USDT', fiatCurrency: 'HKD', fiatAmount: '195,000', receivedAt: '2026-06-07 07:10', status: 'paid' },
                  ].map((item) => {
                    const dirColor = item.dir === 'buy' ? 'bg-[#F0FFF4] text-[#34C759]' : 'bg-[#FFF8F0] text-[#FF9F0A]';
                    const dirLabel = item.dir === 'buy' ? t('status.buy') : t('status.sell');
                    const statusColor = item.status === 'paid' ? 'bg-[#F0FFF4] text-[#34C759]' : item.status === 'pending' ? 'bg-[#FFF8F0] text-[#FF9F0A]' : 'bg-[#FFF5F5] text-[#FF3B30]';
                    const statusLabel = item.status === 'paid' ? t('bb.bank.settlement.paid') : item.status === 'pending' ? t('bb.bank.settlement.pending') : t('bb.bank.settlement.failed');
                    const instColor = item.inst === 'BeanBank' ? 'text-[#0A84FF]' : item.inst === 'Dragon Securities' ? 'text-[#5AC8FA]' : 'text-[#34C759]';
                    return (
                      <tr key={item.ref} className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors ${item.status === 'failed' ? 'bg-[#FFF5F5]' : item.status === 'pending' ? 'bg-[#FFF8F0]' : ''}`}>
                        <td className="py-3 px-4 text-sm text-[#1D1D1F] font-mono" style={{ fontWeight: 600 }}>{item.ref}</td>
                        <td className="py-3 px-4 text-sm text-[#0A84FF]" style={{ fontWeight: 600 }}>{item.orderId}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#6E6E73]" />
                            <span className={instColor} style={{ fontWeight: 600 }}>{item.inst}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73]">{item.clientId}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${dirColor}`} style={{ fontWeight: 600 }}>{dirLabel}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.asset}</td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]">{item.vaAmount}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${item.fiatCurrency === 'HKD' ? 'bg-[#0A84FF]/10 text-[#0A84FF]' : 'bg-[#34C759]/10 text-[#34C759]'}`} style={{ fontWeight: 600 }}>{item.fiatCurrency}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.fiatAmount}</td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73]">{item.receivedAt}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${statusColor}`} style={{ fontWeight: 600 }}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-xl p-4">
              Each Reference ID is linked 1:1 with an Order ID for full traceability across all institutions.
            </div>
          </div>

          {/* Bank Transfer History */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                  {t('ops.bank.bankTransfers')}
                </h3>
                <div className="text-sm text-[#6E6E73] mt-1">{t('ops.bank.bankTransfers.sub')}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5EA]">
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.referenceId')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('ops.institutions.institution')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.direction')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.fiatCurrency')}</th>
                    <th className="text-right text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.fiatAmount')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.bankRef')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.receivedAt')}</th>
                    <th className="text-left text-sm text-[#6E6E73] py-3 px-4">{t('bb.bank.col.settlementStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ref: 'TXF-001', inst: 'BeanBank', dir: 'incoming', fiatCurrency: 'HKD', fiatAmount: '2,047,500', bankRef: 'BOC-HK-7721', receivedAt: '2026-06-07 14:05', status: 'completed' },
                    { ref: 'TXF-002', inst: 'BeanBank', dir: 'incoming', fiatCurrency: 'USD', fiatAmount: '171,000', bankRef: 'HSBC-4523', receivedAt: '2026-06-07 13:42', status: 'completed' },
                    { ref: 'TXF-003', inst: 'BeanBank', dir: 'outgoing', fiatCurrency: 'HKD', fiatAmount: '390,000', bankRef: 'BOC-HK-7722', receivedAt: '2026-06-07 12:18', status: 'completed' },
                    { ref: 'TXF-004', inst: 'Dragon Securities', dir: 'outgoing', fiatCurrency: 'HKD', fiatAmount: '3,853,200', bankRef: 'HSBC-8831', receivedAt: '2026-06-07 10:55', status: 'completed' },
                    { ref: 'TXF-005', inst: 'Dragon Securities', dir: 'incoming', fiatCurrency: 'HKD', fiatAmount: '486,720', bankRef: 'BOC-HK-5512', receivedAt: '2026-06-07 09:30', status: 'completed' },
                    { ref: 'TXF-006', inst: 'SC Securities', dir: 'incoming', fiatCurrency: 'USD', fiatAmount: '189,000', bankRef: 'CITI-2201', receivedAt: '2026-06-07 08:12', status: 'completed' },
                    { ref: 'TXF-007', inst: 'SC Securities', dir: 'incoming', fiatCurrency: 'HKD', fiatAmount: '652,080', bankRef: 'HSBC-2200', receivedAt: '—', status: 'failed' },
                    { ref: 'TXF-008', inst: 'BeanBank', dir: 'outgoing', fiatCurrency: 'HKD', fiatAmount: '195,000', bankRef: 'BOC-HK-7723', receivedAt: '2026-06-07 07:10', status: 'completed' },
                    { ref: 'TXF-009', inst: 'BeanBank', dir: 'incoming', fiatCurrency: 'USD', fiatAmount: '52,500', bankRef: 'HSBC-4514', receivedAt: '2026-06-07 07:45', status: 'completed' },
                    { ref: 'TXF-010', inst: 'Dragon Securities', dir: 'outgoing', fiatCurrency: 'HKD', fiatAmount: '195,000', bankRef: 'HSBC-8832', receivedAt: '2026-06-06 16:20', status: 'completed' },
                    { ref: 'TXF-011', inst: 'BeanBank', dir: 'incoming', fiatCurrency: 'HKD', fiatAmount: '1,250,000', bankRef: 'BOC-HK-7724', receivedAt: '2026-06-06 14:30', status: 'completed' },
                    { ref: 'TXF-012', inst: 'SC Securities', dir: 'outgoing', fiatCurrency: 'USD', fiatAmount: '85,000', bankRef: 'CITI-2195', receivedAt: '2026-06-06 11:05', status: 'completed' },
                  ].map((item) => {
                    const dirColor = item.dir === 'incoming' ? 'text-[#34C759]' : 'text-[#FF9F0A]';
                    const dirBg = item.dir === 'incoming' ? 'bg-[#F0FFF4]' : 'bg-[#FFF8F0]';
                    const dirLabel = item.dir === 'incoming' ? t('bb.bank.incoming') : t('bb.bank.outgoing');
                    const statusColor = item.status === 'completed' ? 'bg-[#F0FFF4] text-[#34C759]' : item.status === 'pending' ? 'bg-[#FFF8F0] text-[#FF9F0A]' : 'bg-[#FFF5F5] text-[#FF3B30]';
                    const statusLabel = item.status === 'completed' ? t('status.completed') : item.status === 'pending' ? t('status.pending') : t('bb.bank.settlement.failed');
                    const instColor = item.inst === 'BeanBank' ? 'text-[#0A84FF]' : item.inst === 'Dragon Securities' ? 'text-[#5AC8FA]' : 'text-[#34C759]';
                    return (
                      <tr key={item.ref} className={`border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors ${item.status === 'failed' ? 'bg-[#FFF5F5]' : ''}`}>
                        <td className="py-3 px-4 text-sm text-[#1D1D1F] font-mono" style={{ fontWeight: 600 }}>{item.ref}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#6E6E73]" />
                            <span className={instColor} style={{ fontWeight: 600 }}>{item.inst}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${dirBg} ${dirColor}`} style={{ fontWeight: 600 }}>{dirLabel}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${item.fiatCurrency === 'HKD' ? 'bg-[#0A84FF]/10 text-[#0A84FF]' : 'bg-[#34C759]/10 text-[#34C759]'}`} style={{ fontWeight: 600 }}>{item.fiatCurrency}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{item.fiatAmount}</td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73] font-mono">{item.bankRef}</td>
                        <td className="py-3 px-4 text-sm text-[#6E6E73]">{item.receivedAt}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${statusColor}`} style={{ fontWeight: 600 }}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Capital Reserve — what each institution deposited as reserve */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[#0A84FF]" />
              <div className="text-sm text-[#6E6E73]" style={{ fontWeight: 600 }}>{t('ops.bank.capitalReserve')}</div>
            </div>
            <div className="text-xs text-[#6E6E73] mb-4">{t('ops.bank.capitalReserve.desc')}</div>
            <div className="grid grid-cols-3 gap-4">
              {institutions.map(inst => (
                <div key={inst.id} className={`rounded-xl p-4 ${inst.reserveUSD > 0 ? 'bg-[#F0F7FF]' : 'bg-[#F5F5F7]'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-[#0A84FF]" />
                    <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{inst.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${inst.model === 'omnibus' ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'bg-[#F0FFF4] text-[#34C759]'}`} style={{ fontWeight: 600 }}>
                      {inst.model === 'omnibus' ? t('ops.institutions.omnibus') : t('ops.institutions.referral')}
                    </span>
                  </div>
                  {inst.reserveUSD > 0 ? (
                    <>
                      <div className="text-xs text-[#6E6E73] mb-1">{t('ops.bank.reserveDeposited')}</div>
                      <div className="text-lg text-[#0A84FF]" style={{ fontWeight: 600 }}>{fmtUSD(inst.reserveUSD)}</div>
                      <div className="mt-2 rounded-lg px-2 py-1 bg-[#F0FFF4] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                        <span className="text-xs text-[#34C759]" style={{ fontWeight: 600 }}>{t('ops.bank.reserveActive')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-[#6E6E73] mb-1">{t('ops.bank.reserveDeposited')}</div>
                      <div className="text-lg text-[#D1D1D6]" style={{ fontWeight: 600 }}>—</div>
                      <div className="text-xs text-[#6E6E73] mt-2">{t('ops.bank.noReserve')}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Total capital reserve */}
            <div className="mt-4 rounded-xl p-4 bg-[#F5F5F7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#0A84FF]" />
                <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.bank.totalReserve')}</span>
              </div>
              <div className="text-lg text-[#0A84FF]" style={{ fontWeight: 600 }}>
                {fmtUSD(institutions.reduce((s, i) => s + i.reserveUSD, 0))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── Reports placeholder ── */}
        {activeNav === 'reports' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.nav.reports')}
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-16 h-16 text-[#D1D1D6] mb-4" />
              <div className="text-lg text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>{t('ops.reports.title')}</div>
              <div className="text-sm text-[#6E6E73] max-w-md">{t('ops.reports.description')}</div>
              <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-lg">
                <button className="flex items-center gap-3 px-4 py-4 bg-[#F0F7FF] rounded-xl text-left hover:bg-[#D6EAFF] transition-colors">
                  <FileText className="w-5 h-5 text-[#0A84FF]" />
                  <div>
                    <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.reports.daily')}</div>
                    <div className="text-xs text-[#6E6E73]">CSV · PDF</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-4 bg-[#F0FFF4] rounded-xl text-left hover:bg-[#D6F5E0] transition-colors">
                  <FileText className="w-5 h-5 text-[#34C759]" />
                  <div>
                    <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.reports.compliance')}</div>
                    <div className="text-xs text-[#6E6E73]">SFC · HKMA</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-4 bg-[#FFF8F0] rounded-xl text-left hover:bg-[#FFECD6] transition-colors">
                  <FileText className="w-5 h-5 text-[#FF9F0A]" />
                  <div>
                    <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.reports.reconciliation')}</div>
                    <div className="text-xs text-[#6E6E73]">Audit trail</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-4 bg-[#F5F0FF] rounded-xl text-left hover:bg-[#E6DAFF] transition-colors">
                  <FileText className="w-5 h-5 text-[#8B5CF6]" />
                  <div>
                    <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{t('ops.reports.flow')}</div>
                    <div className="text-xs text-[#6E6E73]">Fiat · VA</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Settings placeholder ── */}
        {activeNav === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {t('ops.nav.settings')}
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Settings className="w-16 h-16 text-[#D1D1D6] mb-4" />
              <div className="text-lg text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>{t('ops.settings.title')}</div>
              <div className="text-sm text-[#6E6E73] max-w-md">{t('ops.settings.description')}</div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
}
