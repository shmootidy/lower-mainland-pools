import { DateTime } from 'luxon'
import { OpenStatus, ReasonForClosure } from '../Hooks/useGetPoolsAndClosures'
import {
  FilteredEvent,
  getFilteredPoolEventByDay,
  getFirstEventTomorrow,
} from './poolsUtils'
import { PoolClosure } from '../APIs/poolClosuresAPI'
import { PoolCalendar } from '../APIs/vancouverPoolCalendarsAPI'
import { Pool } from '../APIs/poolsAPI'

export function getReasonForClosure(
  reasonForClosure?: string | null,
): ReasonForClosure {
  if (!reasonForClosure) {
    return null
  }
  if (reasonForClosure === 'annual maintenance') {
    return 'annual maintenance'
  }
  return 'unknown'
}

export function getPoolOpenStatus(
  todaysEvents: FilteredEvent[],
  now: DateTime<boolean>,
  poolClosure?: PoolClosure,
): OpenStatus {
  const isPoolClosedForCleaning =
    poolClosure?.closure_end_date && poolClosure?.closure_start_date
      ? DateTime.fromSQL(poolClosure.closure_end_date) > now &&
        DateTime.fromSQL(poolClosure.closure_start_date) < now
      : false

  const currentEvent = todaysEvents.filter((e) => e.timeline === 'present')
  const currentEventIsClosure = currentEvent.every((e) =>
    e.title.includes('Closure'),
  )

  if (isPoolClosedForCleaning && !currentEventIsClosure) {
    return 'mismatch'
  }

  if (isPoolClosedForCleaning || currentEventIsClosure) {
    return 'closed'
  }

  return currentEvent.length ? 'open' : 'closed'
}

export function getNextPoolOpenDate(
  todaysEvents: FilteredEvent[],
  firstEventTomorrow: FilteredEvent | null,
  now: DateTime<boolean>,
  poolClosure?: PoolClosure,
): string | null {
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
    (e) => e.timeline === 'future',
  )
  if (firstFutureEventToday) {
    return firstFutureEventToday.start.toFormat('ccc d t')
  }
  if (firstEventTomorrow) {
    return firstEventTomorrow.start.toFormat('ccc d t')
  }
  return null
}

interface PoolsAndClosures {
  poolName: string
  nextPoolOpenDate: string | null
  reasonForClosure: ReasonForClosure
  poolID: number
  poolUrl: string
  lastClosedForCleaningReopenDate: string | null
  openStatus: OpenStatus
}

export function convertPoolCalendarDataIntoPoolsAndClosures(
  poolClosures: PoolClosure[],
  poolCalendars: PoolCalendar[],
  pools: Pool[],
) {
  const poolClosuresGroupedByPoolID: { [poolID: number]: PoolClosure } = {}
  poolClosures.forEach((c) => {
    poolClosuresGroupedByPoolID[c.pool_id] = c
  })
  const poolsGroupedByCentreID: { [centreID: number]: Pool } = {}
  const poolsGroupedByPoolName: Record<string, Pool> = {}
  pools.forEach((p) => {
    poolsGroupedByCentreID[p.center_id] = p
    poolsGroupedByPoolName[p.name] = p
  })

  const now = DateTime.now()

  const poolsAndClosures: PoolsAndClosures[] = poolCalendars.map((c) => {
    const pool = c.center_id
      ? poolsGroupedByCentreID[c.center_id]
      : poolsGroupedByPoolName[c.center_name]
    const poolClosure = poolClosuresGroupedByPoolID[pool?.id]
    const todaysEvents = getFilteredPoolEventByDay(c.events, [], now)

    return {
      poolName: pool?.name ?? 'name not found',
      nextPoolOpenDate: getNextPoolOpenDate(
        todaysEvents,
        getFirstEventTomorrow(c.events, now),
        now,
        poolClosure,
      ),
      lastClosedForCleaningReopenDate: poolClosure?.closure_end_date ?? null,
      reasonForClosure: getReasonForClosure(poolClosure?.reason_for_closure),
      poolID: pool?.id,
      poolUrl: pool?.url ?? '',
      openStatus: getPoolOpenStatus(todaysEvents, now, poolClosure),
    }
  })

  return poolsAndClosures
}
