// ── Consistent mock data for BeanBank Dashboard ──
// All sections reference this single source of truth.

// ── Asset Prices ──
// Real-time market prices from CoinGecko (2026-06-07)
export const ASSET_PRICES: Record<string, number> = {
  BTC: 62539,
  ETH: 1634.87,
  USDT: 0.9995,
  SOL: 65.42,
};

// ── Clients ──
export interface Client {
  clientId: string;
  orderCount: number;
  totalVolumeUsd: number;
  createdAt: string;
  lastActivity: string;
  kycStatus: 'passed' | 'pending_review' | 're_kyc_required';
  classification: 'retail' | 'professional';
  // Holdings per asset
  holdings: {
    BTC: number;
    ETH: number;
    USDT: number;
    SOL: number;
  };
}

export const clients: Client[] = [
  {
    clientId: 'CA-001', orderCount: 87, totalVolumeUsd: 1245830,
    createdAt: '2025-06-15', lastActivity: '2026-05-28',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 12.8, ETH: 520.5, USDT: 345000, SOL: 1560 },
  },
  {
    clientId: 'CA-002', orderCount: 42, totalVolumeUsd: 890200,
    createdAt: '2025-08-22', lastActivity: '2026-05-30',
    kycStatus: 'passed', classification: 'retail',
    holdings: { BTC: 5.2, ETH: 180.3, USDT: 890000, SOL: 890 },
  },
  {
    clientId: 'CA-003', orderCount: 156, totalVolumeUsd: 4567120,
    createdAt: '2024-11-03', lastActivity: '2026-06-01',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 45.2, ETH: 312.4, USDT: 560000, SOL: 3420 },
  },
  {
    clientId: 'CA-004', orderCount: 23, totalVolumeUsd: 831925,
    createdAt: '2026-01-18', lastActivity: '2026-05-15',
    kycStatus: 'pending_review', classification: 'retail',
    holdings: { BTC: 8.5, ETH: 145.0, USDT: 210000, SOL: 8450 },
  },
  {
    clientId: 'CA-005', orderCount: 64, totalVolumeUsd: 2103760,
    createdAt: '2025-03-07', lastActivity: '2026-06-02',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 28.8, ETH: 420.6, USDT: 680000, SOL: 2100 },
  },
  {
    clientId: 'CA-006', orderCount: 31, totalVolumeUsd: 512400,
    createdAt: '2025-05-12', lastActivity: '2026-04-20',
    kycStatus: 'passed', classification: 'retail',
    holdings: { BTC: 3.1, ETH: 95.2, USDT: 275000, SOL: 480 },
  },
  {
    clientId: 'CA-007', orderCount: 198, totalVolumeUsd: 6890500,
    createdAt: '2024-09-01', lastActivity: '2026-06-03',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 52.4, ETH: 680.0, USDT: 920000, SOL: 4200 },
  },
  {
    clientId: 'CA-008', orderCount: 15, totalVolumeUsd: 267350,
    createdAt: '2026-02-28', lastActivity: '2026-05-22',
    kycStatus: 're_kyc_required', classification: 'retail',
    holdings: { BTC: 1.8, ETH: 42.0, USDT: 95000, SOL: 320 },
  },
  {
    clientId: 'CA-009', orderCount: 8, totalVolumeUsd: 124800,
    createdAt: '2026-04-10', lastActivity: '2026-05-01',
    kycStatus: 'passed', classification: 'retail',
    holdings: { BTC: 0.9, ETH: 22.0, USDT: 52000, SOL: 180 },
  },
  {
    clientId: 'CA-010', orderCount: 73, totalVolumeUsd: 1876900,
    createdAt: '2025-07-19', lastActivity: '2026-06-01',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 18.6, ETH: 310.5, USDT: 450000, SOL: 2800 },
  },
  {
    clientId: 'CA-011', orderCount: 112, totalVolumeUsd: 3245600,
    createdAt: '2025-01-25', lastActivity: '2026-06-03',
    kycStatus: 'passed', classification: 'professional',
    holdings: { BTC: 35.0, ETH: 560.0, USDT: 780000, SOL: 3500 },
  },
  {
    clientId: 'CA-012', orderCount: 5, totalVolumeUsd: 89200,
    createdAt: '2026-03-14', lastActivity: '2026-03-14',
    kycStatus: 'pending_review', classification: 'retail',
    holdings: { BTC: 0.5, ETH: 8.0, USDT: 35000, SOL: 120 },
  },
];

