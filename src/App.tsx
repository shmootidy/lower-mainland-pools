import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'
import CleanestPools from './CleanestPools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CleanestPools />
    </QueryClientProvider>
  )
}

export default App
