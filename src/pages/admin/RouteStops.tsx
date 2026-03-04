import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, MapPin, Clock, Bus as BusIcon, AlertTriangle, Moon, Pause } from 'lucide-react';
import { useRoutes, useCreateRoute, useBuses } from '../../hooks/useApi';
import type { ApiRoute } from '../../types/api';
import Modal from '../../components/admin/Modal';
import { SkeletonTable } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../lib/errorMapper';

const statusClasses: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-500 border-slate-200',
};

// Different accent colors per route
const routeAccents = [
  { bg: 'bg-primary-500/10', icon: 'text-primary-600', dot: 'bg-primary-500', dotMid: 'bg-primary-300', line: 'bg-primary-300', badge: 'bg-primary-50 text-primary-700 border-primary-200', ring: 'ring-primary-500/20' },
  { bg: 'bg-sky-500/10', icon: 'text-sky-600', dot: 'bg-sky-500', dotMid: 'bg-sky-300', line: 'bg-sky-300', badge: 'bg-sky-50 text-sky-700 border-sky-200', ring: 'ring-sky-500/20' },
];

const RouteStops = () => {
  const { data: routes = [], isLoading, isError, refetch } = useRoutes();
  const { data: buses = [] } = useBuses();
  const createRoute = useCreateRoute();
  const { toast } = useToast();
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bus: '', direction: '',
  });

  // Expand first route by default
  useEffect(() => {
    if (routes.length > 0 && expandedRoute === null) {
      setExpandedRoute(routes[0].id);
    }
  }, [routes, expandedRoute]);

  const getBusMatricule = (busId: number) => {
    const bus = buses.find((b) => b.id === busId);
    return bus?.matricule || `Bus #${busId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoute.mutateAsync({ bus: Number(formData.bus), direction: formData.direction });
      toast('Route added successfully!');
      setModalOpen(false);
      setFormData({ bus: '', direction: '' });
    } catch (err) {
      toast(parseApiError(err).message);
    }
  };

  if (isLoading) return <SkeletonTable rows={4} cols={4} />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (routes.length === 0) return <EmptyState title="No routes yet" subtitle="Create your first route to get started." action={{ label: 'Add Route', onClick: () => setModalOpen(true) }} />;

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Official Stops Only</p>
          <p className="text-xs text-amber-600 mt-0.5">
            No pick-up or drop-off outside designated stop points. Stops are revised once per year by the administration.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">All Routes</h2>
          <p className="text-sm text-slate-400 mt-1">{routes.length} routes</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add New Route
        </button>
      </div>

      {/* Route Cards */}
      <div className="space-y-4">
        {routes.map((route, routeIndex) => {
          const isExpanded = expandedRoute === route.id;
          const accent = routeAccents[routeIndex % routeAccents.length];
          return (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-primary-100/30 transition-all duration-200"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center`}>
                    <MapPin className={`w-5 h-5 ${accent.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-900">Route #{route.id} — {route.direction}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bus: {getBusMatricule(route.bus)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusClasses['Active']}`}>
                    Active
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  {/* Info Cards */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <BusIcon className="w-4 h-4 text-primary-500" />
                      <div>
                        <p className="text-xs text-slate-400">Assigned Bus</p>
                        <p className="text-sm font-semibold text-primary-900">{getBusMatricule(route.bus)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-400">Direction</p>
                        <p className="text-sm font-semibold text-primary-900">{route.direction}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Pause className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-slate-400">Route ID</p>
                        <p className="text-sm font-semibold text-primary-900">#{route.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Route Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Route">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bus</label>
            <select
              value={formData.bus}
              onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white"
            >
              <option value="">Select a bus…</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>{b.matricule} (capacity: {b.capacity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Direction</label>
            <input
              type="text"
              placeholder="e.g. Outbound / Inbound / Loop"
              value={formData.direction}
              onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all">
              Add Route
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RouteStops;
