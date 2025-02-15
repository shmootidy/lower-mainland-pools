import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import CleanestPools from './CleanestPools'
import Pool from './Pool'

const router = createBrowserRouter([
  {
    path: '/',
    element: <CleanestPools />,
  },
  {
    path: '/pool',
    element: <Pool />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
