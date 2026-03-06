import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ScheduleProvider } from './context/ScheduleContext'
import { ReservationProvider } from './context/ReservationContext'
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
import SectionDivider from './components/ui/SectionDivider'

/* ── Layouts (eager — they are route shells) ── */
import AdminLayout from './pages/admin/AdminLayout'
import PassengerLayout from './pages/passenger/PassengerLayout'

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

const NotFound = lazy(() => import('./pages/NotFound'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))

/* ── React Query client ── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

/* ── Suspense fallback ── */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
)

/* ── Landing page (all sections on one scroll) ── */
function LandingPage() {
  useDocumentTitle('Fleetmark — 1337 Night Shuttle')
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <Hero />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <WhoWeAre />
      <SectionDivider />
      <AuthSection />
      <SectionDivider />
      <Subscribe />
      <Footer />
    </div>
  )
}

/* ── App root with routing ── */
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScheduleProvider>
        <ReservationProvider>
        <ToastProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<LandingPage />} />

          {/* 42 OAuth callback & onboarding */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Admin dashboard — protected */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="routes" element={<RouteStops />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="schedule" element={<ScheduleManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Student dashboard — protected (backend role = "passenger") */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['passenger']}><PassengerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<PassengerOverview />} />
            <Route path="reserve" element={<ReserveASeat />} />
            <Route path="reservations" element={<MyReservations />} />
            <Route path="routes" element={<PassengerRoutes />} />
            <Route path="notifications" element={<PassengerNotifications />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Legacy /passenger redirect */}
          <Route path="/passenger/*" element={<Navigate to="/student/overview" replace />} />

          {/* Driver — Coming Soon */}
          <Route path="/driver/*" element={<ComingSoon />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ToastProvider>
        </ReservationProvider>
        </ScheduleProvider>
      </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
