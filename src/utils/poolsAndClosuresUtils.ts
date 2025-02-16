import { DateTime } from 'luxon'
import { ReasonForClosure } from '../Hooks/useGetPoolsAndClosures'
import { FilteredEvent } from './poolsUtils'
import { PoolClosure } from '../APIs/poolClosuresAPI'

export function getReasonForClosure(
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

export function isPoolOpenNow(
  todaysEvents: FilteredEvent[],
  now: DateTime<boolean>,
  poolClosure?: PoolClosure
) {
  const isPoolClosedForCleaning =
    poolClosure?.closure_end_date && poolClosure?.closure_start_date
      ? DateTime.fromSQL(poolClosure.closure_end_date) > now &&
        DateTime.fromSQL(poolClosure.closure_start_date) < now
      : false
  if (isPoolClosedForCleaning) {
    return false
  }
  const currentEvent = todaysEvents.filter((e) => e.timeline === 'present')
  if (currentEvent.every((e) => e.title.includes('Closure'))) {
    return false
  }
  return !!currentEvent.length
}

export function getNextPoolOpenDate(
  todaysEvents: FilteredEvent[],
  firstEventTomorrow: FilteredEvent | null,
  now: DateTime<boolean>,
  poolClosure?: PoolClosure
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
    (e) => e.timeline === 'future'
  )
  if (firstFutureEventToday) {
    return firstFutureEventToday.start.toFormat('ccc d t')
  }
  if (firstEventTomorrow) {
    return firstEventTomorrow.start.toFormat('ccc d t')
  }
  return null
}