// ── Client KYC Details (for referral model clients) ──
export interface ClientKYCDetail {
  clientId: string;
  fullName: string;
  idCardType: 'HKID' | 'Passport';
  idCardNumber: string;
  nationality: string;
  countryOfResidence: string;
  address: string;
  dateOfBirth: string;
}

export const clientKYCDetails: ClientKYCDetail[] = [
  { clientId: 'RU-001', fullName: 'Chan Tai Man', idCardType: 'HKID', idCardNumber: 'A1234**(6)', nationality: 'Chinese', countryOfResidence: 'Hong Kong', address: 'Flat 12B, Tower 5, Ocean Shores, Tseung Kwan O, HK', dateOfBirth: '1988-03-15' },
  { clientId: 'RU-002', fullName: 'Wong Siu Ling', idCardType: 'HKID', idCardNumber: 'B5678**(2)', nationality: 'Chinese', countryOfResidence: 'Hong Kong', address: 'Room 2301, Grand Promenade, Sai Wan Ho, HK', dateOfBirth: '1992-07-22' },
  { clientId: 'RU-003', fullName: 'Lee Ka Fai', idCardType: 'Passport', idCardNumber: 'P****5678', nationality: 'Chinese', countryOfResidence: 'Singapore', address: '8 Marina Boulevard, #23-07, Singapore 018981', dateOfBirth: '1985-11-08' },
];

// ── Derived: Omnibus Wallet Balance ──
export function getOmnibusWalletBalance() {
  const totals = { BTC: 0, ETH: 0, USDT: 0, SOL: 0 };
  clients.forEach(c => {
    (Object.keys(totals) as (keyof typeof totals)[]).forEach(asset => {
      totals[asset] += c.holdings[asset];
    });
  });
  const usdValues: Record<string, number> = {};
  let totalUsd = 0;
  (Object.keys(totals) as (keyof typeof totals)[]).forEach(asset => {
    const usd = totals[asset] * ASSET_PRICES[asset];
    usdValues[asset] = usd;
    totalUsd += usd;
  });
  return (Object.keys(totals) as (keyof typeof totals)[]).map(asset => {
    const usd = usdValues[asset];
    return {
      symbol: asset,
      amount: totals[asset],
      usd,
      percent: Math.round((usd / totalUsd) * 1000) / 10,
    };
  });
}

// ── Derived: Clients Holding Each Asset ──
export function getClientsHoldingEachAsset() {
  return (Object.keys(ASSET_PRICES) as string[]).map(asset => ({
    name: asset,
    value: clients.filter(c => c.holdings[asset as keyof typeof c.holdings] > 0).length,
  }));
}

// ── Orders ──
export interface Order {
  orderId: string;
  clientId: string;
  side: 'Buy' | 'Sell';
  asset: string;
  amount: number;
  price: number;
  usd: number;
  status: 'completed' | 'pending_approval';
  placedAt: string;
}

