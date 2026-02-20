import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import useDocumentTitle from './hooks/useDocumentTitle'

/* ── Landing components (above fold — eagerly loaded) ── */
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WhoWeAre from './components/WhoWeAre'
import AuthSection from './components/AuthSection'
import Subscribe from './components/Subscribe'
import Footer from './components/Footer'

/* ── Layouts (eager — they are route shells) ── */
import AdminLayout from './pages/admin/AdminLayout'
import PassengerLayout from './pages/passenger/PassengerLayout'
import DriverLayout from './pages/driver/DriverLayout'

/* ── Lazy-loaded dashboard pages ── */
const Overview = lazy(() => import('./pages/admin/Overview'))
const BusManagement = lazy(() => import('./pages/admin/BusManagement'))
const RouteStops = lazy(() => import('./pages/admin/RouteStops'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const ScheduleManagement = lazy(() => import('./pages/admin/ScheduleManagement'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Notifications = lazy(() => import('./pages/admin/Notifications'))

const PassengerOverview = lazy(() => import('./pages/passenger/PassengerOverview'))
const ReserveASeat = lazy(() => import('./pages/passenger/ReserveASeat'))
const MyReservations = lazy(() => import('./pages/passenger/MyReservations'))
const PassengerRoutes = lazy(() => import('./pages/passenger/PassengerRoutes'))
const PassengerNotifications = lazy(() => import('./pages/passenger/PassengerNotifications'))
const ProfileSettings = lazy(() => import('./pages/passenger/ProfileSettings'))

const DriverOverview = lazy(() => import('./pages/driver/DriverOverview'))
const MyRoute = lazy(() => import('./pages/driver/MyRoute'))
const PassengerList = lazy(() => import('./pages/driver/PassengerList'))
const DriverNotifications = lazy(() => import('./pages/driver/DriverNotifications'))
const DriverProfile = lazy(() => import('./pages/driver/DriverProfile'))

const NotFound = lazy(() => import('./pages/NotFound'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const RoleSelection = lazy(() => import('./pages/RoleSelection'))

/* ── Suspense fallback ── */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
)

/* ── Landing page (all sections on one scroll) ── */
function LandingPage() {
  useDocumentTitle('Fleetmark — Smart Transportation')
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <WhoWeAre />
      <AuthSection />
      <Subscribe />
      <Footer />
    </div>
  )
}

/* ── App root with routing ── */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<LandingPage />} />

          {/* 42 OAuth callback & role selection */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/role-select" element={<RoleSelection />} />

          {/* Admin dashboard — protected */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="routes" element={<RouteStops />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="schedule" element={<ScheduleManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Passenger dashboard — protected */}
          <Route path="/passenger" element={<ProtectedRoute allowedRole="passenger"><PassengerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<PassengerOverview />} />
            <Route path="reserve" element={<ReserveASeat />} />
            <Route path="reservations" element={<MyReservations />} />
            <Route path="routes" element={<PassengerRoutes />} />
            <Route path="notifications" element={<PassengerNotifications />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Driver dashboard — protected */}
          <Route path="/driver" element={<ProtectedRoute allowedRole="driver"><DriverLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DriverOverview />} />
            <Route path="route" element={<MyRoute />} />
            <Route path="passengers" element={<PassengerList />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
