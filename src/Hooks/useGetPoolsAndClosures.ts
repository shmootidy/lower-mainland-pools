import { DateTime } from 'luxon'

import { PoolClosure, useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { Pool, useGetPools } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'
import {
  getFilteredPoolEventsForToday,
  getFirstEventTomorrow,
} from '../utils/poolsUtils'
import {
  getNextPoolOpenDate,
  getReasonForClosure,
  getPoolOpenStatus,
} from '../utils/poolsAndClosuresUtils'

export type ReasonForClosure = 'annual maintenance' | 'unknown' | null
export type OpenStatus = 'open' | 'closed' | 'mismatch'

interface PoolsAndClosures {
  poolName: string
  nextPoolOpenDate: string | null
  reasonForClosure: ReasonForClosure
  poolID: number
  poolUrl: string
  lastClosedForCleaningReopenDate: string | null
  openStatus: OpenStatus
}

export default function useGetPoolsAndClosures() {
  const { poolClosures, poolClosuresLoading, poolClosuresError } =
    useGetPoolClosures()
  const { pools, poolsLoading, poolsError } = useGetPools()
  const { poolCalendars, poolCalendarsLoading, poolCalendarsError } =
    useGetVancouverPoolCalendars()

  const poolClosuresGroupedByPoolID: { [poolID: number]: PoolClosure } = {}
  poolClosures.forEach((c) => {
    poolClosuresGroupedByPoolID[c.pool_id] = c
  })
  const poolsGroupedByCentreID: { [centreID: number]: Pool } = {}
  pools.forEach((p) => {
    poolsGroupedByCentreID[p.center_id] = p
  })

  const now = DateTime.now()

  const poolsAndClosures: PoolsAndClosures[] = poolCalendars.map((c) => {
    const pool = poolsGroupedByCentreID[c.center_id]
    const poolClosure = poolClosuresGroupedByPoolID[pool?.id]
    const todaysEvents = getFilteredPoolEventsForToday(c.events, [], now)

    return {
      poolName: pool?.name ?? 'name not found',
      nextPoolOpenDate: getNextPoolOpenDate(
        todaysEvents,
        getFirstEventTomorrow(c.events, now),
        now,
        poolClosure
      ),
      lastClosedForCleaningReopenDate: poolClosure?.closure_end_date ?? null,
      reasonForClosure: getReasonForClosure(poolClosure?.reason_for_closure),
      poolID: pool?.id,
      poolUrl: pool?.url ?? '',
      openStatus: getPoolOpenStatus(todaysEvents, now, poolClosure),
    }
  })

  return {
    isLoading: poolClosuresLoading || poolCalendarsLoading || poolsLoading,
    hasError: poolClosuresError || poolCalendarsError || poolsError,
    data: poolsAndClosures,
  }
}