// Simple deterministic PRNG (mulberry32)
function mulberry32(seed: number) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateOrders(): Order[] {
  const assets = ['BTC', 'ETH', 'USDT', 'SOL'] as const;
  const sides: ('Buy' | 'Sell')[] = ['Buy', 'Sell'];
  const orders: Order[] = [];

  // Typical amount ranges per asset
  const amountRanges: Record<string, [number, number]> = {
    BTC: [0.1, 5.0],
    ETH: [5, 100],
    USDT: [5000, 200000],
    SOL: [50, 2000],
  };

  // Price ranges per asset (small variation around market price)
  const priceRange: Record<string, [number, number]> = {
    BTC: [61500, 63600],
    ETH: [1605, 1665],
    USDT: [0.998, 1.001],
    SOL: [63, 68],
  };

  for (const client of clients) {
    const rng = mulberry32(parseInt(client.clientId.replace('CA-', ''), 10) * 1000);

    // Generate orders from oldest to newest
    // Spread across dates from createdAt to 2026-06-03
    const createdMs = new Date(client.createdAt).getTime();
    const nowMs = new Date('2026-06-03T23:59:00').getTime();
    const spanMs = nowMs - createdMs;

    for (let i = 0; i < client.orderCount; i++) {
      const asset = assets[Math.floor(rng() * assets.length)];
      const side = sides[Math.floor(rng() * sides.length)];
      const [lo, hi] = amountRanges[asset];
      const rawAmount = lo + rng() * (hi - lo);
      const amount = asset === 'USDT' ? Math.round(rawAmount / 100) * 100 : Math.round(rawAmount * 100) / 100;
      const [pLo, pHi] = priceRange[asset];
      const price = asset === 'USDT' ? 1.0 : Math.round((pLo + rng() * (pHi - pLo)) * 100) / 100;
      const usd = Math.round(amount * price);

      // Date: distribute with increasing density toward present
      const t = i / client.orderCount; // 0..1 oldest..newest
      const skewed = Math.pow(t, 0.7); // more orders recently
      const orderMs = createdMs + skewed * spanMs;
      const d = new Date(orderMs);
      const pad = (n: number) => String(n).padStart(2, '0');
      const placedAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

      // ~3% pending, only for the most recent 20% of orders
      const isRecent = t > 0.8;
      const status: 'completed' | 'pending_approval' = (isRecent && rng() < 0.06) ? 'pending_approval' : 'completed';

      orders.push({
        orderId: '', // placeholder, assigned after sort
        clientId: client.clientId,
        side,
        asset,
        amount,
        price,
        usd,
        status,
        placedAt,
      });
    }
  }

  // Sort by placedAt ascending (oldest first) to assign ascending IDs
  orders.sort((a, b) => a.placedAt.localeCompare(b.placedAt));

  // Assign ascending order IDs: earliest order gets lowest ID
  const startSeq = 1001;
  orders.forEach((order, idx) => {
    order.orderId = `ORD-${startSeq + idx}`;
  });

  // Reverse to descending (newest first) for default view
  orders.reverse();
  return orders;
}

export const recentOrders: Order[] = generateOrders();

// ── Recent VA Movements ──
export interface VAMovement {
  clientId: string;
  direction: 'Deposit' | 'Withdraw';
  va: string;
  amount: number;
}

export const recentVAMovements: VAMovement[] = [
  { clientId: 'CA-001', direction: 'Deposit',  va: 'BTC',  amount: 2.5 },
  { clientId: 'CA-003', direction: 'Withdraw', va: 'ETH',  amount: 15.8 },
  { clientId: 'CA-005', direction: 'Deposit',  va: 'USDT', amount: 50000 },
  { clientId: 'CA-002', direction: 'Withdraw', va: 'BTC',  amount: 1.2 },
  { clientId: 'CA-004', direction: 'Deposit',  va: 'SOL',  amount: 250 },
];

// ── Large Client Balances ──
export interface LargeBalance {
  clientId: string;
  va: string;
  amount: number;
  usd: number;
}

export const largeBalances: LargeBalance[] = [
  { clientId: 'CA-003', va: 'BTC',  amount: 45.2,   usd: 45.2 * ASSET_PRICES.BTC },
  { clientId: 'CA-001', va: 'ETH',  amount: 520.5,  usd: 520.5 * ASSET_PRICES.ETH },
  { clientId: 'CA-005', va: 'BTC',  amount: 28.8,   usd: 28.8 * ASSET_PRICES.BTC },
  { clientId: 'CA-002', va: 'USDT', amount: 890000, usd: 890000 * ASSET_PRICES.USDT },
  { clientId: 'CA-004', va: 'SOL',  amount: 8450,   usd: 8450 * ASSET_PRICES.SOL },
];

// ── Deposit Addresses ──
export interface DepositAddress {
  id: string;
  address: string;
  clientId: string;
  network: string;
  status: 'active' | 'used';
  lastDeposit: string;
}

export const depositAddresses: DepositAddress[] = [
  { id: 'DA-001', address: 'bc1q...x7k2m', clientId: 'CA-001', network: 'Bitcoin',  status: 'active', lastDeposit: '2026-06-03 14:22' },
  { id: 'DA-002', address: '0x3f...a9c1',   clientId: 'CA-003', network: 'Ethereum', status: 'active', lastDeposit: '2026-06-02 09:15' },
  { id: 'DA-003', address: 'TJ9q...3vN7',   clientId: 'CA-005', network: 'Tron',     status: 'used',   lastDeposit: '2026-05-28 18:40' },
  { id: 'DA-004', address: 'bc1q...p4w8',   clientId: 'CA-007', network: 'Bitcoin',  status: 'active', lastDeposit: '2026-06-01 11:05' },
  { id: 'DA-005', address: '0x7a...d2e4',   clientId: 'CA-002', network: 'Ethereum', status: 'active', lastDeposit: '2026-05-30 16:33' },
  { id: 'DA-006', address: '5Fu...kL9p',   clientId: 'CA-010', network: 'Solana',   status: 'active', lastDeposit: '2026-06-03 08:12' },
];

