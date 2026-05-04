import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import ActivitiesPage from '../pages/ActivitiesPage'
import CropsPage from '../pages/CropsPage'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ResourcesPage from '../pages/ResourcesPage'
import SchedulesPage from '../pages/SchedulesPage'

export const appRouter = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/crops',
            element: <CropsPage />,
          },
          {
            path: '/activities',
            element: <ActivitiesPage />,
          },
          {
            path: '/resources',
            element: <ResourcesPage />,
          },
          {
            path: '/schedules',
            element: <SchedulesPage />,
          },
        ],
      },
    ],
  },
])
