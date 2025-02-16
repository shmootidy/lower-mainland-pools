import { createHashRouter, RouterProvider } from 'react-router-dom'

import './App.css'
import CleanestPools from './Views/CleanestPools'
import Pool from './Views/Pool'

const router = createHashRouter([
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
