import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';

interface LanguageToggleProps {
  floating?: boolean;
}

const languages = [
  { code: 'en' as const, label: 'English', nativeLabel: 'EN' },
  { code: 'zh-CN' as const, label: 'Simplified Chinese', nativeLabel: '简体中文' },
];

export function LanguageToggle({ floating = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: 'en' | 'zh-CN') => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (floating) {
    return (
      <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors"
        >
          <Globe className="w-4 h-4 text-[#6E6E73]" />
          <span className="text-sm font-medium text-[#1D1D1F]">
            {currentLang.nativeLabel}
          </span>
          <ChevronDown className={`w-3 h-3 text-[#6E6E73] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E5EA] overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#F5F5F7] transition-colors ${
                  language === lang.code ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'text-[#1D1D1F]'
                }`}
                style={{ fontWeight: language === lang.code ? 600 : 400 }}
              >
                <span>{lang.nativeLabel}</span>
                <span className="text-xs text-[#6E6E73]">{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#E5E5EA] transition-all"
      >
        <Globe className="w-4 h-4 text-[#6E6E73]" />
        <span className="text-sm text-[#1D1D1F]" style={{ fontWeight: 600 }}>
          {currentLang.nativeLabel}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#6E6E73] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E5E5EA] overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#F5F5F7] transition-colors ${
                language === lang.code ? 'bg-[#F0F7FF] text-[#0A84FF]' : 'text-[#1D1D1F]'
              }`}
              style={{ fontWeight: language === lang.code ? 600 : 400 }}
            >
              <span>{lang.nativeLabel}</span>
              <span className="text-xs text-[#6E6E73]">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}