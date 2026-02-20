import { NavLink } from 'react-router-dom';
import {
  Bus,
  Home,
  MapPinned,
  Users,
  Bell,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { driverNotifications } from '../../data/driverMockData';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { label: 'Overview', icon: Home, path: '/driver/overview' },
  { label: 'My Route', icon: MapPinned, path: '/driver/route' },
  { label: 'Passenger List', icon: Users, path: '/driver/passengers' },
  { label: 'Notifications', icon: Bell, path: '/driver/notifications', badge: driverNotifications.filter((n) => !n.read).length },
  { label: 'Profile Settings', icon: UserCog, path: '/driver/profile' },
];

const DriverSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const { user } = useAuth();

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
            <div className="relative shrink-0">
              <item.icon className="w-5 h-5" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Profile section at bottom */}
      <div className="border-t border-primary-700/30 px-3 py-4 shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user?.avatar || ''}
            alt={user?.name || 'Driver'}
            className="w-9 h-9 rounded-full bg-slate-200 shrink-0 object-cover"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Driver'}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-400/20 text-sky-400 uppercase tracking-wider">
                  Driver
                </span>
                {user?.authProvider === '42' && user?.campus && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white/70 uppercase tracking-wider">
                    {user.campus}
                  </span>
                )}
              </div>
              {user?.authProvider === '42' && user?.login42 && (
                <p className="text-[10px] text-primary-300 truncate mt-0.5">@{user.login42}</p>
              )}
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

export default DriverSidebar;
