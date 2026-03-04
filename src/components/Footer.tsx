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
    <footer className="bg-primary-900 text-white relative overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-white/10">
                <Bus className="w-6 h-6 text-accent-400" />
              </div>
              <span className="text-xl font-bold tracking-tight">Fleetmark</span>
            </a>
            <p className="mt-4 text-sm text-primary-300/60 leading-relaxed max-w-xs">
              {t('landing.footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">
              {t('landing.footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-300/60 hover:text-accent-400 transition-colors inline-flex items-center gap-1 group"
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
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">
              {t('landing.footer.resources')}
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-300/60 hover:text-accent-400 transition-colors inline-flex items-center gap-1 group"
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
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">
              {t('landing.footer.legal')}
            </h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-300/60 hover:text-accent-400 transition-colors inline-flex items-center gap-1 group"
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
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-300/50">
            {t('landing.footer.copyright')}
          </p>
          <p className="text-sm text-primary-300/40">
            {t('landing.footer.bottomTagline')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
