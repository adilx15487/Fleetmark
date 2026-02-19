import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DriverSidebar from '../../components/driver/DriverSidebar';
import DriverTopbar from '../../components/driver/DriverTopbar';

const pageTitles: Record<string, string> = {
  '/driver': 'Overview',
  '/driver/overview': 'Overview',
  '/driver/route': 'My Route',
  '/driver/passengers': 'Passenger List',
  '/driver/notifications': 'Notifications',
  '/driver/profile': 'Profile Settings',
};

const DriverLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50">
      <DriverSidebar
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
        <DriverTopbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
