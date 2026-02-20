import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PassengerSidebar from '../../components/passenger/PassengerSidebar';
import PassengerTopbar from '../../components/passenger/PassengerTopbar';
import ScheduleStatusBanner from '../../components/passenger/ScheduleStatusBanner';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const pageTitles: Record<string, string> = {
  '/passenger': 'Overview',
  '/passenger/overview': 'Overview',
  '/passenger/reserve': 'Reserve a Seat',
  '/passenger/reservations': 'My Reservations',
  '/passenger/routes': 'Routes & Stops',
  '/passenger/notifications': 'Notifications',
  '/passenger/profile': 'Profile Settings',
};

const PassengerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';
  useDocumentTitle(`${title} — Fleetmark`);

  return (
    <div className="min-h-screen bg-slate-50">
      <PassengerSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <PassengerTopbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6" key={location.pathname}>
          <ScheduleStatusBanner />
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Official shuttle stops only.</span> No pick-up or drop-off outside designated points. Stops are revised once per year.
            </p>
          </div>
          <div className="animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PassengerLayout;
