import { CheckCircle2, XCircle, Clock, AlertCircle, LucideIcon } from 'lucide-react';

type BadgeColor = 'blue' | 'green' | 'amber' | 'red' | 'gray';

interface StatusBadgeProps {
  color: BadgeColor;
  text: string;
  icon?: 'check' | 'x' | 'clock' | 'alert' | LucideIcon;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ color, text, icon, size = 'md' }: StatusBadgeProps) {
  const colors: Record<BadgeColor, string> = {
    blue: 'bg-white border border-[#0A84FF] text-[#0A84FF]',
    green: 'bg-white border border-[#34C759] text-[#34C759]',
    amber: 'bg-white border border-[#FF9F0A] text-[#FF9F0A]',
    red: 'bg-white border border-[#FF3B30] text-[#FF3B30]',
    gray: 'bg-white border border-[#6E6E73] text-[#6E6E73]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconMap = {
    check: CheckCircle2,
    x: XCircle,
    clock: Clock,
    alert: AlertCircle,
  };

  let IconComponent: LucideIcon | null = null;
  if (icon) {
    if (typeof icon === 'string') {
      IconComponent = iconMap[icon];
    } else {
      IconComponent = icon;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${colors[color]} ${sizes[size]} rounded-lg`}>
      {IconComponent && <IconComponent className={iconSizes[size]} />}
      {text}
    </span>
  );
}
