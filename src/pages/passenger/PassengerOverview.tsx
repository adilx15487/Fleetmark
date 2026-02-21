import { Link } from 'react-router-dom';
import { Ticket, Bus, MapPin, Clock, ArrowRight, TrendingUp, XCircle, Bell, Check } from 'lucide-react';
import {
  passengerStats,
  passengerNotifications,
} from '../../data/passengerMockData';
import { useAuth } from '../../context/AuthContext';
import { useReservation } from '../../context/ReservationContext';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCard, SkeletonList } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const notifIcon: Record<string, { color: string; bg: string }> = {
  reservation: { color: 'text-emerald-500', bg: 'bg-emerald-50' },
  route_change: { color: 'text-amber-500', bg: 'bg-amber-50' },
  delay: { color: 'text-orange-500', bg: 'bg-orange-50' },
  cancellation: { color: 'text-red-500', bg: 'bg-red-50' },
  system: { color: 'text-sky-500', bg: 'bg-sky-50' },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const PassengerOverview = () => {
  const { user } = useAuth();
  const { isLoading, isError, retry } = useLoadingState();
  const {
    isOnboarded,
    transport,
    tonightReservations,
    reservationsUsed,
    maxReservations,
    getBusInfo,
  } = useReservation();
  const recentNotifs = passengerNotifications.slice(0, 3);

  const activeTonight = tonightReservations.filter((r) => r.status === 'Confirmed');
  const nextTrip = activeTonight.length > 0 ? activeTonight[0] : null;
  const busInfo = getBusInfo();

  const stats = [
    { ...passengerStats.totalRides, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
    { value: `${reservationsUsed}/${maxReservations}`, label: 'Tonight', icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { ...passengerStats.cancelledRides, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { value: transport?.homeStop || '—', label: 'Home Stop', icon: MapPin, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8"><SkeletonCard /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <SkeletonList className="lg:col-span-3" items={3} />
          <SkeletonList className="lg:col-span-2" items={3} />
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={retry} />;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-400/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-400/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {greeting()}, {user?.name.split(' ')[0] || 'there'} 👋
            </h2>
            <p className="text-primary-200 mt-1 text-sm sm:text-base">
              {isOnboarded
                ? "Here's your shuttle status for tonight."
                : 'Set up your transport to start reserving trips.'}
            </p>
          </div>

          {/* Tonight's status card */}
          {isOnboarded ? (
            nextTrip ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-0 lg:min-w-[320px]">
                <p className="text-xs font-semibold text-accent-300 uppercase tracking-wider mb-2">Next Trip Tonight</p>
                <h3 className="text-xl font-bold">{nextTrip.slotLabel} 🚌</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                  <div className="flex items-center gap-2 text-primary-200">
                    <Bus className="w-3.5 h-3.5" />
                    <span>{busInfo?.busNumber || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-200">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{nextTrip.homeStop}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Link
                    to="/passenger/reservations"
                    className="text-xs font-semibold text-accent-300 hover:text-accent-200 transition-colors"
                  >
                    View all →
                  </Link>
                  <Link
                    to="/passenger/reserve"
                    className="text-xs font-semibold text-primary-300 hover:text-white transition-colors"
                  >
                    Cancel →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-0 lg:min-w-[320px]">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Tonight</p>
                <p className="text-sm text-primary-200">You haven't reserved a trip tonight yet.</p>
                <Link
                  to="/passenger/reserve"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-accent-400 text-primary-900 text-sm font-bold hover:bg-accent-300 transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  Reserve Now
                </Link>
              </div>
            )
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-0 lg:min-w-[320px]">
              <p className="text-sm text-primary-200">Complete your setup to start using the shuttle.</p>
              <Link
                to="/passenger/reserve"
                className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-accent-400 text-primary-900 text-sm font-bold hover:bg-accent-300 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* CTA */}
        {isOnboarded && (
          <div className="relative z-10 mt-6">
            <Link
              to="/passenger/reserve"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-400 text-primary-900 text-sm font-bold hover:bg-accent-300 transition-colors shadow-lg shadow-accent-400/25"
            >
              <Ticket className="w-4 h-4" />
              Reserve a Seat
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Reservation counter widget */}
      {isOnboarded && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-primary-900">
              {reservationsUsed} / {maxReservations} trips reserved tonight
            </h3>
            <span className="text-xs text-slate-400">Resets at 10:00 PM</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100">
            <div
              className={`h-3 rounded-full transition-all ${
                reservationsUsed >= maxReservations ? 'bg-red-500' : reservationsUsed >= maxReservations - 1 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(reservationsUsed / maxReservations) * 100}%` }}
            />
          </div>
          {activeTonight.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {activeTonight.map((res) => (
                <div key={res.id} className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="font-semibold text-primary-900">{res.slotLabel}</span>
                  <span className="text-slate-300">→</span>
                  <span>{res.homeStop}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-primary-900 truncate">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-primary-900">Recent Notifications</h3>
          <Link to="/passenger/notifications" className="text-xs font-semibold text-accent-500 hover:text-accent-600 transition-colors">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentNotifs.map((n) => {
            const style = notifIcon[n.type] || notifIcon.system;
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
  );
};

export default PassengerOverview;
