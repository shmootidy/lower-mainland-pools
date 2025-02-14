import { DateTime } from 'luxon'
import { useGetPoolClosures } from './usePoolClosuresAPI'
import { useGetPools } from './usePoolsAPI'

interface PoolsAndClosures {
  poolName: string
  closureEndDate: Date | string
  reasonForClosure: string
}

export default function useGetPoolsAndClosures() {
  const { poolClosures, poolClosuresLoading, poolClosuresError } =
    useGetPoolClosures()

  const { pools, poolsLoading, poolsError } = useGetPools()

  const oneYearAgo = DateTime.now().minus({ year: 1 }).toISODate()
  const poolsAndClosures: PoolsAndClosures[] = pools
    .map((pool) => {
      const poolClosureData = poolClosures.find((p) => p.pool_id === pool.id)
      return {
        poolName: pool.name,
        closureEndDate: poolClosureData?.closure_end_date ?? oneYearAgo,
        reasonForClosure:
          poolClosureData?.reason_for_closure ?? 'no data available',
      }
    })
    .sort((a, b) => {
      const aDate = DateTime.fromSQL(a.closureEndDate).toMillis()
      const bDate = DateTime.fromSQL(b.closureEndDate).toMillis()
      return bDate - aDate
    })

  return {
    isLoading: poolClosuresLoading || poolsLoading,
    hasError: poolClosuresError || poolsError,
    data: poolsAndClosures,
  }
}
