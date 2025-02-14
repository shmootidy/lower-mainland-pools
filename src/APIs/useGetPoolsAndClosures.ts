import { useGetPoolClosures } from './usePoolClosuresAPI'
import { useGetPools } from './usePoolsAPI'

interface PoolsAndClosures {
  poolName: string
  closureEndDate: string | null
  reasonForClosure: string | null
}

export default function useGetPoolsAndClosures() {
  const { poolClosures, poolClosuresLoading, poolClosuresError } =
    useGetPoolClosures()

  const { pools, poolsLoading, poolsError } = useGetPools()

  const poolsAndClosures: PoolsAndClosures[] = pools.map((pool) => {
    const poolClosureData = poolClosures.find((p) => p.pool_id === pool.id)
    return {
      poolName: pool.name,
      closureEndDate: poolClosureData?.closure_end_date ?? null,
      reasonForClosure: getClosureDataMessage(
        poolClosureData?.reason_for_closure ?? null
      ),
    }
  })

  return {
    isLoading: poolClosuresLoading || poolsLoading,
    hasError: poolClosuresError || poolsError,
    data: poolsAndClosures,
  }
}

function getClosureDataMessage(reasonForClosure: string | null) {
  if (!reasonForClosure) {
    return null
  }
  if (reasonForClosure === 'annual maintenance') {
    return reasonForClosure
  }
  return 'uncertain'
}
