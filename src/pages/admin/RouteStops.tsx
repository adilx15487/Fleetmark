import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, MapPin, Clock, Bus as BusIcon } from 'lucide-react';
import { routes } from '../../data/mockData';
import Modal from '../../components/admin/Modal';

const statusClasses: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-500 border-slate-200',
};

const RouteStops = () => {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(routes[0]?.id ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', stops: '', assignedBus: '', startTime: '', endTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add route:', formData);
    setModalOpen(false);
    setFormData({ name: '', stops: '', assignedBus: '', startTime: '', endTime: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">All Routes</h2>
          <p className="text-sm text-slate-400 mt-1">{routes.length} routes configured</p>
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
        {routes.map((route) => {
          const isExpanded = expandedRoute === route.id;
          return (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-primary-100/30 transition-all duration-200"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-900">{route.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {route.stops.length} stops · {route.startTime} — {route.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusClasses[route.status]}`}>
                    {route.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <BusIcon className="w-4 h-4 text-primary-500" />
                      <div>
                        <p className="text-xs text-slate-400">Assigned Bus</p>
                        <p className="text-sm font-semibold text-primary-900">{route.assignedBus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Clock className="w-4 h-4 text-accent-500" />
                      <div>
                        <p className="text-xs text-slate-400">Schedule</p>
                        <p className="text-sm font-semibold text-primary-900">{route.startTime} — {route.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs text-slate-400">Status</p>
                        <p className="text-sm font-semibold text-primary-900">{route.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stops timeline */}
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Stops</h4>
                  <div className="relative pl-6">
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-primary-200" />
                    {route.stops.map((stop, i) => (
                      <div key={i} className="relative flex items-center gap-4 py-2.5">
                        <div className={`absolute left-[-13px] w-3 h-3 rounded-full border-2 border-white ${
                          i === 0 ? 'bg-primary-500' : i === route.stops.length - 1 ? 'bg-emerald-500' : 'bg-accent-400'
                        } shadow-sm`} />
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-primary-900">{stop.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{stop.arrivalTime}</span>
                        </div>
                      </div>
                    ))}
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Route Name</label>
            <input
              type="text"
              placeholder="e.g. Route F — Evening Express"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Stops (comma-separated)</label>
            <textarea
              placeholder="e.g. Main Gate, Library, Labs, Dorms"
              value={formData.stops}
              onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Bus</label>
            <input
              type="text"
              placeholder="e.g. Bus 07"
              value={formData.assignedBus}
              onChange={(e) => setFormData({ ...formData, assignedBus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
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
