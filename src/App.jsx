import './App.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

/**
 * App Component
 * 
 * Main application component that provides routing functionality
 * 
 * @returns {JSX.Element} The App component
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
