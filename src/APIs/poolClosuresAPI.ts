import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

export interface PoolClosure {
  id: number
  pool_id: number
  reason_for_closure: string | null
  event_id: number
  created_at: string
  closure_end_date: string | null
  closure_start_date: string | null
}

// useGet for database calls
export function useGetPoolClosures() {
  async function getPoolClosures() {
    const res = await fetch(`${VERCEL_URL}/getPoolClosures`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const json = await res.json()
    return json
  }

  const {
    data: poolClosures = [],
    isLoading: poolClosuresLoading,
    isError: poolClosuresError,
  } = useQuery<PoolClosure[]>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['poolClosures'],
    queryFn: getPoolClosures,
  })

  return {
    poolClosures,
    poolClosuresLoading,
    poolClosuresError,
  }
}
