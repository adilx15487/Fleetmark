import { Bus, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t('landing.footer.aboutUs'), href: '#about' },
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.getStarted'), href: '#auth' },
    { label: t('landing.nav.subscribe'), href: '#subscribe' },
  ];

  const resources = [
    { label: t('landing.footer.documentation'), href: 'https://1337.ma' },
    { label: t('landing.footer.apiReference'), href: 'https://42.fr' },
    { label: t('landing.footer.supportCenter'), href: '#' },
    { label: t('landing.footer.statusPage'), href: '#' },
  ];

  const legal = [
    { label: t('landing.footer.privacy'), href: '#' },
    { label: t('landing.footer.terms'), href: '#' },
    { label: t('landing.footer.cookies'), href: '#' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                <Bus className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Fleetmark</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-tertiary)' }}>
              {t('landing.footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>
              {t('landing.footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors inline-flex items-center gap-1 group"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>
              {t('landing.footer.resources')}
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors inline-flex items-center gap-1 group"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>
              {t('landing.footer.legal')}
            </h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors inline-flex items-center gap-1 group"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {t('landing.footer.copyright')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {t('landing.footer.bottomTagline')}
          </p>
        </div>

        {/* Built in Morocco */}
        <div className="pb-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Built with ❤️ in Morocco 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
