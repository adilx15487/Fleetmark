import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isDashboardLang } from '../i18n/index';
import { useToast } from '../context/ToastContext';

const landingLanguages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'ar', label: 'عربي', flag: '🇲🇦' },
  { code: 'ma', label: 'دارجة', flag: '🇲🇦' },
];

const dashboardLanguages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
  dashboardMode?: boolean;
}

export default function LanguageSwitcher({ dashboardMode = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  const [showSoonTooltip, setShowSoonTooltip] = useState(false);

  const languages = dashboardMode ? dashboardLanguages : landingLanguages;

  const handleLanguageChange = (code: string) => {
    if (dashboardMode && !isDashboardLang(code)) {
      const langName = code === 'ar' ? 'العربية' : 'الدارجة';
      toast(t('dashboard.toast.langNotAvailable', { lang: langName }));
      return;
    }
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1 backdrop-blur-sm">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
            i18n.language === code
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          aria-label={`Switch to ${label}`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}

      {/* Tifinagh easter egg — only on landing */}
      {!dashboardMode && (
        <div className="relative">
          <button
            onMouseEnter={() => setShowSoonTooltip(true)}
            onMouseLeave={() => setShowSoonTooltip(false)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-400 opacity-50 cursor-not-allowed"
            aria-label="Tamazight — Coming Soon"
            disabled
          >
            <span>ⵣ</span>
            <span>ⵜⴰⵎⴰⵣⵉⵖⵜ</span>
          </button>
          {showSoonTooltip && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-white text-[10px] font-semibold whitespace-nowrap shadow-lg z-50">
              SOON
            </div>
          )}
        </div>
      )}
    </div>
  );
}
