import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'

interface Pool {
  id: number
  address: string | null
  coordinates: { x: number; y: number } | null
  created_date: Date
  features: string | null
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
    queryKey: ['pools'],
    queryFn: getPools,
  })

  return {
    pools,
    poolsLoading,
    poolsError,
  }
}

// note: i had to useMemo the ids in the call from a component to keep this from overflowing
// but that before react-query; maybe it'll be smoother now
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
  })

  return {
    poolsByID,
    poolsByIDLoading,
    poolsByIDError,
  }
}
