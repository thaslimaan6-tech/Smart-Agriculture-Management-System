import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../services/authStorage'

const ProtectedRoute = () => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
