import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Bus as BusIcon, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import api from '../lib/axios';
import { API_ENDPOINTS } from '../config/api.config';
import useDocumentTitle from '../hooks/useDocumentTitle';

// ── Bus stops data (26 unique stops across 2 bus routes) ──
interface StopInfo {
  name: string;
  buses: string[];
}

const ALL_STOPS: StopInfo[] = [
  // Bus 1 — 18 stops (Ben Guerir → 1337)
  { name: 'Gare Routière Ben Guerir', buses: ['Bus 1'] },
  { name: 'Place du Marché', buses: ['Bus 1'] },
  { name: 'Hay Essalam', buses: ['Bus 1'] },
  { name: 'Quartier Administratif', buses: ['Bus 1'] },
  { name: 'Lycée Qualifiant', buses: ['Bus 1'] },
  { name: 'Centre de Santé', buses: ['Bus 1'] },
  { name: 'Mosquée Al Mohammadi', buses: ['Bus 1'] },
  { name: 'Rond-Point Central', buses: ['Bus 1', 'Bus 2'] },
  { name: 'Station Total', buses: ['Bus 1'] },
  { name: 'Zone Industrielle', buses: ['Bus 1'] },
  { name: 'Complexe Sportif', buses: ['Bus 1'] },
  { name: 'Hay Al Massira', buses: ['Bus 1'] },
  { name: 'Entrée UM6P', buses: ['Bus 1', 'Bus 2'] },
  { name: 'Parking UM6P', buses: ['Bus 1'] },
  { name: 'Résidence Étudiante', buses: ['Bus 1'] },
  { name: 'Bibliothèque UM6P', buses: ['Bus 1'] },
  { name: 'Campus 1337', buses: ['Bus 1'] },
  { name: 'Forum UM6P', buses: ['Bus 1'] },
  // Bus 2 — additional stops (Marrakech → 1337)
  { name: 'Gare Routière Marrakech', buses: ['Bus 2'] },
  { name: 'Bab Doukkala', buses: ['Bus 2'] },
  { name: 'Avenue Mohammed V', buses: ['Bus 2'] },
  { name: 'Place Jemaa el-Fna', buses: ['Bus 2'] },
  { name: 'Guéliz Centre', buses: ['Bus 2'] },
  { name: 'Route de Casablanca', buses: ['Bus 2'] },
];

const Onboarding = () => {
  useDocumentTitle('Choose Your Stop — Fleetmark 1337');
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_STOPS;
    const q = search.toLowerCase();
    return ALL_STOPS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.buses.some((b) => b.toLowerCase().includes(q)),
    );
  }, [search]);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setSaving(true);
    setError(null);

    try {
      // PATCH user home_stop
      await api.patch(API_ENDPOINTS.users.detail(user.id), { home_stop: selected });
      setUser({ ...user, home_stop: selected, is_new_user: false });
      navigate(getDashboardPath(user.role));
    } catch {
      setError('Failed to save your stop. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div className="p-8 pb-0 text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--accent-subtle)' }}
            >
              <MapPin className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Choose your nearest shuttle stop. You can change it later in settings.
            </p>
          </div>

          {/* Search */}
          <div className="px-8 pt-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stops…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                }}
              />
            </div>
          </div>

          {/* Stop list */}
          <div className="px-8 py-4 max-h-72 overflow-y-auto space-y-1.5">
            {filtered.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>
                No stops match your search.
              </p>
            ) : (
              filtered.map((stop) => (
                <button
                  key={stop.name}
                  onClick={() => setSelected(stop.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                  style={{
                    backgroundColor: selected === stop.name ? 'var(--accent-subtle)' : 'transparent',
                    border: `1px solid ${selected === stop.name ? 'var(--accent-primary)' : 'transparent'}`,
                  }}
                >
                  <MapPin
                    className="w-4 h-4 shrink-0"
                    style={{ color: selected === stop.name ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: selected === stop.name ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                    >
                      {stop.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {stop.buses.map((bus) => (
                        <span
                          key={bus}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                        >
                          <BusIcon className="w-2.5 h-2.5" />
                          {bus}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selected === stop.name && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-8">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          )}

          {/* Continue button */}
          <div className="p-8 pt-4">
            <button
              onClick={handleContinue}
              disabled={!selected || saving}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                boxShadow: selected ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none',
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>

            <button
              onClick={() => user && navigate(getDashboardPath(user.role))}
              className="w-full py-2.5 text-sm font-medium mt-2 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
