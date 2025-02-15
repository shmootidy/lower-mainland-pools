import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient()
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       gcTime: 0, // Prevents caching issues
  //       retry: false, // Stops retry loops
  //       staleTime: 0, // Ensures it always fetches
  //       refetchOnReconnect: false,
  //       refetchOnWindowFocus: false,
  //     },
  //   },
  // })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