// ── Latest VA Transactions ──
export interface VATransaction {
  txId: string;
  dir: 'Deposit' | 'Withdraw';
  clientId: string;
  asset: string;
  amount: number;
  status: 'confirming' | 'pending_approval' | 'completed';
  time: string;
}

export const latestVATransactions: VATransaction[] = [
  { txId: 'TX-1001', dir: 'Deposit',  clientId: 'CA-001', asset: 'BTC',  amount: 2.5,    status: 'confirming',       time: '5 min ago' },
  { txId: 'TX-1002', dir: 'Withdraw', clientId: 'CA-003', asset: 'ETH',  amount: 15.8,   status: 'pending_approval', time: '12 min ago' },
  { txId: 'TX-1003', dir: 'Deposit',  clientId: 'CA-005', asset: 'USDT', amount: 50000,  status: 'completed',        time: '18 min ago' },
  { txId: 'TX-1004', dir: 'Deposit',  clientId: 'CA-007', asset: 'SOL',  amount: 320,    status: 'confirming',       time: '25 min ago' },
  { txId: 'TX-1005', dir: 'Withdraw', clientId: 'CA-002', asset: 'BTC',  amount: 1.2,    status: 'completed',        time: '42 min ago' },
  { txId: 'TX-1006', dir: 'Deposit',  clientId: 'CA-010', asset: 'ETH',  amount: 45.0,   status: 'completed',        time: '1 hr ago' },
  { txId: 'TX-1007', dir: 'Withdraw', clientId: 'CA-004', asset: 'USDT', amount: 25000,  status: 'pending_approval', time: '1.5 hr ago' },
  { txId: 'TX-1008', dir: 'Deposit',  clientId: 'CA-011', asset: 'BTC',  amount: 0.75,   status: 'completed',        time: '2 hr ago' },
];

// ── Compliance Items ──
export interface ComplianceAction {
  id: string;
  address: string;
  clientId: string;
  asset: string;
  amount: number;
  issueKey: string;
  severity: 'critical' | 'high' | 'medium';
}

export const complianceActions: ComplianceAction[] = [
  { id: 'DEP-001', address: 'bc1q...x7k2m', clientId: 'CA-001', asset: 'BTC',  amount: 2.5,   issueKey: 'bb.compliance.issue.sanctionsHit', severity: 'critical' },
  { id: 'DEP-002', address: '0x3f...a9c1',   clientId: 'CA-003', asset: 'ETH',  amount: 45.0,  issueKey: 'bb.compliance.issue.pepMatch',      severity: 'high' },
  { id: 'DEP-003', address: 'TJ9q...3vN7',   clientId: 'CA-005', asset: 'USDT', amount: 50000, issueKey: 'bb.compliance.issue.largeTransaction', severity: 'medium' },
];

export interface HistoricalDeposit {
  txId: string;
  address: string;
  clientId: string;
  asset: string;
  amount: number;
  current: 'cleared' | 'flagged' | 'under_review';
  flaggedLater: boolean;
  flagDate?: string;
}

export const historicalDeposits: HistoricalDeposit[] = [
  { txId: 'TX-0981', address: 'bc1q...m3p7', clientId: 'CA-004', asset: 'BTC',  amount: 1.8,    current: 'flagged',       flaggedLater: true, flagDate: '2026-05-30' },
  { txId: 'TX-0972', address: '0x5c...e8b2', clientId: 'CA-008', asset: 'ETH',  amount: 22.0,   current: 'flagged',       flaggedLater: true, flagDate: '2026-06-01' },
  { txId: 'TX-0965', address: 'TJ4k...1vR3', clientId: 'CA-001', asset: 'USDT', amount: 15000,  current: 'cleared',        flaggedLater: false },
  { txId: 'TX-0954', address: 'bc1q...n8w1', clientId: 'CA-009', asset: 'BTC',  amount: 0.45,   current: 'cleared',        flaggedLater: false },
  { txId: 'TX-0948', address: '0xa2...f1d9', clientId: 'CA-003', asset: 'ETH',  amount: 130.0,  current: 'cleared',        flaggedLater: false },
  { txId: 'TX-0940', address: '5Kj...tR2m',  clientId: 'CA-007', asset: 'SOL',  amount: 580,    current: 'cleared',        flaggedLater: false },
  { txId: 'TX-0933', address: 'bc1q...q4e9', clientId: 'CA-011', asset: 'BTC',  amount: 3.2,    current: 'under_review',   flaggedLater: true, flagDate: '2026-06-02' },
];

