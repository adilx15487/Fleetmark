import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bus, Ticket, Clock, CalendarDays, XCircle, Star } from 'lucide-react';
import { passengerReservations, type Reservation } from '../../data/passengerMockData';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCardGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';

type FilterTab = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

const statusStyle: Record<Reservation['status'], string> = {
  Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Completed: 'bg-sky-50 text-sky-600 border-sky-200',
  Cancelled: 'bg-red-50 text-red-500 border-red-200',
};

const MyReservations = () => {
  const { isLoading, isError, retry } = useLoadingState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<FilterTab>('All');

  const filtered = useMemo(() => {
    if (tab === 'All') return passengerReservations;
    if (tab === 'Upcoming') return passengerReservations.filter((r) => r.status === 'Confirmed' || r.status === 'Pending');
    return passengerReservations.filter((r) => r.status === tab);
  }, [tab]);

  const tabs: FilterTab[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  if (isLoading) return <SkeletonCardGrid count={6} cols="sm:grid-cols-2 xl:grid-cols-3" />;
  if (isError) return <ErrorState onRetry={retry} />;

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Reservation cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-8 h-8 text-slate-300" />}
          title="No reservations yet"
          subtitle="Reserve your first seat!"
          action={{ label: 'Reserve a Seat', onClick: () => navigate('/passenger/reserve') }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-all flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-primary-900">{r.route}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{r.id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Bus className="w-3.5 h-3.5 text-slate-400" />
                  <span>{r.bus}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Ticket className="w-3.5 h-3.5 text-slate-400" />
                  <span>Seat {r.seat}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{r.stop}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  <span>{r.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{r.departureTime}</span>
                </div>
              </div>

              {/* Rating stars (completed) */}
              {r.status === 'Completed' && r.rating && (
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating! ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">Your rating</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                {(r.status === 'Confirmed' || r.status === 'Pending') && (
                  <button
                    onClick={() => toast('Reservation cancelled.', 'warning')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Reservation
                  </button>
                )}
                {r.status === 'Completed' && !r.rating && (
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                    <Star className="w-3.5 h-3.5" />
                    Rate This Ride
                  </button>
                )}
                {r.status === 'Cancelled' && (
                  <span className="text-xs text-slate-300">This ride was cancelled.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
