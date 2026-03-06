import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Shield, ExternalLink, Loader2 } from 'lucide-react';
import { get42AuthUrl } from '../services/auth.service';
import { useTranslation } from 'react-i18next';
import { SnakeCard } from './ui/SnakeCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

const AuthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useTranslation();
  const [loadingRole, setLoadingRole] = useState<'student' | 'staff' | null>(null);

  const handleLogin = (role: 'student' | 'staff') => {
    setLoadingRole(role);
    // Both redirect to 42 OAuth — state param tells callback which role was selected
    window.location.href = get42AuthUrl(role);
  };

  return (
    <section id="auth" className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Info */}
          <div>
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-text)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {t('landing.auth.badge')}
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('landing.auth.title')}
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                {t('landing.auth.subtitle')}
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={2}
              className="mt-6 text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('landing.auth.description')}
            </motion.p>

            {/* How it works */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={3}
              className="mt-10 space-y-4"
            >
              {[
                { step: '1', text: 'Click your role below' },
                { step: '2', text: 'Authenticate with your 42 Intra account' },
                { step: '3', text: 'Choose your home stop & start reserving' },
              ].map((item, i) => (
                <SnakeCard key={item.step} index={i}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)' }}
                    >
                      {item.step}
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                  </div>
                </SnakeCard>
              ))}
            </motion.div>

            {/* 1337 badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={4}
              className="mt-6"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>🏫</span>
                <span>Currently serving <strong style={{ color: 'var(--accent-primary)' }}>1337 School</strong>, Ben Guerir</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Auth Buttons */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={2}
          >
            <div
              className="rounded-3xl overflow-hidden p-8 sm:p-10"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* 42 Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-black tracking-tight">42</span>
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Sign in with 42 Intra
                </h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Use your 42 account to access Fleetmark
                </p>
              </div>

              {/* Sign in buttons */}
              <div className="space-y-4">
                {/* Student button */}
                <button
                  onClick={() => handleLogin('student')}
                  disabled={loadingRole !== null}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                  }}
                >
                  {loadingRole === 'student' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting to 42…
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      Sign in as Student
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </>
                  )}
                </button>

                {/* Staff button */}
                <button
                  onClick={() => handleLogin('staff')}
                  disabled={loadingRole !== null}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {loadingRole === 'staff' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting to 42…
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Sign in as Staff
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </>
                  )}
                </button>
              </div>

              {/* Note */}
              <p className="text-center text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
                Only 1337 School members can sign in. Your role is determined by your 42 account.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