// ── Storage Split ──
export const COLD_PCT = 98;
export const HOT_PCT = 2;

// ── Referral Account Mock Data ──

export interface ReferredClient {
  clientId: string;       // anonymized, no name
  kycStatus: 'passed' | 'pending' | 're_kyc_required';
  accountStatus: 'active' | 'pending' | 'suspended';
  totalVolumeUsd: number;
  orderCount: number;
  referredAt: string;
  lastActivity: string;
}

export const referredClients: ReferredClient[] = [
  { clientId: 'RU-001', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 125420, orderCount: 34, referredAt: '2026-01-15', lastActivity: '2026-06-03' },
  { clientId: 'RU-002', kycStatus: 'pending', accountStatus: 'pending', totalVolumeUsd: 0, orderCount: 0, referredAt: '2026-03-20', lastActivity: '2026-03-20' },
  { clientId: 'RU-003', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 89230, orderCount: 21, referredAt: '2026-02-01', lastActivity: '2026-06-01' },
  { clientId: 'RU-004', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 254890, orderCount: 56, referredAt: '2025-11-10', lastActivity: '2026-06-05' },
  { clientId: 'RU-005', kycStatus: 're_kyc_required', accountStatus: 'suspended', totalVolumeUsd: 4200, orderCount: 3, referredAt: '2026-04-05', lastActivity: '2026-05-12' },
  { clientId: 'RU-006', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 178500, orderCount: 42, referredAt: '2025-12-08', lastActivity: '2026-06-04' },
  { clientId: 'RU-007', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 62300, orderCount: 15, referredAt: '2026-03-15', lastActivity: '2026-05-28' },
  { clientId: 'RU-008', kycStatus: 'pending', accountStatus: 'pending', totalVolumeUsd: 0, orderCount: 0, referredAt: '2026-05-22', lastActivity: '2026-05-22' },
  { clientId: 'RU-009', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 312800, orderCount: 78, referredAt: '2025-09-14', lastActivity: '2026-06-06' },
  { clientId: 'RU-010', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 97650, orderCount: 28, referredAt: '2026-01-28', lastActivity: '2026-06-02' },
  { clientId: 'RU-011', kycStatus: 'passed', accountStatus: 'active', totalVolumeUsd: 445100, orderCount: 112, referredAt: '2025-07-20', lastActivity: '2026-06-07' },
  { clientId: 'RU-012', kycStatus: 're_kyc_required', accountStatus: 'suspended', totalVolumeUsd: 8900, orderCount: 5, referredAt: '2026-04-18', lastActivity: '2026-05-01' },
];

export interface RevenueSettlement {
  period: string;
  tradingFeeRevenue: number;
  signupBonuses: number;
  firstTradeBonuses: number;
  volumeBonuses: number;
  totalRevenue: number;
  settledAmount: number;
  settlementDate: string;
  settlementStatus: 'settled' | 'pending' | 'processing';
  bankRef?: string;
}

export const revenueSettlements: RevenueSettlement[] = [
  { period: '2026-05', tradingFeeRevenue: 8450, signupBonuses: 600, firstTradeBonuses: 800, volumeBonuses: 1000, totalRevenue: 10850, settledAmount: 10850, settlementDate: '2026-06-05', settlementStatus: 'settled', bankRef: 'BNK-20260605-001' },
  { period: '2026-04', tradingFeeRevenue: 7230, signupBonuses: 450, firstTradeBonuses: 600, volumeBonuses: 800, totalRevenue: 9080, settledAmount: 9080, settlementDate: '2026-05-05', settlementStatus: 'settled', bankRef: 'BNK-20260505-001' },
  { period: '2026-03', tradingFeeRevenue: 6100, signupBonuses: 300, firstTradeBonuses: 400, volumeBonuses: 600, totalRevenue: 7400, settledAmount: 7400, settlementDate: '2026-04-05', settlementStatus: 'settled', bankRef: 'BNK-20260405-001' },
  { period: '2026-02', tradingFeeRevenue: 5200, signupBonuses: 250, firstTradeBonuses: 300, volumeBonuses: 400, totalRevenue: 6150, settledAmount: 6150, settlementDate: '2026-03-05', settlementStatus: 'settled', bankRef: 'BNK-20260305-001' },
  { period: '2026-01', tradingFeeRevenue: 4800, signupBonuses: 200, firstTradeBonuses: 200, volumeBonuses: 200, totalRevenue: 5400, settledAmount: 5400, settlementDate: '2026-02-05', settlementStatus: 'settled', bankRef: 'BNK-20260205-001' },
  { period: '2026-06', tradingFeeRevenue: 3200, signupBonuses: 150, firstTradeBonuses: 100, volumeBonuses: 0, totalRevenue: 3450, settledAmount: 0, settlementDate: '', settlementStatus: 'pending' },
];

