import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PassengerSidebar from '../../components/passenger/PassengerSidebar';
import PassengerTopbar from '../../components/passenger/PassengerTopbar';

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
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PassengerLayout;
