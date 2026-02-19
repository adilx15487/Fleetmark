import { useState, useMemo } from 'react';
import { Search, Download, Users } from 'lucide-react';
import { routePassengers, type RoutePassenger } from '../../data/driverMockData';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCardGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

type FilterTab = 'All' | 'Confirmed' | 'Pending' | 'Cancelled';

const statusStyle: Record<RoutePassenger['status'], string> = {
  Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Cancelled: 'bg-red-50 text-red-500 border-red-200',
};

const PassengerList = () => {
  const { isLoading, isError, retry } = useLoadingState();
  const [filter, setFilter] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = routePassengers;
    if (filter !== 'All') list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.seat.toLowerCase().includes(q) || p.stop.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const tabs: FilterTab[] = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  const tabCounts = useMemo(
    () => ({
      All: routePassengers.length,
      Confirmed: routePassengers.filter((p) => p.status === 'Confirmed').length,
      Pending: routePassengers.filter((p) => p.status === 'Pending').length,
      Cancelled: routePassengers.filter((p) => p.status === 'Cancelled').length,
    }),
    []
  );

  if (isLoading) return <SkeletonCardGrid count={6} cols="sm:grid-cols-2 lg:grid-cols-3" />;
  if (isError) return <ErrorState onRetry={retry} />;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-900">{filtered.length} Passengers</h2>
            <p className="text-xs text-slate-400">Route A — Campus Express</p>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all">
          <Download className="w-4 h-4" />
          Export List
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === t
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              {t}
              <span className="ml-1.5 text-[11px] opacity-70">{tabCounts[t]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-64 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search name, seat, stop…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Passenger grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-slate-300" />}
          title="No passengers reserved for this trip yet"
          subtitle="Passengers will appear here once they reserve seats."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-shadow"
            >
              <div className="flex items-center gap-4">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-full bg-slate-100 shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary-600">{p.initials}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.stop}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 ${statusStyle[p.status]}`}>
                  {p.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {p.seat}
                  </span>
                  Seat
                </span>
                <span className="text-slate-300">·</span>
                <span className="truncate">{p.stop}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerList;
