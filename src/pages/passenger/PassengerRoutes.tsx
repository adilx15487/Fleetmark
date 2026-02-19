import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Users, ChevronDown, ChevronUp, Bus, Ticket } from 'lucide-react';
import { availableRoutes } from '../../data/passengerMockData';

type OrgFilter = 'All' | 'University' | 'Enterprise' | 'School';

const PassengerRoutes = () => {
  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState<OrgFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return availableRoutes.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.stops.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchOrg = orgFilter === 'All' || r.organization === orgFilter;
      return matchSearch && matchOrg;
    });
  }, [search, orgFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search routes or stops…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['All', 'University', 'Enterprise', 'School'] as OrgFilter[]).map((org) => (
            <button
              key={org}
              onClick={() => setOrgFilter(org)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                orgFilter === org
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              {org}
            </button>
          ))}
        </div>
      </div>

      {/* Route cards */}
      <div className="space-y-4">
        {filtered.map((route) => {
          const isExpanded = expandedId === route.id;
          const seatPercent = Math.round((route.availableSeats / route.totalSeats) * 100);

          return (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-primary-100/30 transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : route.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-primary-900">{route.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        route.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {route.stops.length} stops · {route.assignedBus} · {route.organization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${seatPercent > 50 ? 'bg-emerald-400' : seatPercent > 20 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${seatPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{route.availableSeats} seats</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  {/* Stops timeline */}
                  <div className="flex items-center gap-2 flex-wrap mb-5">
                    {route.stops.map((stop, i) => (
                      <div key={stop} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${
                            i === 0 ? 'bg-primary-500' : i === route.stops.length - 1 ? 'bg-emerald-500' : 'bg-accent-400'
                          } shadow-sm`} />
                          <span className="text-sm font-medium text-primary-900">{stop}</span>
                        </div>
                        {i < route.stops.length - 1 && (
                          <div className="w-6 h-px bg-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Info row */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <div>
                        <p className="text-xs text-slate-400">Departure Times</p>
                        <p className="text-sm font-semibold text-primary-900">{route.departureTimes.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs text-slate-400">Available Seats</p>
                        <p className="text-sm font-semibold text-primary-900">{route.availableSeats} / {route.totalSeats}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <Bus className="w-4 h-4 text-accent-500" />
                      <div>
                        <p className="text-xs text-slate-400">Bus Assigned</p>
                        <p className="text-sm font-semibold text-primary-900">{route.assignedBus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reserve button */}
                  {route.status === 'Active' && (
                    <Link
                      to="/passenger/reserve"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
                    >
                      <Ticket className="w-4 h-4" />
                      Reserve a Seat
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-400">
            No routes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerRoutes;
