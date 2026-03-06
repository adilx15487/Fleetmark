import { motion } from 'framer-motion';
import { Bus, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ComingSoon = () => {
  useDocumentTitle('Driver Portal — Coming Soon');
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'var(--accent-subtle)' }}
        >
          <Bus className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Driver Portal
        </h1>

        {/* Subtitle */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-text)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>

        <p
          className="text-lg leading-relaxed mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          The driver dashboard is currently under development. Drivers will be
          able to manage their routes, view passenger lists, and update trip
          statuses in real time.
        </p>

        {/* Feature hints */}
        <div
          className="rounded-2xl p-6 mb-8 text-left space-y-3"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Planned features:
          </p>
          {['Real-time trip management', 'Passenger check-in list', 'Route navigation', 'Push notifications'].map(
            (feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {feature}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
