import { useState } from 'react';
import { useLanguage } from '../shared/LanguageContext';

export function TradePanel() {
  const { t } = useLanguage();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('43520');

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 border-b border-[#E5E5EA]">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            side === 'buy'
              ? 'bg-[#34C759] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E5E5EA]'
          }`}
        >
          {t('trade.panel.buy')}
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            side === 'sell'
              ? 'bg-[#FF3B30] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E5E5EA]'
          }`}
        >
          {t('trade.panel.sell')}
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
          <label className="block text-sm text-[#6E6E73] mb-2">{t('trade.panel.priceUsd')}</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-[#6E6E73] mb-2">{t('trade.panel.amountBtc')}</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
            placeholder="0.000"
          />
          <div className="flex gap-2 mt-2">
            {['25%', '50%', '75%', '100%'].map((pct) => (
              <button
                key={pct}
                className="flex-1 py-1.5 text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-lg hover:bg-[#E5E5EA] transition-colors"
              >
                {pct}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5EA]">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#6E6E73]">{t('trade.panel.available')}</span>
            <span className="text-sm text-[#1D1D1F]">12,450.00 USD</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-[#6E6E73]">{t('trade.panel.total')}</span>
            <span className="text-sm text-[#1D1D1F]">
              {amount && price ? (parseFloat(amount) * parseFloat(price)).toLocaleString(undefined, {maximumFractionDigits: 2}) : '0.00'} USD
            </span>
          </div>
        </div>

        <button
          className={`w-full py-4 rounded-xl text-white shadow-sm transition-all hover:opacity-90 ${
            side === 'buy' ? 'bg-[#34C759]' : 'bg-[#FF3B30]'
          }`}
        >
          {side === 'buy' ? t('trade.panel.buyBtc') : t('trade.panel.sellBtc')}
        </button>
      </div>
    </div>
  );
}
