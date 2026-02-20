import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinned,
  Users,
  Clock,
  Bus,
  Bell,
  Power,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Pause,
  Timer,
} from 'lucide-react';
import {
  driverStats,
  currentShift,
  driverNotifications,
} from '../../data/driverMockData';
import { useAuth } from '../../context/AuthContext';
import { useSchedule, to12Hour } from '../../context/ScheduleContext';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCard, SkeletonList } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const notifColor: Record<string, { color: string; bg: string }> = {
  new_passenger: { color: 'text-sky-500', bg: 'bg-sky-50' },
  cancellation: { color: 'text-orange-500', bg: 'bg-orange-50' },
  route_change: { color: 'text-amber-500', bg: 'bg-amber-50' },
  schedule_update: { color: 'text-violet-500', bg: 'bg-violet-50' },
  maintenance: { color: 'text-red-500', bg: 'bg-red-50' },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const DriverOverview = () => {
  const { user } = useAuth();
  const { generatedSlots, serviceStatus, config } = useSchedule();
  const { isLoading, isError, retry } = useLoadingState();
  const [onDuty, setOnDuty] = useState(currentShift.status === 'on-duty');
  const [, setTick] = useState(0);
  const recentNotifs = driverNotifications.slice(0, 3);

  // Refresh countdown every 30s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Derive trip statuses from current time
  const scheduleTrips = useMemo(() => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    return generatedSlots.map((slot) => {
      const [h, m] = slot.time.split(':').map(Number);
      const slotMins = h * 60 + m;

      let displayStatus: 'Completed' | 'In Progress' | 'Upcoming' | 'Break';
      if (slot.status === 'stopped') {
        displayStatus = 'Break';
      } else if (config.operatingHours.overnight) {
        // For overnight schedules, handle the wrap-around
        const afterMidnight = nowMins < 12 * 60;
        const slotAfterMidnight = slotMins < 12 * 60;
        if (afterMidnight && slotAfterMidnight) {
          displayStatus = slotMins < nowMins ? 'Completed' : slotMins <= nowMins + 30 ? 'In Progress' : 'Upcoming';
        } else if (!afterMidnight && !slotAfterMidnight) {
          displayStatus = slotMins < nowMins ? 'Completed' : slotMins <= nowMins + 30 ? 'In Progress' : 'Upcoming';
        } else {
          displayStatus = afterMidnight ? 'Completed' : 'Upcoming';
        }
      } else {
        displayStatus = slotMins < nowMins - 30 ? 'Completed' : slotMins <= nowMins + 30 ? 'In Progress' : 'Upcoming';
      }

      return { slot, displayStatus };
    });
  }, [generatedSlots, config.operatingHours.overnight]);

  const activeTrips = scheduleTrips.filter((t) => t.displayStatus !== 'Break').length;
  const breakTrips = scheduleTrips.filter((t) => t.displayStatus === 'Break').length;

  const stats = [
    {
      ...driverStats.assignedRoute,
      icon: MapPinned,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      ...driverStats.passengersToday,
      icon: Users,
      color: 'text-accent-500',
      bg: 'bg-sky-50',
    },
    {
      label: 'Next Departure',
      value: serviceStatus.state === 'running'
        ? serviceStatus.nextDeparture
        : serviceStatus.state === 'break'
        ? 'On Break'
        : 'Offline',
      subtext: serviceStatus.state === 'running'
        ? 'Upcoming'
        : serviceStatus.state === 'break'
        ? `Resumes ${serviceStatus.resumesAt}`
        : `Resumes ${serviceStatus.resumesAt}`,
      icon: serviceStatus.state === 'break' ? Timer : Clock,
      color: serviceStatus.state === 'running' ? 'text-emerald-500' : serviceStatus.state === 'break' ? 'text-amber-500' : 'text-slate-400',
      bg: serviceStatus.state === 'running' ? 'bg-emerald-50' : serviceStatus.state === 'break' ? 'bg-amber-50' : 'bg-slate-50',
    },
    {
      ...driverStats.busInfo,
      icon: Bus,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
  ];

  const tripStatusStyle: Record<string, { text: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
    Completed: { text: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: CheckCircle2 },
    'In Progress': { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Loader2 },
    Upcoming: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', icon: Clock },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8"><SkeletonCard /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <SkeletonList className="lg:col-span-3" items={5} />
          <SkeletonList className="lg:col-span-2" items={3} />
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={retry} />;

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-colors duration-300 ${
          onDuty
            ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800'
            : 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700'
        }`}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {greeting()}, {user?.name.split(' ')[0] || 'Driver'} 👋
            </h2>
            <p className="text-white/70 mt-1 text-sm sm:text-base">
              {onDuty ? "You're on duty. Drive safe!" : "You're currently off duty."}
            </p>

            {onDuty && (
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {currentShift.startTime} — {currentShift.endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinned className="w-3.5 h-3.5" />
                  {currentShift.routeName}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setOnDuty(!onDuty)}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.97] shadow-lg shrink-0 ${
              onDuty
                ? 'bg-white text-emerald-700 hover:bg-white/90 shadow-emerald-800/30'
                : 'bg-white text-slate-600 hover:bg-white/90 shadow-slate-700/30'
            }`}
          >
            <Power className="w-5 h-5" />
            {onDuty ? 'ON DUTY' : 'OFF DUTY'}
            <span className={`w-3 h-3 rounded-full ${onDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-primary-900">{stat.value}</p>
              {'subtext' in stat && stat.subtext && (
                <p className="text-xs text-slate-400 mt-0.5">{stat.subtext}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Today's schedule — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-primary-900">Today's Schedule</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{activeTrips} trips</span>
              {breakTrips > 0 && (
                <span className="text-amber-500">{breakTrips} break{breakTrips > 1 ? 's' : ''}</span>
              )}
              <span className="text-slate-300">
                {to12Hour(config.operatingHours.startTime)} — {to12Hour(config.operatingHours.endTime)}
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {scheduleTrips.map(({ slot, displayStatus }, i) => {
              const isBreak = displayStatus === 'Break';
              const style = isBreak
                ? { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Pause }
                : tripStatusStyle[displayStatus];
              const StatusIcon = style.icon;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                    isBreak
                      ? 'bg-amber-50/30'
                      : displayStatus === 'In Progress'
                      ? 'bg-emerald-50/40'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        isBreak
                          ? 'bg-amber-300 border-amber-400'
                          : displayStatus === 'Completed'
                          ? 'bg-slate-300 border-slate-300'
                          : displayStatus === 'In Progress'
                          ? 'bg-emerald-500 border-emerald-500 animate-pulse'
                          : 'bg-white border-sky-400'
                      }`}
                    />
                  </div>

                  {/* Time */}
                  <div className="w-24 shrink-0">
                    <p className={`text-sm font-bold ${
                      isBreak ? 'text-amber-600' : displayStatus === 'Completed' ? 'text-slate-400' : 'text-primary-900'
                    }`}>
                      {slot.label}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {isBreak ? (
                      <div>
                        <p className="text-sm font-medium text-amber-600">Break Period</p>
                        <p className="text-xs text-amber-400">{slot.reason || 'Scheduled break'}</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm font-medium ${displayStatus === 'Completed' ? 'text-slate-400' : 'text-primary-800'}`}>
                          {currentShift.routeName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {slot.availableSeats}/{slot.totalSeats} seats available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.bg} ${style.text} ${style.border} shrink-0`}
                  >
                    <StatusIcon className={`w-3 h-3 ${displayStatus === 'In Progress' ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{displayStatus}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent notifications — narrower */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-primary-900">Recent Notifications</h3>
            <Link
              to="/driver/notifications"
              className="text-xs font-semibold text-accent-500 hover:text-accent-600 transition-colors inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentNotifs.map((n) => {
              const style = notifColor[n.type] || notifColor.new_passenger;
              return (
                <div key={n.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Bell className={`w-4 h-4 ${style.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-primary-900 truncate">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
                    <p className="text-[11px] text-slate-300 mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverOverview;
