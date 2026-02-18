import { NavLink } from 'react-router-dom';
import {
  Bus,
  LayoutDashboard,
  MapPinned,
  Users,
  CalendarDays,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/admin/overview' },
  { label: 'Bus Management', icon: Bus, path: '/admin/buses' },
  { label: 'Route & Stops', icon: MapPinned, path: '/admin/routes' },
  { label: 'User Management', icon: Users, path: '/admin/users' },
  { label: 'Schedule', icon: CalendarDays, path: '/admin/schedule' },
  { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
  { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
];

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-primary-700/30 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
          <Bus className="w-5 h-5 text-accent-400" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
            Fleetmark
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-accent-400/15 text-accent-400'
                  : 'text-primary-300/70 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Profile section at bottom */}
      <div className="border-t border-primary-700/30 px-3 py-4 shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            AB
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Adil Bourji</p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-400/20 text-accent-400 uppercase tracking-wider">
                Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-10 border-t border-primary-700/30 text-primary-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-primary-900 border-r border-primary-800/50 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
