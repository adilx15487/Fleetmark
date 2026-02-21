import { useState, useEffect, useCallback } from 'react';
import { Bus as BusIcon, MapPin, Clock, Check, Lock, Pause, Ban, AlertTriangle, X, Ticket } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useSchedule, to12Hour, type GeneratedSlot } from '../../context/ScheduleContext';
import { useReservation, type BusAssignment } from '../../context/ReservationContext';
import StudentOnboarding from '../../components/passenger/StudentOnboarding';

const ReserveASeat = () => {
  const { toast } = useToast();
  const { config, generatedSlots, serviceStatus } = useSchedule();
  const {
    transport,
    isOnboarded,
    setHomeStop,
    tonightReservations,
    reservationsUsed,
    maxReservations,
    canReserve,
    makeReservation,
    isSlotReserved,
    isSlotOpen,
    getTimeUntilOpen,
    getBusInfo,
  } = useReservation();

  const [confirmSlot, setConfirmSlot] = useState<GeneratedSlot | null>(null);
  const [, setTick] = useState(0);

  // Tick every second for countdown
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const busInfo = getBusInfo();

  const handleConfirm = useCallback(() => {
    if (!confirmSlot || !canReserve) return;
    makeReservation(confirmSlot.time, confirmSlot.label);
    toast(`✅ Reserved! Bus departs at ${confirmSlot.label}`);
    setConfirmSlot(null);
  }, [confirmSlot, canReserve, makeReservation, toast]);

  // Compute slot display status
  const getSlotDisplay = useCallback(
    (slot: GeneratedSlot) => {
      if (slot.status === 'stopped') return { kind: 'break' as const };
      if (isSlotReserved(slot.time)) return { kind: 'reserved' as const };

      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const [h, m] = slot.time.split(':').map(Number);
      let slotMins = h * 60 + m;

      // Handle overnight
      if (slotMins < 6 * 60 && nowMins >= 18 * 60) slotMins += 24 * 60;
      const adjustedNow = nowMins < 6 * 60 ? nowMins + 24 * 60 : nowMins;

      if (slotMins < adjustedNow - 5) return { kind: 'passed' as const };
      if (slot.availableSeats === 0) return { kind: 'full' as const };
      if (isSlotOpen(slot.time)) return { kind: 'open' as const };

      const secsUntil = getTimeUntilOpen(slot.time);
      return { kind: 'locked' as const, opensIn: secsUntil };
    },
    [isSlotReserved, isSlotOpen, getTimeUntilOpen]
  );

  const formatCountdown = (secs: number): string => {
    if (secs <= 0) return 'Now!';
    const h = Math.floor(secs / 3600);
    const mm = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${mm}m`;
    if (mm > 0) return `${mm}m ${s}s`;
    return `${s}s`;
  };

  // ── Onboarding gate ──
  if (!isOnboarded) {
    return (
      <StudentOnboarding
        onComplete={(stop: string, bus: BusAssignment) => {
          setHomeStop(stop, bus);
          toast('🎉 Setup complete! You can now reserve trips.');
        }}
      />
    );
  }

  const activeTonight = tonightReservations.filter((r) => r.status === 'Confirmed');

  return (
    <div className="space-y-5">
      {/* Header info card */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-accent-400/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <BusIcon className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-[10px] text-primary-300 uppercase tracking-wider">Your Bus</p>
                <p className="text-sm font-bold">{busInfo?.busName || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-primary-300 uppercase tracking-wider">Your Stop</p>
                <p className="text-sm font-bold">{transport?.homeStop || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-primary-300 uppercase tracking-wider">Tonight</p>
                <p className="text-sm font-bold">{reservationsUsed} / {maxReservations} reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation limit banners */}
      {reservationsUsed === maxReservations - 1 && canReserve && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">⚠️ 1 reservation remaining tonight.</p>
        </div>
      )}
      {!canReserve && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <Ban className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-700 font-medium">
            🚫 You've reached your limit for tonight. Resets tomorrow at {to12Hour(config.operatingHours.startTime)}.
          </p>
        </div>
      )}

      {/* Operating status */}
      <div className={`rounded-xl px-4 py-3 border ${
        serviceStatus.state === 'running'
          ? 'bg-emerald-50 border-emerald-200'
          : serviceStatus.state === 'break'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              serviceStatus.state === 'running' ? 'bg-emerald-500 animate-pulse' : serviceStatus.state === 'break' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-semibold text-slate-700">
              {serviceStatus.state === 'running'
                ? `Buses running — Next at ${serviceStatus.nextDeparture}`
                : serviceStatus.state === 'break'
                ? `Break — Resumes at ${serviceStatus.resumesAt}`
                : `Offline — Resumes at ${serviceStatus.resumesAt}`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {to12Hour(config.operatingHours.startTime)} — {to12Hour(config.operatingHours.endTime)}
          </span>
        </div>
      </div>

      {/* Time Slot Grid */}
      <div>
        <h3 className="text-sm font-bold text-primary-900 mb-3">Choose Your Trip</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {generatedSlots.map((slot, i) => {
            const display = getSlotDisplay(slot);
            const canClick = display.kind === 'open' && canReserve;

            return (
              <button
                key={i}
                disabled={!canClick}
                onClick={() => canClick && setConfirmSlot(slot)}
                className={`relative rounded-2xl border p-4 text-left transition-all ${
                  display.kind === 'open' && canReserve
                    ? 'bg-white border-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100/50 cursor-pointer ring-1 ring-emerald-100'
                    : display.kind === 'reserved'
                    ? 'bg-emerald-50 border-emerald-200 cursor-default'
                    : display.kind === 'break'
                    ? 'bg-amber-50/50 border-amber-200 cursor-not-allowed opacity-60'
                    : display.kind === 'passed'
                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-40'
                    : display.kind === 'full'
                    ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-60'
                    : 'bg-white border-slate-200 cursor-not-allowed'
                }`}
              >
                {/* Departure time + badge */}
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-lg font-bold ${
                    display.kind === 'open' ? 'text-primary-900' :
                    display.kind === 'reserved' ? 'text-emerald-800' :
                    display.kind === 'passed' ? 'text-slate-400' :
                    'text-slate-600'
                  }`}>
                    {slot.label}
                  </p>

                  {display.kind === 'open' && canReserve && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Reserve Now
                    </span>
                  )}
                  {display.kind === 'open' && !canReserve && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                      Limit reached
                    </span>
                  )}
                  {display.kind === 'locked' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                      <Lock className="w-3 h-3" />
                      Opens in {formatCountdown(display.opensIn)}
                    </span>
                  )}
                  {display.kind === 'break' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600">
                      <Pause className="w-3 h-3" />
                      Break
                    </span>
                  )}
                  {display.kind === 'reserved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-800">
                      <Check className="w-3 h-3" />
                      Reserved
                    </span>
                  )}
                  {display.kind === 'passed' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">
                      Passed
                    </span>
                  )}
                  {display.kind === 'full' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-500">
                      Full
                    </span>
                  )}
                </div>

                {/* Trip details */}
                {display.kind !== 'break' ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>From: <strong className="text-primary-800">1337 School</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>To: <strong className="text-primary-800">{transport?.homeStop}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <BusIcon className="w-3 h-3 text-slate-400" />
                      <span>{slot.availableSeats} seats available</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-500">Service paused during break period.</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active reservations tonight (quick view) */}
      {activeTonight.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-primary-900 mb-3">
            Tonight's Reservations ({activeTonight.length}/{maxReservations})
          </h3>
          <div className="w-full h-2 rounded-full bg-slate-100 mb-4">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(activeTonight.length / maxReservations) * 100}%` }}
            />
          </div>
          <div className="space-y-2">
            {activeTonight.map((res) => (
              <div key={res.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{res.slotLabel}</p>
                    <p className="text-[10px] text-emerald-600">1337 School → {res.homeStop}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-200 text-emerald-800">
                  <Check className="w-3 h-3" />
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-page-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary-900">Confirm your reservation?</h3>
              <button onClick={() => setConfirmSlot(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: 'Departure', value: `${confirmSlot.label} tonight`, icon: Clock },
                { label: 'From', value: '1337 School', icon: MapPin },
                { label: 'To', value: transport?.homeStop || '—', icon: MapPin },
                { label: 'Bus', value: busInfo?.busName || '—', icon: BusIcon },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <item.icon className="w-4 h-4 text-primary-500 shrink-0" />
                  <div className="flex justify-between w-full">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-primary-900 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmSlot(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReserveASeat;
