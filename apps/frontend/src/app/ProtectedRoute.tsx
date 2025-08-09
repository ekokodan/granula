import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  // TODO: Implement authentication check
  const isAuthenticated = false // Replace with actual auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}