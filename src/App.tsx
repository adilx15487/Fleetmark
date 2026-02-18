import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteStops />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
