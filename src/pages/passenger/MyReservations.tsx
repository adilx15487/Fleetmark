import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Bus, Ticket, XCircle, Check, X, AlertTriangle } from 'lucide-react';
import { useReservation } from '../../context/ReservationContext';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCardGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';

const MyReservations = () => {
  const { isLoading, isError, retry } = useLoadingState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    tonightReservations,
    reservationsUsed,
    maxReservations,
    cancelReservation,
    pastReservations,
    getBusInfo,
    transport,
  } = useReservation();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const busInfo = getBusInfo();
  const activeTonight = tonightReservations.filter((r) => r.status === 'Confirmed');
  const cancelledTonight = tonightReservations.filter((r) => r.status === 'Cancelled');

  const handleCancelConfirm = () => {
    if (!cancelId) return;
    cancelReservation(cancelId);
    toast('Reservation cancelled.', 'warning');
    setCancelId(null);
  };

  if (isLoading) return <SkeletonCardGrid count={6} cols="sm:grid-cols-2 xl:grid-cols-3" />;
  if (isError) return <ErrorState onRetry={retry} />;

  if (!transport) {
    return (
      <EmptyState
        icon={<Ticket className="w-8 h-8 text-slate-300" />}
        title="Set up your transport first"
        subtitle="Reserve your first trip to complete setup!"
        action={{ label: 'Reserve a Seat', onClick: () => navigate('/passenger/reserve') }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tonight's Reservations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-primary-900">
            Tonight's Reservations ({activeTonight.length}/{maxReservations})
          </h3>
          <span className="text-xs text-slate-400">{reservationsUsed} used</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 mb-5">
          <div
            className={`h-2.5 rounded-full transition-all ${
              reservationsUsed >= maxReservations ? 'bg-red-500' : reservationsUsed >= maxReservations - 1 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(reservationsUsed / maxReservations) * 100}%` }}
          />
        </div>

        {activeTonight.length === 0 && cancelledTonight.length === 0 ? (
          <div className="text-center py-8">
            <Ticket className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No reservations yet tonight.</p>
            <button
              onClick={() => navigate('/passenger/reserve')}
              className="mt-3 px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all"
            >
              Reserve a Seat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active */}
            {activeTonight.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-emerald-900">{res.slotLabel}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-emerald-600 flex-wrap">
                      <span className="flex items-center gap-1"><Bus className="w-3 h-3" />{busInfo?.busNumber}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{res.homeStop}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-200 text-emerald-800">
                    <Check className="w-3 h-3" />
                    Confirmed
                  </span>
                  <button
                    onClick={() => setCancelId(res.id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Cancel"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Cancelled tonight */}
            {cancelledTonight.map((res) => (
              <div key={res.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-500 line-through">{res.slotLabel}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{res.homeStop}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-500 shrink-0">
                  Cancelled
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Reservations */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-primary-900">Past Nights</h3>
        </div>

        {pastReservations.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-300">No past reservations.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pastReservations.map((night) => (
              <div key={night.date} className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{night.date}</p>
                <div className="space-y-2">
                  {night.reservations.map((res) => (
                    <div key={res.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <Clock className={`w-4 h-4 shrink-0 ${res.status === 'Confirmed' ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${res.status === 'Confirmed' ? 'text-primary-900' : 'text-slate-400 line-through'}`}>
                            {res.slotLabel}
                          </p>
                          <p className="text-[10px] text-slate-400">{res.homeStop} · {res.busAssignment}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-page-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary-900">Cancel this reservation?</h3>
              <button onClick={() => setCancelId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Cancelling will free up this slot. Your usage counter will be updated.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
