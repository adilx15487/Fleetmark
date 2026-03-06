import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Bell, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

const Subscribe = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed:', email);
      toast("You're subscribed! 🚀");
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section id="subscribe" className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <div className="text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--accent-subtle)' }}
          >
            <Bell className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('landing.subscribe.title')}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={2}
            className="mt-4 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('landing.subscribe.description')}
          </motion.p>

          <motion.form
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={3}
            onSubmit={handleSubmit}
            className="mt-10 max-w-lg mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('landing.subscribe.placeholder')}
                  required
                  className="w-full px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-accent-400/30 outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                }}
              >
                {subscribed ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('landing.subscribe.subscribed')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('landing.subscribe.button')}
                  </>
                )}
              </button>
            </div>
          </motion.form>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={4}
            className="mt-4 text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t('landing.subscribe.noSpam')}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
