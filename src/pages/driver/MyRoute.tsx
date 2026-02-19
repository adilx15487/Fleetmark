import {
  MapPinned,
  Clock,
  Bus,
  Navigation,
  Users,
  CheckCircle2,
  Circle,
  Milestone,
} from 'lucide-react';
import { driverRouteInfo, routeStops, todaysTrips } from '../../data/driverMockData';

const stopStatusStyle = {
  completed: { dot: 'bg-slate-300 border-slate-300', text: 'text-slate-400', line: 'bg-slate-300' },
  current: { dot: 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-100', text: 'text-emerald-700 font-bold', line: 'bg-emerald-400' },
  upcoming: { dot: 'bg-white border-sky-400', text: 'text-primary-800', line: 'bg-sky-200' },
};

const MyRoute = () => {
  return (
    <div className="space-y-6">
      {/* Route header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
              <MapPinned className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-900">{driverRouteInfo.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {driverRouteInfo.totalStops} stops · {driverRouteInfo.totalDistance} · ~{driverRouteInfo.estimatedDuration}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {driverRouteInfo.status}
          </span>
        </div>
      </div>

      {/* Route details cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Navigation, label: 'Total Distance', value: driverRouteInfo.totalDistance, color: 'text-primary-600', bg: 'bg-primary-50' },
          { icon: Milestone, label: 'Total Stops', value: driverRouteInfo.totalStops, color: 'text-accent-500', bg: 'bg-sky-50' },
          { icon: Clock, label: 'Est. Duration', value: driverRouteInfo.estimatedDuration, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { icon: Bus, label: 'Assigned Bus', value: driverRouteInfo.assignedBus.split(' — ')[0], color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xl font-bold text-primary-900">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Visual stop timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-primary-900">Stop Timeline</h3>
          <span className="text-xs text-slate-400">
            {routeStops.filter((s) => s.status === 'completed').length} of {routeStops.length} completed
          </span>
        </div>

        {/* Horizontal scroll on smaller screens */}
        <div className="overflow-x-auto">
          <div className="flex items-start gap-0 px-6 py-8 min-w-[800px]">
            {routeStops.map((stop, i) => {
              const style = stopStatusStyle[stop.status];
              const isLast = i === routeStops.length - 1;
              return (
                <div key={stop.id} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    {/* Dot */}
                    <div className={`w-4 h-4 rounded-full border-2 ${style.dot} shrink-0 z-10`}>
                      {stop.status === 'completed' && (
                        <CheckCircle2 className="w-3 h-3 text-white -mt-[1px] -ml-[1px]" />
                      )}
                      {stop.status === 'current' && (
                        <Circle className="w-2 h-2 text-white mt-[1px] ml-[1px]" />
                      )}
                    </div>

                    {/* Label below */}
                    <div className="mt-2 text-center w-20">
                      <p className={`text-[11px] leading-tight ${style.text}`}>{stop.name}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">{stop.estimatedArrival}</p>
                      {stop.passengerCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 mt-1 text-[10px] text-slate-400">
                          <Users className="w-2.5 h-2.5" />
                          {stop.passengerCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connecting line */}
                  {!isLast && (
                    <div className={`h-0.5 flex-1 mt-[7px] ${style.line}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-primary-900">Route Map</h3>
        </div>
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          {/* Decorative route visualization */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 320" fill="none">
            <path
              d="M60 260 Q150 40, 300 140 T540 100 T740 200"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="8,6"
              className="text-primary-400"
            />
            {[60, 180, 300, 420, 540, 660, 740].map((x, i) => (
              <circle key={i} cx={x} cy={i % 2 === 0 ? 260 - i * 20 : 100 + i * 15} r="6" className="fill-primary-400" />
            ))}
          </svg>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
              <MapPinned className="w-8 h-8 text-primary-400" />
            </div>
            <p className="text-sm font-medium text-slate-400">Interactive map coming soon</p>
            <p className="text-xs text-slate-300 mt-1">Google Maps / Mapbox integration</p>
          </div>
        </div>
      </div>

      {/* Today's trips */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-primary-900">Today's Trips</h3>
          <span className="text-xs text-slate-400">{todaysTrips.length} trips scheduled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stops</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Passengers</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todaysTrips.map((trip) => {
                const statusColors: Record<string, string> = {
                  Completed: 'bg-slate-50 text-slate-500 border-slate-200',
                  'In Progress': 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  Upcoming: 'bg-sky-50 text-sky-600 border-sky-200',
                };
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-bold text-primary-900 whitespace-nowrap">{trip.departureTime}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{trip.route}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{trip.stops}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{trip.passengers}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors[trip.status]}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyRoute;
