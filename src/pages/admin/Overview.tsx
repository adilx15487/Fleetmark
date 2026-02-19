import {
  Bus,
  MapPinned,
  Users,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  Send,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { dashboardStats, dailyReservations, capacityData, recentActivities } from '../../data/mockData';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const statIcons = [Bus, MapPinned, Users, CalendarCheck];
const statColors = [
  'bg-primary-500/10 text-primary-600',
  'bg-accent-500/10 text-accent-600',
  'bg-emerald-500/10 text-emerald-600',
  'bg-amber-500/10 text-amber-600',
];

const statusClasses: Record<string, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Cancelled: 'bg-red-50 text-danger-500 border-red-200',
};

const Overview = () => {
  const { isLoading, isError, retry } = useLoadingState();

  const stats = [
    dashboardStats.totalBuses,
    dashboardStats.activeRoutes,
    dashboardStats.totalUsers,
    dashboardStats.todayReservations,
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <SkeletonChart className="lg:col-span-3" />
          <SkeletonChart className="lg:col-span-2" />
        </div>
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={retry} />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = statIcons[i];
          const isPositive = stat.change >= 0;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-primary-100/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${statColors[i]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-danger-500'
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? '+' : ''}{stat.change}%
                </div>
              </div>
              <p className="text-2xl font-bold text-primary-900">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Line chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-base font-bold text-primary-900 mb-4">Daily Reservations</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyReservations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={4} />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0,0,0,.08)',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-base font-bold text-primary-900 mb-4">Bus Capacity Usage</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capacityData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {capacityData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-slate-500">{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-primary-900">Recent Activity</h3>
          <span className="text-xs text-slate-400">{recentActivities.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                {['User', 'Route', 'Bus', 'Seat', 'Status', 'Time'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivities.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-primary-900 whitespace-nowrap">{a.user}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.route}</td>
                  <td className="px-5 py-3.5 text-slate-500">{a.bus}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono">{a.seat}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusClasses[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing 1-{recentActivities.length} of {recentActivities.length}</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100">2</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100">3</button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Add New Bus', icon: Plus, color: 'bg-primary-600 hover:bg-primary-700' },
          { label: 'Add New Route', icon: MapPinned, color: 'bg-accent-500 hover:bg-accent-600' },
          { label: 'Generate Report', icon: FileText, color: 'bg-emerald-600 hover:bg-emerald-700' },
          { label: 'Send Notification', icon: Send, color: 'bg-amber-500 hover:bg-amber-600' },
        ].map((action) => (
          <button
            key={action.label}
            className={`${action.color} text-white rounded-2xl p-4 flex items-center gap-3 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]`}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Overview;
