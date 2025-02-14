import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

interface Pool {
  id: number
  address: string | null
  coordinates: { x: number; y: number } | null
  created_date: Date
  amenities: string[]
  locker_type: string | null
  name: string
  notes: string | null
  url: string | null
}

export function useGetPools() {
  async function getPools() {
    const res = await fetch(`${VERCEL_URL}/getPools`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: pools = [],
    isLoading: poolsLoading,
    isError: poolsError,
  } = useQuery<Pool[]>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['pools'],
    queryFn: getPools,
  })

  return {
    pools,
    poolsLoading,
    poolsError,
  }
}

export function useGetPoolsByID(poolIDs: number[]) {
  async function getPoolsByID() {
    const res = await fetch(`${VERCEL_URL}/getPoolsByID?poolIDs=${poolIDs}`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: poolsByID = [],
    isLoading: poolsByIDLoading,
    isError: poolsByIDError,
  } = useQuery<Pool[]>({
    queryKey: [`poolIDs:${poolIDs}`],
    queryFn: getPoolsByID,
    enabled: !!poolIDs.length,
  })

  return {
    poolsByID,
    poolsByIDLoading,
    poolsByIDError,
  }
}
