import { createHashRouter, RouterProvider } from 'react-router-dom'

import './App.css'
import Pool from './Views/Pool'
import PoolsOverview from './Views/PoolsOverview'

const router = createHashRouter([
  {
    path: '/',
    element: <PoolsOverview />,
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
