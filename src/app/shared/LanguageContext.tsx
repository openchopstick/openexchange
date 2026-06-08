import React, { createContext, useContext, useState, ReactNode } from 'react';
import en, { TranslationKey } from './i18n/en';
import zhCN from './i18n/zhCN';

type Language = 'en' | 'zh-CN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Record<string, string>> = {
  en,
  'zh-CN': zhCN,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return dictionaries[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convert a free-form status/category string from mock data ("Pending Approval",
// "Re-KYC Required", "Cold → Hot") into its dictionary slug ("status.pending_approval").
export function statusKey(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return `status.${slug}`;
}

export type { TranslationKey };
