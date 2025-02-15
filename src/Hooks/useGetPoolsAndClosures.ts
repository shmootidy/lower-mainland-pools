import { DateTime } from 'luxon'
import { PoolClosure, useGetPoolClosures } from '../APIs/usePoolClosuresAPI'
import { Pool, useGetPools } from '../APIs/usePoolsAPI'
import {
  PoolEvent,
  useGetVancouverPoolCalendars,
} from '../APIs/useVancouverPoolCalendarsAPI'
import {
  getFilteredPoolEventsForToday,
  getFirstEventTomorrow,
} from '../utils/poolTimesUtils'

interface PoolsAndClosures {
  poolName: string
  closureEndDate: string | null
  reasonForClosure: string | null
  link: string
  poolUrl: string
  isOpen: boolean
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

  const now = DateTime.now().toMillis()

  const poolsAndClosures: PoolsAndClosures[] = poolCalendars.map((c) => {
    const pool = poolsGroupedByCentreID[c.center_id]
    const poolClosure = poolClosuresGroupedByPoolID[pool.id]
    const filteredEvents = getFilteredPoolEventsForToday(c.events, false)
    const lastEvent = filteredEvents[filteredEvents.length - 1]
    const lastEventClosingTime = lastEvent.end
    const isPoolClosedForCleaning = poolClosure?.closure_end_date
      ? DateTime.fromSQL(poolClosure.closure_end_date).toMillis() > now
      : false
    const isOpen =
      now < lastEventClosingTime.toMillis() && !isPoolClosedForCleaning
    const firstEventTomorrow = getFirstEventTomorrow(c.events)

    return {
      poolName: pool?.name ?? 'name not found',
      closureEndDate: getClosureEndDate(
        firstEventTomorrow,
        isPoolClosedForCleaning,
        poolClosure?.closure_end_date
      ),
      reasonForClosure: getReasonForClosureMessage(
        poolClosure?.reason_for_closure
      ),
      link: `${pool?.id}`,
      poolUrl: pool?.url ?? '',
      isOpen,
    }
  })

  return {
    isLoading: poolClosuresLoading || poolCalendarsLoading || poolsLoading,
    hasError: poolClosuresError || poolCalendarsError || poolsError,
    data: poolsAndClosures,
  }
}

function getReasonForClosureMessage(reasonForClosure: string | null) {
  if (!reasonForClosure) {
    return null
  }
  if (reasonForClosure === 'annual maintenance') {
    return reasonForClosure
  }
  return 'uncertain; check site'
}

function getClosureEndDate(
  firstEventTomorrow: PoolEvent,
  isPoolClosedForCleaning: boolean,
  closureEndDate: string | null
) {
  if (isPoolClosedForCleaning) {
    return closureEndDate
      ? DateTime.fromSQL(closureEndDate).plus({ days: 1 }).toISODate()
      : 'unknown'
  }
  return DateTime.fromSQL(firstEventTomorrow.start_time).toFormat('ff')
}

/**
 * name         open                                    reopens
 * Britannia    X       after hours                     tomorrow
 * Killarney    X       closed for annual maintenance   mar 14 2025
 * Byng         V       until 9:00pm                    tomorrow
 */