export interface ReferralOrder {
  orderId: string;
  clientId: string;       // anonymized
  side: 'Buy' | 'Sell';
  asset: string;
  amount: number;
  usd: number;
  status: 'completed' | 'pending' | 'cancelled';
  placedAt: string;
}

export const referralOrders: ReferralOrder[] = [
  { orderId: 'RO-4501', clientId: 'RU-004', side: 'Sell', asset: 'USDT', amount: 15000, usd: 15000,   status: 'completed', placedAt: '2026-06-06 08:15' },
  { orderId: 'RO-4502', clientId: 'RU-011', side: 'Buy',  asset: 'ETH',  amount: 80.0,  usd: 130790,  status: 'completed', placedAt: '2026-06-06 10:40' },
  { orderId: 'RO-4503', clientId: 'RU-007', side: 'Sell', asset: 'SOL',  amount: 200,   usd: 13084,   status: 'completed', placedAt: '2026-06-06 12:05' },
  { orderId: 'RO-4504', clientId: 'RU-010', side: 'Buy',  asset: 'BTC',  amount: 0.50,  usd: 31270,   status: 'cancelled', placedAt: '2026-06-06 14:10' },
  { orderId: 'RO-4505', clientId: 'RU-003', side: 'Buy',  asset: 'ETH',  amount: 22.0,  usd: 35967,   status: 'completed', placedAt: '2026-06-06 16:30' },
  { orderId: 'RO-4506', clientId: 'RU-006', side: 'Sell', asset: 'BTC',  amount: 0.85,  usd: 53158,   status: 'completed', placedAt: '2026-06-07 09:50' },
  { orderId: 'RO-4507', clientId: 'RU-001', side: 'Buy',  asset: 'USDT', amount: 25000, usd: 25000,   status: 'completed', placedAt: '2026-06-07 10:20' },
  { orderId: 'RO-4508', clientId: 'RU-009', side: 'Buy',  asset: 'SOL',  amount: 500,   usd: 32710,   status: 'completed', placedAt: '2026-06-07 11:45' },
  { orderId: 'RO-4509', clientId: 'RU-011', side: 'Sell', asset: 'ETH',  amount: 45.0,  usd: 73569,   status: 'completed', placedAt: '2026-06-07 13:15' },
  { orderId: 'RO-4510', clientId: 'RU-004', side: 'Buy',  asset: 'BTC',  amount: 1.25,  usd: 78174,   status: 'completed', placedAt: '2026-06-07 14:32' },
];

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  isPrimary: boolean;
  status: 'active' | 'pending_verification';
}

export const bankAccounts: BankAccount[] = [
  { id: 'BA-001', bankName: 'HSBC', accountNumber: '****-****-4521', accountName: 'FI Referral Corp', currency: 'USD', isPrimary: true, status: 'active' },
  { id: 'BA-002', bankName: 'Bank of China (HK)', accountNumber: '****-****-8873', accountName: 'FI Referral Corp', currency: 'HKD', isPrimary: false, status: 'pending_verification' },
];

// ── Storage Split ──
export function getStorageBreakdown() {
  const wallet = getOmnibusWalletBalance();
  const totalUsd = wallet.reduce((s, w) => s + w.usd, 0);
  return {
    cold: {
      totalUsd: totalUsd * COLD_PCT / 100,
      assets: wallet.map(w => ({
        asset: w.symbol,
        amount: w.amount * COLD_PCT / 100,
        usd: w.usd * COLD_PCT / 100,
      })),
    },
    hot: {
      totalUsd: totalUsd * HOT_PCT / 100,
      assets: wallet.map(w => ({
        asset: w.symbol,
        amount: w.amount * HOT_PCT / 100,
        usd: w.usd * HOT_PCT / 100,
      })),
    },
  };
}