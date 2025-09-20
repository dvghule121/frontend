import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from './components/layout/Sidebar/Sidebar'
import MainPanel from './components/layout/MainPanel'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import AuthGuard from './components/AuthGuard'

// Create the root route with minimal layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Create an authenticated layout route with sidebar
const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated-layout',
  component: () => (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-inter">
      <SidebarProvider>
        <AppSidebar />
        <MainPanel>
          <div className="p-2 border-b">
            <SidebarTrigger />
          </div>
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </MainPanel>
      </SidebarProvider>
    </div>
  ),
})

// Create an unauthenticated layout route without sidebar
const unauthenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'unauthenticated-layout',
  component: () => <Outlet />,
})

// Create a protected route for authenticated users
const protectedRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  id: 'protected',
  component: AuthGuard,
})

// Create the dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: Dashboard,
})

// Create the profile route
const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile',
  component: Profile,
})

// Create the register route (no sidebar layout)
const registerRoute = createRoute({
  getParentRoute: () => unauthenticatedLayoutRoute,
  path: '/register',
  component: Register,
})

// Create the login route (no sidebar layout)
const loginRoute = createRoute({
  getParentRoute: () => unauthenticatedLayoutRoute,
  path: '/login',
  component: Login,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  unauthenticatedLayoutRoute.addChildren([
    registerRoute,
    loginRoute,
  ]),
  authenticatedLayoutRoute.addChildren([
    protectedRoute.addChildren([
      dashboardRoute,
      profileRoute,
    ]),
  ]),
])

// Create the router
export const router = createRouter({ routeTree })