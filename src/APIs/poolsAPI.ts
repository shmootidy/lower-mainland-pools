import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

export interface Pool {
  id: number
  address: string | null
  coordinates: { x: number; y: number } | null
  amenities: string[]
  locker_type: string | null
  name: string
  notes: string | null
  url: string | null
  center_id?: number
  municipality: string
  phone?: string
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

export function useGetPoolByID(poolID: number | null) {
  async function getPoolByID() {
    const res = await fetch(`${VERCEL_URL}/getPoolsByID?poolIDs=${poolID}`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: poolByID = [],
    isLoading: poolByIDLoading,
    isError: poolByIDError,
  } = useQuery<Pool[]>({
    queryKey: [`poolID:${poolID}`],
    queryFn: getPoolByID,
    enabled: !!poolID,
  })

  return {
    poolByID,
    poolByIDLoading,
    poolByIDError,
  }
}
