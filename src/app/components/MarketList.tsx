import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';

const markets = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43520, change: 2.45, volume: '28.5B' },
  { symbol: 'ETH', name: 'Ethereum', price: 2280, change: 3.21, volume: '12.3B' },
  { symbol: 'SOL', name: 'Solana', price: 98.45, change: -1.28, volume: '2.1B' },
  { symbol: 'BNB', name: 'Binance Coin', price: 315.20, change: 1.85, volume: '1.8B' },
  { symbol: 'XRP', name: 'Ripple', price: 0.58, change: -0.95, volume: '1.5B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.48, change: 4.12, volume: '890M' },
];

export function MarketList() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#E5E5EA]">
        <h3 className="text-sm text-[#6E6E73]">{t('trade.markets')}</h3>
      </div>

      <div className="flex-1 overflow-auto">
        {markets.map((market) => (
          <button
            key={market.symbol}
            className="w-full px-4 py-3 hover:bg-[#F5F5F7] transition-colors border-b border-[#E5E5EA] text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1D1D1F]">{market.symbol}</span>
                  <span className="text-xs text-[#6E6E73]">{market.name}</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-0.5">{t('trade.vol')} {market.volume}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#1D1D1F]">${market.price.toLocaleString()}</div>
                <div className={`flex items-center gap-1 text-xs justify-end ${
                  market.change >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'
                }`}>
                  {market.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(market.change)}%
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
