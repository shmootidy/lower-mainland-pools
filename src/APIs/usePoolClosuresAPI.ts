import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

interface PoolClosure {
  id: number
  pool_id: number
  reason_for_closure: string | null
  event_id: number
  created_at: Date
  closure_end_date: string
}

export function useGetPoolClosures() {
  async function getPoolClosures() {
    const res = await fetch(`${VERCEL_URL}/getPoolClosures`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
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
