import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const pageTitles: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/overview': 'Overview',
  '/admin/buses': 'Bus Management',
  '/admin/routes': 'Route & Stops',
  '/admin/users': 'User Management',
  '/admin/schedule': 'Schedule Management',
  '/admin/reports': 'Reports & Analytics',
  '/admin/notifications': 'Notifications',
};

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';
  useDocumentTitle(`${title} — Fleetmark Admin`);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6" key={location.pathname}>
          <div className="animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
