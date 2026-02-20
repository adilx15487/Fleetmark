import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Shield, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const roles: { value: UserRole; label: string; description: string; icon: typeof Users; color: string; bg: string }[] = [
  {
    value: 'passenger',
    label: 'Student / Employee',
    description: 'Reserve seats, view routes, and track your rides in real-time.',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100/50',
  },
  {
    value: 'admin',
    label: 'Admin / Organizer',
    description: 'Manage fleet, create routes, handle schedules and monitor operations.',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-100/50',
  },
  {
    value: 'driver',
    label: 'Driver',
    description: 'View your assigned route, passenger list, and daily schedule.',
    icon: Truck,
    color: 'text-sky-600',
    bg: 'bg-sky-50 border-sky-200 hover:border-sky-400 hover:shadow-sky-100/50',
  },
];

const RoleSelection = () => {
  useDocumentTitle('Choose Your Role — Fleetmark');
  const navigate = useNavigate();
  const { user, setUserRole, getDashboardPath } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);

    // Simulate a brief save delay
    await new Promise((r) => setTimeout(r, 600));

    setUserRole(selectedRole);
    toast(`Welcome to Fleetmark, ${user?.name?.split(' ')[0] || 'there'}! 🎉`);
    navigate(getDashboardPath(selectedRole));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-xl shadow-primary-100/20 border border-slate-200 p-8 sm:p-10 max-w-lg w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          {/* 42 badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold mb-4">
            <span className="text-sm font-black">42</span>
            {user?.campus && <span className="opacity-70">•</span>}
            {user?.campus && <span>{user.campus} Campus</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900 mb-2">
            Welcome to Fleetmark!
          </h1>
          <p className="text-slate-400 text-sm">
            Hey <span className="font-semibold text-primary-700">@{user?.login42 || user?.name}</span>, how will you use Fleetmark?
          </p>
        </div>

        {/* Role cards */}
        <div className="space-y-3 mb-8">
          {roles.map((role, i) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <motion.button
                key={role.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${role.bg} shadow-lg scale-[1.02]`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? role.bg.split(' ')[0] : 'bg-slate-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? role.color : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                    {role.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto shrink-0"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${role.bg.split(' ')[0]}`}>
                      <div className={`w-3 h-3 rounded-full ${role.color.replace('text-', 'bg-')}`} />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all duration-200 shadow-lg shadow-primary-700/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
