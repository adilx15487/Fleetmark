import { useTranslation } from 'react-i18next';
import { isDashboardLang, VISIBLE_LANGUAGES, DASHBOARD_LANGUAGES } from '../i18n/index';
import { useToast } from '../context/ToastContext';

interface LanguageSwitcherProps {
  dashboardMode?: boolean;
}

export default function LanguageSwitcher({ dashboardMode = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();

  const languages = dashboardMode ? DASHBOARD_LANGUAGES : VISIBLE_LANGUAGES;

  const handleLanguageChange = (code: string) => {
    // Smart guard: block AR in dashboards
    if (dashboardMode && !isDashboardLang(code)) {
      const msg =
        i18n.language === 'fr'
          ? "Arabe disponible sur la page d'accueil uniquement"
          : 'Arabic available on landing page only';
      toast(msg, 'warning');
      return;
    }
    i18n.changeLanguage(code);
  };

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1"
      style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
    >
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition-all h-8"
          style={
            i18n.language === code
              ? { backgroundColor: 'var(--accent-primary)', color: '#fff', boxShadow: 'var(--shadow-sm)' }
              : { color: 'var(--text-secondary)', backgroundColor: 'transparent' }
          }
          onMouseEnter={(e) => {
            if (i18n.language !== code) {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--accent-text)';
            }
          }}
          onMouseLeave={(e) => {
            if (i18n.language !== code) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
          aria-label={`Switch to ${label}`}
        >
          <span>{flag}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
