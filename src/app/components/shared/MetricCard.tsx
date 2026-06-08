interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'default' | 'green' | 'red' | 'amber' | 'blue';
  onClick?: () => void;
}

export function MetricCard({ label, value, subtitle, color = 'default', onClick }: MetricCardProps) {
  const valueColors = {
    default: 'text-[#1D1D1F]',
    green: 'text-[#34C759]',
    red: 'text-[#FF3B30]',
    amber: 'text-[#FF9F0A]',
    blue: 'text-[#0A84FF]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''
      }`}
    >
      <div className="text-sm text-[#6E6E73] mb-3">{label}</div>
      <div className={`text-4xl mb-2 ${valueColors[color]}`} style={{ fontWeight: 600 }}>
        {value}
      </div>
      {subtitle && <div className="text-sm text-[#6E6E73]">{subtitle}</div>}
    </div>
  );
}
