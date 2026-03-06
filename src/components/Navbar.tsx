import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Bus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('landing.nav.about'), href: '#about' },
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.getStarted'), href: '#auth' },
    { label: t('landing.nav.subscribe'), href: '#subscribe' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div
              className="p-2 rounded-xl transition-colors duration-300"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <Bus className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-tight leading-tight transition-colors duration-300"
                style={{ color: 'var(--text-primary)' }}
              >
                Fleetmark
              </span>
              <span
                className="text-[10px] font-medium tracking-wide transition-colors duration-300"
                style={{ color: 'var(--text-tertiary)' }}
              >
                1337 School
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated && user ? (
              <button
                onClick={() => navigate(getDashboardPath(user.role))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('landing.nav.dashboard')}
              </button>
            ) : (
              <>
                <a
                  href="#auth"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {t('landing.nav.login')}
                </a>
                <a
                  href="#auth"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  }}
                >
                  {t('landing.nav.signup')}
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden backdrop-blur-xl shadow-xl"
          style={{
            backgroundColor: 'var(--nav-bg)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            <div className="pt-4 flex gap-3">
              {isAuthenticated && user ? (
                <button
                  onClick={() => { setIsOpen(false); navigate(getDashboardPath(user.role)); }}
                  className="flex-1 text-center inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('landing.nav.dashboard')}
                </button>
              ) : (
                <>
                  <a
                    href="#auth"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-3 rounded-xl font-semibold transition-colors"
                    style={{
                      border: '2px solid var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {t('landing.nav.login')}
                  </a>
                  <a
                    href="#auth"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-3 rounded-xl font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
                  >
                    {t('landing.nav.signup')}
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
