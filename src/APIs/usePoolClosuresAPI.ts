import { useEffect, useState } from 'react'
import VERCEL_URL from '../utils/apiUrls'

interface PoolClosure {
  id: number
  pool_id: number
  reason_for_closure: string | null
  event_id: number
  created_at: Date
  closure_end_date: string
}

export function useGetPoolClosures() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [poolClosures, setPoolClosures] = useState<PoolClosure[]>([])

  useEffect(() => {
    setIsLoading(true)

    fetch(`${VERCEL_URL}/getPoolClosures`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        setPoolClosures(data)
      })
      .catch((err) => {
        console.log('error!', err)
        setIsLoading(false)
        setHasError(true)
      })
  }, [])

  return {
    poolClosures,
    poolClosuresLoading: isLoading,
    poolClosuresError: hasError,
  }
}
