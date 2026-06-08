import { useLanguage } from '../shared/LanguageContext';

const buyOrders = [
  { price: 43520, amount: 0.245, total: 10662.40 },
  { price: 43515, amount: 1.852, total: 80589.78 },
  { price: 43510, amount: 0.684, total: 29760.84 },
  { price: 43505, amount: 2.145, total: 93317.23 },
  { price: 43500, amount: 0.928, total: 40368.00 },
];

const sellOrders = [
  { price: 43525, amount: 0.842, total: 36648.05 },
  { price: 43530, amount: 1.234, total: 53715.62 },
  { price: 43535, amount: 0.567, total: 24844.35 },
  { price: 43540, amount: 2.891, total: 125871.14 },
  { price: 43545, amount: 0.423, total: 18419.54 },
];

export function OrderBook() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-[#E5E5EA]">
        <div className="text-xs text-[#6E6E73]">{t('trade.ob.price')}</div>
        <div className="text-xs text-[#6E6E73] text-right">{t('trade.ob.amount')}</div>
        <div className="text-xs text-[#6E6E73] text-right">{t('trade.ob.totalUsd')}</div>
      </div>

      <div className="flex-1 overflow-auto">
        {sellOrders.reverse().map((order, i) => (
          <div
            key={`sell-${i}`}
            className="grid grid-cols-3 gap-4 px-4 py-2 hover:bg-[#F5F5F7] transition-colors relative"
          >
            <div className="absolute inset-0 bg-[#FF3B30] opacity-5" style={{ width: `${(order.amount / 3) * 100}%` }}></div>
            <div className="text-sm text-[#FF3B30] relative z-10">{order.price.toLocaleString()}</div>
            <div className="text-sm text-[#1D1D1F] text-right relative z-10">{order.amount.toFixed(3)}</div>
            <div className="text-sm text-[#6E6E73] text-right relative z-10">{order.total.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
        ))}

        <div className="px-4 py-3 bg-[#F5F5F7] border-y border-[#E5E5EA]">
          <div className="text-lg text-[#34C759]">43,520.00</div>
          <div className="text-xs text-[#6E6E73]">{t('trade.ob.lastPrice')}</div>
        </div>

        {buyOrders.map((order, i) => (
          <div
            key={`buy-${i}`}
            className="grid grid-cols-3 gap-4 px-4 py-2 hover:bg-[#F5F5F7] transition-colors relative"
          >
            <div className="absolute inset-0 bg-[#34C759] opacity-5" style={{ width: `${(order.amount / 3) * 100}%` }}></div>
            <div className="text-sm text-[#34C759] relative z-10">{order.price.toLocaleString()}</div>
            <div className="text-sm text-[#1D1D1F] text-right relative z-10">{order.amount.toFixed(3)}</div>
            <div className="text-sm text-[#6E6E73] text-right relative z-10">{order.total.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
