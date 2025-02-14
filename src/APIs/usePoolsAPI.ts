import { useEffect, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [pools, setPools] = useState<Pool[]>([])

  useEffect(() => {
    setIsLoading(true)
    fetch(`http://localhost:3001/api/getPools`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        setPools(data)
      })
      .catch((err) => {
        console.log('error!', err)
        setIsLoading(false)
        setHasError(true)
      })
  }, [])

  return {
    pools,
    poolsLoading: isLoading,
    poolsError: hasError,
  }
}

// note: i had to useMemo the ids in the call from a component to keep this from overflowing
export function useGetPoolsByID(poolIDs: number[]) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [poolsByID, setPoolsByID] = useState<Pool[]>([])

  useEffect(() => {
    setIsLoading(true)

    if (poolIDs.length) {
      fetch(`http://localhost:3001/api/getPoolsByID?poolIDs=${poolIDs}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          setPoolsByID(data)
        })
        .catch((err) => {
          console.log('error!', err)
          setIsLoading(false)
          setHasError(true)
        })
    }
  }, [poolIDs])

  return {
    poolsByID,
    poolsByIDLoading: isLoading,
    poolsByIDError: hasError,
  }
}
