import { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Friendly empty-state placeholder for lists, tables, and grids
 * with no data to display.
 */
const EmptyState = ({ icon, title, subtitle, action, className = '' }: EmptyStateProps) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-12 text-center ${className}`}>
    {/* Icon / illustration */}
    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
      {icon ?? (
        <Inbox className="w-8 h-8 text-slate-300" />
      )}
    </div>

    <h3 className="text-base font-bold text-primary-900 mb-1">{title}</h3>

    {subtitle && (
      <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">{subtitle}</p>
    )}

    {action && (
      <button
        onClick={action.onClick}
        className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
