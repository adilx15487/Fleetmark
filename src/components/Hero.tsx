import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const heroCardY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient from tokens */}
      <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-text)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
                {t('landing.hero.badge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('landing.hero.title')}
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                {t('landing.hero.subtitle')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('landing.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#auth"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t('landing.hero.cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
              >
                {t('landing.hero.learnMore')}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0"
            >
              {[
                { value: '500+', label: t('landing.hero.stats.riders') },
                { value: '25+', label: t('landing.hero.stats.routes') },
                { value: '99%', label: t('landing.hero.stats.onTime') },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustrative card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ y: heroCardY }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main dashboard preview card */}
              <div
                className="rounded-3xl p-8"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-danger-500/80" />
                  <div className="w-3 h-3 rounded-full bg-warning-500/80" />
                  <div className="w-3 h-3 rounded-full bg-success-500/80" />
                  <span className="ml-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>Fleetmark Dashboard</span>
                </div>

                {/* Mock route card */}
                <div
                  className="rounded-2xl p-5 mb-4"
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                        <MapPin className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Night Shuttle — Route 1</p>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>OCP Saka → Nakhil → Kentra → La Gare</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success-500/20 text-success-500 text-xs font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { val: '32', label: 'Seats Left', accent: false },
                      { val: '11:00', label: 'PM Tonight', accent: true },
                      { val: '19', label: 'Stops', accent: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex-1 rounded-xl p-3 text-center"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                      >
                        <p className="text-2xl font-bold" style={{ color: item.accent ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{item.val}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                      <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Seat Reserved</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Seat 14A</p>
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                      <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>ETA</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>12 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 rounded-2xl p-4"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-500/10 rounded-xl flex items-center justify-center">
                    <span className="text-success-500 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Seat Confirmed!</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Route 1 — Seat 14A</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
