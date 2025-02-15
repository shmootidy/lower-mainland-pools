import { DateTime } from 'luxon'
import { PoolClosure, useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { Pool, useGetPools } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'
import {
  FilteredEvent,
  getFilteredPoolEventsForToday,
  getFirstEventTomorrow,
} from '../utils/poolsUtils'

export type ReasonForClosure = 'annual maintenance' | 'unknown' | null
interface PoolsAndClosures {
  poolName: string
  nextPoolOpenDate: string
  reasonForClosure: ReasonForClosure
  link: string
  poolUrl: string
  lastClosedForCleaningReopenDate: string | null
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

  const now = DateTime.now()

  const poolsAndClosures: PoolsAndClosures[] = poolCalendars.map((c) => {
    const pool = poolsGroupedByCentreID[c.center_id]
    const poolClosure = poolClosuresGroupedByPoolID[pool.id]
    const todaysEvents = getFilteredPoolEventsForToday(c.events, [], now)

    const isPoolClosedForCleaning = poolClosure?.closure_end_date
      ? DateTime.fromSQL(poolClosure.closure_end_date) > now
      : false

    // will pool retain its "reason for closure" if it's open?
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
      link: `${pool?.id}`,
      poolUrl: pool?.url ?? '',
      isOpen: isPoolOpenNow(todaysEvents, isPoolClosedForCleaning),
    }
  })

  return {
    isLoading: poolClosuresLoading || poolCalendarsLoading || poolsLoading,
    hasError: poolClosuresError || poolCalendarsError || poolsError,
    data: poolsAndClosures,
  }
}

function getReasonForClosure(
  reasonForClosure?: string | null
): ReasonForClosure {
  if (!reasonForClosure) {
    return null
  }
  if (reasonForClosure === 'annual maintenance') {
    return 'annual maintenance'
  }
  return 'unknown'
}

function isPoolOpenNow(
  todaysEvents: FilteredEvent[],
  isPoolClosedForCleaning: boolean
) {
  if (isPoolClosedForCleaning) {
    return false
  }
  const currentEvent = todaysEvents.filter((e) => e.timeline === 'present')
  if (currentEvent.every((e) => e.title.includes('Closure'))) {
    return false
  }
  return !!currentEvent.length
}

function getNextPoolOpenDate(
  todaysEvents: FilteredEvent[],
  firstEventTomorrow: FilteredEvent,
  now: DateTime<boolean>,
  poolClosure?: PoolClosure
): string {
  const isPoolClosedForCleaning = poolClosure?.closure_end_date
    ? DateTime.fromSQL(poolClosure.closure_end_date) > now
    : false
  if (isPoolClosedForCleaning) {
    const closureEndDate = poolClosure?.closure_end_date
    return closureEndDate
      ? DateTime.fromSQL(closureEndDate).plus({ days: 1 }).toISODate() ??
          'unknown'
      : 'unknown'
  }

  const firstFutureEventToday = todaysEvents.find(
    (e) => e.timeline === 'future'
  )
  if (firstFutureEventToday) {
    return firstFutureEventToday.start.toFormat('ccc d t')
  }
  return firstEventTomorrow.start.toFormat('ccc d t')
}
