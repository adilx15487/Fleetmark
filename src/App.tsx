import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhoWeAre from './components/WhoWeAre'
import Features from './components/Features'
import AuthSection from './components/AuthSection'
import Subscribe from './components/Subscribe'
import Footer from './components/Footer'
import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Overview'
import BusManagement from './pages/admin/BusManagement'
import RouteStops from './pages/admin/RouteStops'
import UserManagement from './pages/admin/UserManagement'
import ScheduleManagement from './pages/admin/ScheduleManagement'
import Reports from './pages/admin/Reports'
import Notifications from './pages/admin/Notifications'
import PassengerLayout from './pages/passenger/PassengerLayout'
import PassengerOverview from './pages/passenger/PassengerOverview'
import ReserveASeat from './pages/passenger/ReserveASeat'
import MyReservations from './pages/passenger/MyReservations'
import PassengerRoutes from './pages/passenger/PassengerRoutes'
import PassengerNotifications from './pages/passenger/PassengerNotifications'
import ProfileSettings from './pages/passenger/ProfileSettings'
import DriverLayout from './pages/driver/DriverLayout'
import DriverOverview from './pages/driver/DriverOverview'
import MyRoute from './pages/driver/MyRoute'
import PassengerList from './pages/driver/PassengerList'
import DriverNotifications from './pages/driver/DriverNotifications'
import DriverProfile from './pages/driver/DriverProfile'

/* ── Landing page (all sections on one scroll) ── */
function LandingPage() {
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
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<LandingPage />} />

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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
