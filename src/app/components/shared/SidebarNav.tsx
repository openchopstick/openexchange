import { ChevronRight, LucideIcon } from 'lucide-react';
import { useLanguage } from '../../shared/LanguageContext';

interface NavItem {
  id: string;
  label?: string;
  labelKey?: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface SidebarNavProps {
  items: NavItem[];
  activeId: string;
  onItemClick: (id: string) => void;
}

export function SidebarNav({ items, activeId, onItemClick }: SidebarNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="p-4">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        const label = item.labelKey ? t(item.labelKey) : item.label ?? '';

        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 ${
              isActive
                ? 'bg-white border border-[#0A84FF] text-[#0A84FF]'
                : 'text-[#6E6E73] hover:bg-[#F5F5F7]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm flex-1 text-left" style={{ fontWeight: isActive ? 600 : 400 }}>
              {label}
            </span>
            {item.badge !== undefined && (
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
  );
}
