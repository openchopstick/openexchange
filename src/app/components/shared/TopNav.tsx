import { BeanIcon } from '../BeanIcon';
import { Bell, Settings, LogOut } from 'lucide-react';
import { LanguageToggle } from '../LanguageToggle';
import { useLanguage } from '../../shared/LanguageContext';

interface TopNavProps {
  title: string;
  subtitle?: string;
  badge?: { text: string; color: 'blue' | 'green' | 'amber' | 'red' };
  rightContent?: React.ReactNode;
  onSwitchRole: () => void;
}

export function TopNav({ title, subtitle, badge, rightContent, onSwitchRole }: TopNavProps) {
  const { t } = useLanguage();
  const badgeColors = {
    blue: 'bg-white border border-[#0A84FF] text-[#0A84FF]',
    green: 'bg-white border border-[#34C759] text-[#34C759]',
    amber: 'bg-white border border-[#FF9F0A] text-[#FF9F0A]',
    red: 'bg-white border border-[#FF3B30] text-[#FF3B30]',
  };

  return (
    <header className="bg-white border-b border-[#E5E5EA] px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BeanIcon className="w-10 h-10" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                {title}
              </h1>
              {badge && (
                <span className={`px-2.5 py-1 ${badgeColors[badge.color]} text-xs rounded-lg`} style={{ fontWeight: 600 }}>
                  {badge.text}
                </span>
              )}
            </div>
            {subtitle && <div className="text-sm text-[#6E6E73]">{subtitle}</div>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rightContent}
          <button className="p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors">
            <Bell className="w-5 h-5 text-[#6E6E73]" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors">
            <Settings className="w-5 h-5 text-[#6E6E73]" />
          </button>
          <LanguageToggle />
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-all"
          >
            <LogOut className="w-4 h-4 text-[#6E6E73]" />
            <span className="text-sm text-[#1D1D1F]">{t('common.switchRole')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
