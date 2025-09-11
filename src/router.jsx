import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from './components/layout/Sidebar/Sidebar'
import MainPanel from './components/layout/MainPanel'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

// Create the root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-inter">
      <SidebarProvider>
        <AppSidebar />
        <MainPanel>
          <div className="p-4 border-b">
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

// Create the dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

// Create the profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  profileRoute,
])

// Create the router
export const router = createRouter({ routeTree })