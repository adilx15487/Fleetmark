import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Shuffle,
  MapPin,
  MessageCircleOff,
} from 'lucide-react';
import FlipCard from './ui/FlipCard';
import { SnakeCard } from './ui/SnakeCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const cardIcons = [Users, Shuffle, MapPin, MessageCircleOff] as const;

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useTranslation();

  const problems = t('landing.features.problems', { returnObjects: true }) as string[];
  const solutions = t('landing.features.solutions', { returnObjects: true }) as string[];

  // Track flip state per card
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false]);
  const anyFlipped = flipped.some(Boolean);
  const allFlipped = flipped.every(Boolean);

  const toggleCard = useCallback((idx: number) => {
    setFlipped((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }, []);

  const flipAll = useCallback(() => {
    setFlipped(allFlipped ? [false, false, false, false] : [true, true, true, true]);
  }, [allFlipped]);

  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
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
            {t('landing.features.badge')}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('landing.features.title')}
            <br />
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              {t('landing.features.titleHighlight')}
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
            {t('landing.features.description')}
          </motion.p>
        </div>

        {/* ─── Flip Cards Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {Array.isArray(problems) &&
            problems.map((problem, i) => (
              <SnakeCard key={i} index={i}>
              <FlipCard
                problem={problem}
                solution={solutions[i]}
                icon={cardIcons[i]}
                index={i}
                isFlipped={flipped[i]}
                onFlip={() => toggleCard(i)}
              />
              </SnakeCard>
            ))}
        </div>

        {/* ─── Hint + Flip All ─── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <AnimatePresence>
            {!anyFlipped && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-center"
                style={{ color: 'var(--text-tertiary)' }}
              >
                👆 {t('landing.features.flipHint')}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {anyFlipped && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={flipAll}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: 'var(--accent-text)',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {allFlipped
                  ? t('landing.features.resetAll')
                  : t('landing.features.flipAll')}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Features;
