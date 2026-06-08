import { useState } from 'react';
import { BeanIcon } from './BeanIcon';
import {
  TrendingUp,
  Wallet,
  User,
  BarChart3,
  Upload,
  Camera,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  AlertCircle,
  Info,
} from 'lucide-react';

type Screen = 'kyc-intro' | 'kyc-id' | 'kyc-liveness' | 'kyc-classification' | 'kyc-suitability' | 'markets' | 'trade' | 'wallet' | 'account';

interface MobileH5ViewProps {
  onBack?: () => void;
}

export function MobileH5View({ onBack }: MobileH5ViewProps = {}) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('kyc-intro');
  const [activeTab, setActiveTab] = useState<'markets' | 'trade' | 'wallet' | 'account'>('trade');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'kyc-intro':
        return (
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white border border-[#0A84FF] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#0A84FF]" />
              </div>
              <h2 className="text-xl text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>
                Complete Your KYC
              </h2>
              <p className="text-sm text-[#6E6E73] mb-8">
                To comply with Hong Kong SFC regulations, please complete your identity verification and investor classification.
              </p>
              <div className="w-full space-y-3 mb-6">
                <div className="flex items-start gap-3 p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="w-6 h-6 bg-[#0A84FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>1</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>Identity Verification</div>
                    <div className="text-xs text-[#6E6E73]">Upload ID and complete liveness check</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="w-6 h-6 bg-[#0A84FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>2</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>Investor Classification</div>
                    <div className="text-xs text-[#6E6E73]">Retail or Professional Investor status</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="w-6 h-6 bg-[#0A84FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>3</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>Suitability Assessment</div>
                    <div className="text-xs text-[#6E6E73]">Risk profile and investment experience</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('kyc-id')}
              className="w-full py-4 bg-[#0A84FF] text-white rounded-xl"
              style={{ fontWeight: 600 }}
            >
              Start KYC Process
            </button>
          </div>
        );

      case 'kyc-id':
        return (
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#E5E5EA] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#E5E5EA] rounded-full"></div>
              </div>
              <div className="text-xs text-[#6E6E73]">Step 1 of 3</div>
            </div>

            <h2 className="text-xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
              Upload Your ID
            </h2>
            <p className="text-sm text-[#6E6E73] mb-6">
              Please upload a clear photo of your Hong Kong ID card or passport.
            </p>

            <div className="flex-1">
              <div className="border-2 border-dashed border-[#E5E5EA] rounded-xl p-8 text-center mb-4">
                <Upload className="w-12 h-12 text-[#6E6E73] mx-auto mb-4" />
                <div className="text-sm text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
                  Upload ID Document
                </div>
                <div className="text-xs text-[#6E6E73] mb-4">
                  Accepted: HKID, Passport
                </div>
                <button className="px-6 py-2.5 bg-[#0A84FF] text-white rounded-lg text-sm">
                  Choose File
                </button>
              </div>

              <div className="bg-white border border-[#0A84FF] rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#1D1D1F]">
                  Ensure all text is clearly visible and the document is not expired.
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('kyc-liveness')}
              className="w-full py-4 bg-[#0A84FF] text-white rounded-xl"
              style={{ fontWeight: 600 }}
            >
              Continue
            </button>
          </div>
        );

      case 'kyc-liveness':
        return (
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#E5E5EA] rounded-full"></div>
              </div>
              <div className="text-xs text-[#6E6E73]">Step 2 of 3</div>
            </div>

            <h2 className="text-xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
              Liveness Check
            </h2>
            <p className="text-sm text-[#6E6E73] mb-8">
              Please position your face within the frame and follow the on-screen instructions.
            </p>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-64 h-80 border-4 border-[#0A84FF] rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden bg-gradient-to-b from-[#0A84FF]/5 to-[#0A84FF]/10">
                <Camera className="w-16 h-16 text-[#0A84FF]" />
                <div className="absolute top-4 left-4 right-4 text-center">
                  <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                    <div className="text-xs text-[#1D1D1F]" style={{ fontWeight: 600 }}>Position your face</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#6E6E73] text-center mb-2">
                Make sure you're in a well-lit area
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('kyc-classification')}
              className="w-full py-4 bg-[#0A84FF] text-white rounded-xl"
              style={{ fontWeight: 600 }}
            >
              Start Liveness Check
            </button>
          </div>
        );

      case 'kyc-classification':
        return (
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
                <div className="flex-1 h-1.5 bg-[#0A84FF] rounded-full"></div>
              </div>
              <div className="text-xs text-[#6E6E73]">Step 3 of 3</div>
            </div>

            <h2 className="text-xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
              Investor Classification
            </h2>
            <p className="text-sm text-[#6E6E73] mb-6">
              Under SFC regulations, please select your investor type.
            </p>

            <div className="flex-1 space-y-4 mb-6">
              <button className="w-full p-5 border-2 border-[#E5E5EA] rounded-xl hover:border-[#0A84FF] transition-all text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    Retail Investor
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#E5E5EA]"></div>
                </div>
                <div className="text-xs text-[#6E6E73] leading-relaxed">
                  Individual investors without professional investor qualifications. Standard risk warnings and protections apply.
                </div>
              </button>

              <button className="w-full p-5 border-2 border-[#E5E5EA] rounded-xl hover:border-[#0A84FF] transition-all text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                    Professional Investor
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#E5E5EA]"></div>
                </div>
                <div className="text-xs text-[#6E6E73] leading-relaxed mb-3">
                  Qualified under SFC rules: portfolio ≥ HK$8M or financial institution.
                </div>
                <div className="px-3 py-1.5 bg-white border border-[#FF9F0A] text-[#FF9F0A] text-xs rounded-lg inline-block">
                  Documentation required
                </div>
              </button>
            </div>

            <button
              onClick={() => setCurrentScreen('kyc-suitability')}
              className="w-full py-4 bg-[#0A84FF] text-white rounded-xl"
              style={{ fontWeight: 600 }}
            >
              Continue
            </button>
          </div>
        );

      case 'kyc-suitability':
        return (
          <div className="flex-1 flex flex-col p-6">
            <h2 className="text-xl text-[#1D1D1F] mb-2" style={{ fontWeight: 600 }}>
              Suitability Assessment
            </h2>
            <p className="text-sm text-[#6E6E73] mb-6">
              Help us understand your investment experience and risk tolerance.
            </p>

            <div className="flex-1 overflow-auto space-y-5">
              <div>
                <label className="block text-sm text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>
                  Investment Experience
                </label>
                <div className="space-y-2">
                  {['No experience', 'Less than 1 year', '1-3 years', 'More than 3 years'].map((option) => (
                    <button
                      key={option}
                      className="w-full p-3 border border-[#E5E5EA] rounded-xl text-left text-sm text-[#1D1D1F] hover:border-[#0A84FF] transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>
                  Risk Tolerance
                </label>
                <div className="space-y-2">
                  {['Conservative', 'Moderate', 'Aggressive'].map((option) => (
                    <button
                      key={option}
                      className="w-full p-3 border border-[#E5E5EA] rounded-xl text-left text-sm text-[#1D1D1F] hover:border-[#0A84FF] transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>
                  Annual Income (HKD)
                </label>
                <div className="space-y-2">
                  {['< 500K', '500K - 1M', '1M - 5M', '> 5M'].map((option) => (
                    <button
                      key={option}
                      className="w-full p-3 border border-[#E5E5EA] rounded-xl text-left text-sm text-[#1D1D1F] hover:border-[#0A84FF] transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentScreen('trade');
                setActiveTab('trade');
              }}
              className="w-full py-4 bg-[#0A84FF] text-white rounded-xl mt-6"
              style={{ fontWeight: 600 }}
            >
              Complete KYC
            </button>
          </div>
        );

      case 'markets':
        return (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[#E5E5EA]">
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm"
              />
            </div>
            <div className="flex-1 overflow-auto">
              {[
                { symbol: 'BTC', name: 'Bitcoin', price: 43520, change: 2.45 },
                { symbol: 'ETH', name: 'Ethereum', price: 2280, change: 3.21 },
                { symbol: 'SOL', name: 'Solana', price: 98.45, change: -1.28 },
                { symbol: 'BNB', name: 'Binance Coin', price: 315.20, change: 1.85 },
              ].map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => setActiveTab('trade')}
                  className="w-full p-4 border-b border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{market.symbol}</div>
                      <div className="text-xs text-[#6E6E73]">{market.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        ${market.price.toLocaleString()}
                      </div>
                      <div className={`text-xs ${market.change >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                        {market.change >= 0 ? '+' : ''}{market.change}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'trade':
        return (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-white border-b border-[#E5E5EA]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>$43,520</span>
                <span className="text-sm text-[#34C759]">+2.45%</span>
              </div>
              <div className="text-xs text-[#6E6E73]">BTC/USD</div>
            </div>

            <div className="h-48 bg-gradient-to-b from-[#0A84FF]/5 to-white border-b border-[#E5E5EA] flex items-center justify-center">
              <div className="text-xs text-[#6E6E73]">Price Chart</div>
            </div>

            <div className="flex-1 p-4">
              <div className="flex gap-2 mb-4">
                <button className="flex-1 py-2.5 bg-[#34C759] text-white rounded-xl text-sm" style={{ fontWeight: 600 }}>
                  Buy
                </button>
                <button className="flex-1 py-2.5 bg-[#F5F5F7] text-[#6E6E73] rounded-xl text-sm" style={{ fontWeight: 600 }}>
                  Sell
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#6E6E73] mb-2">Order Type</label>
                  <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm">
                    <option>Market Order</option>
                    <option>Limit Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#6E6E73] mb-2">Amount (BTC)</label>
                  <input
                    type="text"
                    placeholder="0.000"
                    className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    {['25%', '50%', '75%', '100%'].map((pct) => (
                      <button
                        key={pct}
                        className="flex-1 py-1.5 text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-lg"
                      >
                        {pct}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E5EA]">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#6E6E73]">Available</span>
                    <span className="text-[#1D1D1F]">12,450.00 USD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6E6E73]">Estimated Total</span>
                    <span className="text-[#1D1D1F]" style={{ fontWeight: 600 }}>0.00 BTC</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-[#34C759] text-white rounded-xl mt-4" style={{ fontWeight: 600 }}>
                Buy BTC
              </button>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="flex-1 flex flex-col">
            <div className="p-6 bg-gradient-to-br from-[#0A84FF] to-[#0A84FF]/80 text-white">
              <div className="text-sm mb-2 opacity-90">Total Balance</div>
              <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>$24,856.42</div>
              <div className="text-sm opacity-90">≈ 0.571 BTC</div>
            </div>

            <div className="flex gap-3 p-4 border-b border-[#E5E5EA]">
              <button className="flex-1 py-3 bg-[#34C759] text-white rounded-xl text-sm flex items-center justify-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                Deposit
              </button>
              <button className="flex-1 py-3 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-sm flex items-center justify-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Withdraw
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <h3 className="text-sm text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>Assets</h3>
              <div className="space-y-2">
                {[
                  { symbol: 'BTC', name: 'Bitcoin', amount: 0.245, value: 10662.40 },
                  { symbol: 'ETH', name: 'Ethereum', amount: 4.52, value: 10305.60 },
                  { symbol: 'USDT', name: 'Tether', amount: 3888.42, value: 3888.42 },
                ].map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-sm" style={{ fontWeight: 600 }}>{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>{asset.symbol}</div>
                        <div className="text-xs text-[#6E6E73]">{asset.amount} {asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                        ${asset.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-[#1D1D1F] mb-3" style={{ fontWeight: 600 }}>
                  Whitelisted Addresses
                </h3>
                <div className="bg-white border border-[#FF9F0A] rounded-xl p-4 flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#1D1D1F]">
                    For security, you can only withdraw to pre-approved addresses. Travel Rule information required.
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-[#E5E5EA] rounded-xl text-sm text-[#6E6E73] flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Whitelisted Address
                </button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl mb-6">
              <div className="w-16 h-16 bg-[#0A84FF] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-base text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>John Doe</div>
                <div className="text-xs text-[#6E6E73]">john.doe@email.com</div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#34C759] text-[#34C759] text-xs rounded mt-2">
                  <CheckCircle2 className="w-3 h-3" />
                  KYC Verified
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                'Account Settings',
                'Security & Privacy',
                'Payment Methods',
                'Transaction History',
                'Referral Program',
                'Help & Support',
                'Terms of Service',
              ].map((item) => (
                <button
                  key={item}
                  className="w-full p-4 bg-white border border-[#E5E5EA] rounded-xl text-left text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="w-full py-3 mt-6 text-sm text-[#FF3B30]">
              Sign Out
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const showBottomNav = !currentScreen.startsWith('kyc');

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-8">
      {onBack && (
        <div className="w-full max-w-4xl mb-4">
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-white border border-[#E5E5EA] rounded-xl hover:bg-[#F5F5F7] transition-colors text-sm text-[#1D1D1F]"
          >
            ← Back to SC Securities Dashboard
          </button>
        </div>
      )}
      <div className="relative">
        <div className="w-[390px] h-[844px] bg-[#1D1D1F] rounded-[3rem] p-3 shadow-2xl">
          <div className="w-32 h-7 bg-[#1D1D1F] rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-20"></div>

          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
            <div className="bg-white border-b border-[#E5E5EA] px-4 pt-3 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BeanIcon className="w-6 h-6" />
                <span className="text-base text-[#1D1D1F]" style={{ fontWeight: 600 }}>BeanExchange</span>
              </div>
              <div className="text-[10px] text-[#6E6E73] text-center">
                Powered by BeanExchange · Referred by SC Securities
              </div>
            </div>

            {renderScreen()}

            {showBottomNav && (
              <div className="border-t border-[#E5E5EA] bg-white">
                <div className="flex items-center justify-around px-2 py-2">
                  {[
                    { id: 'markets' as const, label: 'Markets', icon: BarChart3 },
                    { id: 'trade' as const, label: 'Trade', icon: TrendingUp },
                    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
                    { id: 'account' as const, label: 'Account', icon: User },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setCurrentScreen(tab.id);
                        }}
                        className="flex flex-col items-center gap-1 px-4 py-2"
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#0A84FF]' : 'text-[#6E6E73]'}`} />
                        <span className={`text-[10px] ${isActive ? 'text-[#0A84FF]' : 'text-[#6E6E73]'}`} style={{ fontWeight: isActive ? 600 : 400 }}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setCurrentScreen('kyc-intro')}
            className="px-4 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            KYC Flow
          </button>
          <button
            onClick={() => {
              setCurrentScreen('markets');
              setActiveTab('markets');
            }}
            className="px-4 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            Trading App
          </button>
        </div>
      </div>
    </div>
  );
}
