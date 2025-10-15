import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import { Menu, X, Home, CheckSquare, FolderOpen, Users, MessageSquare, BarChart3, Settings, Shield } from 'lucide-react'

// Import pages
import Landing from './pages/Landing'
import LandingNew from './pages/LandingNew'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Meeting from './pages/Meeting'
import Activity from './pages/Activity'
import Team from './pages/Team'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import Insights from './pages/Insights'
import Admin from './pages/Admin'
import SettingsPage from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import LoginOtp from './pages/LoginOtp'
import VerifyEmail from './pages/VerifyEmail'

// Import onboarding pages
import PlanSelection from './pages/onboarding/PlanSelection'
import ProfileSetup from './pages/onboarding/ProfileSetup'
import ProjectDetails from './pages/onboarding/ProjectDetails'
import TeamPreference from './pages/onboarding/TeamPreference'
import TeamSetup from './pages/onboarding/TeamSetup'
import Welcome from './pages/onboarding/Welcome'

// Protected Route component
import ProtectedRoute from './app/ProtectedRoute'
import { authStore } from '@/store/auth'

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, initializing, init } = authStore()

  useEffect(() => {
    if (initializing) {
      init()
    }
  }, [initializing, init])

  // Capture access_token from URL hash after OAuth and clean it up
  useEffect(() => {
    const hash = window.location.hash || ''
    if (hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace('#', ''))
      const token = params.get('access_token')
      if (token) {
        authStore.getState().setAccessToken(token)
        authStore.getState().fetchMe().catch(() => {})
        // remove token from URL
        const { pathname, search } = window.location
        window.history.replaceState(null, '', pathname + search)
      }
    }
  }, [])

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/insights', label: 'Insights', icon: BarChart3 },
    { path: '/admin', label: 'Admin', icon: Shield },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isDashboardRoute = location.pathname === '/dashboard'
  const isScheduleRoute = location.pathname === '/schedule'
  const isTeamRoute = location.pathname === '/team'

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header - Only show when authenticated and not on dashboard, schedule, or team */}
      {user && !isDashboardRoute && !isScheduleRoute && !isTeamRoute && (
        <header className="border-b border-border bg-card">
          <nav className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gold-gradient" />
                <span className="text-xl font-semibold">Granula</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-border">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
                </div>
              )}
            </nav>
          </header>
        )}

        {/* Main Content */}
        <main className={user && !isDashboardRoute && !isScheduleRoute && !isTeamRoute ? 'container mx-auto px-4 py-8' : ''}>
          <Routes>
            {/* Public Routes - Default to new landing page */}
            <Route path="/" element={<LandingNew />} />
            <Route path="/landing/classic" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login/otp" element={<LoginOtp />} />
            
            {/* Onboarding Routes (protected) */}
            <Route path="/onboarding/plan-selection" element={<ProtectedRoute><PlanSelection /></ProtectedRoute>} />
            <Route path="/onboarding/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
            <Route path="/onboarding/project-details" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="/onboarding/team-preference" element={<ProtectedRoute><TeamPreference /></ProtectedRoute>} />
            <Route path="/onboarding/team-setup" element={<ProtectedRoute><TeamSetup /></ProtectedRoute>} />
            <Route path="/onboarding/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meeting"
              element={
                <ProtectedRoute>
                  <Meeting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <Teams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Toast notifications */}
        <Toaster position="top-right" richColors />
      </div>
    )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
