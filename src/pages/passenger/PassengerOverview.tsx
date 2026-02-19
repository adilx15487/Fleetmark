import { Link } from 'react-router-dom';
import { Ticket, Bus, MapPin, Clock, ArrowRight, TrendingUp, Calendar, XCircle, Heart, Bell } from 'lucide-react';
import {
  passengerProfile,
  passengerStats,
  nextRide,
  passengerReservations,
  passengerNotifications,
} from '../../data/passengerMockData';

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
  const upcoming = passengerReservations.filter((r) => r.status === 'Confirmed' || r.status === 'Pending');
  const recentNotifs = passengerNotifications.slice(0, 3);

  const stats = [
    { ...passengerStats.totalRides, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
    { ...passengerStats.upcomingReservations, icon: Calendar, color: 'text-accent-500', bg: 'bg-sky-50' },
    { ...passengerStats.cancelledRides, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { ...passengerStats.favoriteRoute, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-400/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-400/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {greeting()}, {passengerProfile.name.split(' ')[0]} 👋
            </h2>
            <p className="text-primary-200 mt-1 text-sm sm:text-base">
              Here's what's happening with your rides today.
            </p>
          </div>

          {/* Next ride card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-0 lg:min-w-[340px]">
            <p className="text-xs font-semibold text-accent-300 uppercase tracking-wider mb-3">Next Ride</p>
            <h3 className="text-base font-bold truncate">{nextRide.route}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-primary-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{nextRide.departureTime}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-200">
                <Ticket className="w-3.5 h-3.5" />
                <span>Seat {nextRide.seat}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-200">
                <Bus className="w-3.5 h-3.5" />
                <span>{nextRide.bus.split(' — ')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-200">
                <MapPin className="w-3.5 h-3.5" />
                <span>{nextRide.stop}</span>
              </div>
            </div>
            <p className="text-xs text-primary-300 mt-3">{nextRide.date}</p>
          </div>
        </div>

        {/* CTA */}
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
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-primary-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming reservations — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-primary-900">Upcoming Reservations</h3>
            <Link to="/passenger/reservations" className="text-xs font-semibold text-accent-500 hover:text-accent-600 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Bus</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seat</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcoming.slice(0, 4).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-primary-900 whitespace-nowrap">{r.route.split(' — ')[0]}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 hidden sm:table-cell">{r.bus}</td>
                    <td className="px-5 py-3.5 text-sm font-mono text-slate-600">{r.seat}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap">{r.date}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{r.departureTime}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        r.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent notifications — narrower */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
    </div>
  );
};

export default PassengerOverview;
