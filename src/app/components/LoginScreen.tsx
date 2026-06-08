import { useState } from 'react';
import { BeanIcon } from './BeanIcon';
import { Building2, Settings, Shield, Share2 } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

type Role = 'beanbank' | 'fi-referral' | 'admin' | null;

interface RoleOption {
  id: Role;
  title: string;
  subtitle: string;
  icon: typeof Building2;
}

const roles: RoleOption[] = [
  {
    id: 'beanbank',
    title: 'BeanBank',
    subtitle: 'Omnibus Model (API)',
    icon: Building2,
  },
  {
    id: 'fi-referral',
    title: 'FI Referral',
    subtitle: 'Referral Model (Lightweight)',
    icon: Share2,
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'BeanExchange Ops',
    icon: Settings,
  },
];

export function LoginScreen({ onLogin }: { onLogin: (role: 'beanbank' | 'fi-referral' | 'admin') => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole as 'beanbank' | 'fi-referral' | 'admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <LanguageToggle floating />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <BeanIcon className="w-16 h-16 mb-4" />
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-[#1D1D1F]" style={{ fontWeight: 600 }}>
                BeanExchange
              </span>
            </div>
            <h1 className="text-xl text-[#1D1D1F] mb-1" style={{ fontWeight: 600 }}>
              {t('welcome')}
            </h1>
            <p className="text-sm text-[#6E6E73] text-center">
              {t('subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#6E6E73] mb-3">{t('selectRole')}</label>
              <div className="space-y-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left bg-white ${
                        isSelected
                          ? 'border-[#0A84FF]'
                          : 'border-[#E5E5EA] hover:border-[#0A84FF]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-white border border-[#0A84FF]' : 'bg-[#F5F5F7]'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-[#0A84FF]' : 'text-[#6E6E73]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm mb-0.5 ${
                            isSelected ? 'text-[#0A84FF]' : 'text-[#1D1D1F]'
                          }`} style={{ fontWeight: 600 }}>
                            {t(`${role.id}.title`)}
                          </div>
                          <div className="text-xs text-[#6E6E73]">
                            {t(`${role.id}.subtitle`)}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#0A84FF] bg-[#0A84FF]'
                            : 'border-[#E5E5EA]'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0A84FF] text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedRole}
              style={{ fontWeight: 600 }}
            >
              {t('signIn')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E5E5EA]">
            <div className="flex items-center justify-center gap-2 text-xs text-[#6E6E73]">
              <Shield className="w-4 h-4" />
              <span>{t('footer')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
