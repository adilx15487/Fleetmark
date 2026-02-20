import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, MapPin, Clock, Bus as BusIcon, AlertTriangle, Moon, Pause } from 'lucide-react';
import { routes } from '../../data/mockData';
import Modal from '../../components/admin/Modal';

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

  const totalStops = routes.reduce((sum, r) => sum + r.stops.length, 0);

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
          <p className="text-sm text-slate-400 mt-1">{routes.length} routes · {totalStops} total stops</p>
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
                    <h3 className="text-sm font-bold text-primary-900">{route.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {route.stops.length} stops · {route.stops[0]?.name} → {route.stops[route.stops.length - 1]?.name}
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

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  {/* Info Cards */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <BusIcon className="w-4 h-4 text-primary-500" />
                      <div>
                        <p className="text-xs text-slate-400">Assigned Bus</p>
                        <p className="text-sm font-semibold text-primary-900">{route.assignedBus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-400">Operating Hours</p>
                        <p className="text-sm font-semibold text-primary-900">10:00 PM → 6:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Pause className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-slate-400">Break Period</p>
                        <p className="text-sm font-semibold text-primary-900">2:00 AM → 3:00 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Stops Timeline */}
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Stops Timeline — {route.stops.length} stops
                  </h4>
                  <HorizontalTimeline stops={route.stops} accent={accent} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

/* ────── Horizontal Scrollable Stops Timeline ────── */

interface TimelineProps {
  stops: { name: string; arrivalTime: string }[];
  accent: typeof routeAccents[number];
}

const HorizontalTimeline = ({ stops, accent }: TimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  // Format 24h to 12h
  const to12h = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
  };

  return (
    <div className="relative group">
      {/* Scroll shadow indicators */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-white to-transparent flex items-center justify-start pl-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronDown className="w-4 h-4 text-slate-400 rotate-90" />
        </button>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-thin pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex items-start gap-0 min-w-max px-2 pt-2">
          {stops.map((stop, i) => {
            const isFirst = i === 0;
            const isLast = i === stops.length - 1;

            return (
              <div key={i} className="flex items-start">
                {/* Stop node */}
                <div className="flex flex-col items-center" style={{ width: '100px' }}>
                  {/* Numbered dot */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                      isFirst ? accent.dot : isLast ? 'bg-emerald-500' : accent.dotMid
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Stop name */}
                  <p className="text-[11px] font-medium text-primary-900 text-center mt-1.5 leading-tight px-1 max-w-[96px]">
                    {stop.name}
                  </p>
                  {/* Arrival time */}
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {to12h(stop.arrivalTime)}
                  </p>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className="flex items-center mt-[13px]">
                    <div className={`w-8 h-[2px] ${accent.line}`} />
                    <div className={`w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] ${
                      accent.line === 'bg-primary-300' ? 'border-l-primary-300' : 'border-l-sky-300'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RouteStops;
