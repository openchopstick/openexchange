import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { time: '09:00', price: 42150 },
  { time: '10:00', price: 42380 },
  { time: '11:00', price: 42210 },
  { time: '12:00', price: 42560 },
  { time: '13:00', price: 42890 },
  { time: '14:00', price: 42720 },
  { time: '15:00', price: 43100 },
  { time: '16:00', price: 43280 },
  { time: '17:00', price: 43150 },
  { time: '18:00', price: 43420 },
  { time: '19:00', price: 43680 },
  { time: '20:00', price: 43520 },
];

export function TradingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          stroke="#6E6E73"
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6E6E73"
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 200', 'dataMax + 200']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#0A84FF"
          strokeWidth={2}
          fill="url(#priceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
