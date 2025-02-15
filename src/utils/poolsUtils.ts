import { DateTime } from 'luxon'
import { PoolEvent } from '../APIs/vancouverPoolCalendarsAPI'

export const EVENT_CATEGORIES = [
  'Free Swim',
  'Lengths',
  'Length Swim',
  'Public Swim',
  'Sauna',
  'Whirlpool',
  'Leisure Lane',
]

export interface FilteredEvent extends PoolEvent {
  end: DateTime<boolean>
  start: DateTime<boolean>
  timeline: 'past' | 'present' | 'future'
}

export function getFilteredPoolEventsForToday(
  poolEvents: PoolEvent[],
  filteredEventCategories: string[],
  now: DateTime<boolean>
) {
  const filteredEvents: FilteredEvent[] = poolEvents
    .filter((e) => {
      const isToday = DateTime.fromSQL(e.start_time).hasSame(now, 'day')

      const eventIsValid = filteredEventCategories.some((cat) => {
        return e.title.includes(cat)
      })

      if (filteredEventCategories.length) {
        return eventIsValid && isToday
      }
      return isToday
    })
    .map((e) => {
      return {
        ...e,
        ...getEventStartEndAndTimeline(e, now),
      }
    })

  return sortFilteredPoolEvents(filteredEvents)
}

export function getFirstEventTomorrow(
  poolEvents: PoolEvent[],
  now: DateTime<boolean>
) {
  const tomorrow = now.plus({ days: 1 })

  const filteredEvents: FilteredEvent[] = poolEvents
    .filter((e) => {
      const isTomorrow = DateTime.fromSQL(e.start_time).hasSame(tomorrow, 'day')
      return isTomorrow
    })
    .map((e) => {
      return {
        ...e,
        ...getEventStartEndAndTimeline(e, now),
      }
    })

  return sortFilteredPoolEvents(filteredEvents)[0]
}

function getEventStartEndAndTimeline(
  poolEvent: PoolEvent,
  now: DateTime<boolean>
) {
  const end = DateTime.fromSQL(poolEvent.end_time)
  const start = DateTime.fromSQL(poolEvent.start_time)
  const timeline: 'past' | 'present' | 'future' =
    now.toMillis() > start.toMillis() && now.toMillis() < end.toMillis()
      ? 'present'
      : now.toMillis() > start.toMillis()
      ? 'past'
      : 'future'
  return { start, end, timeline }
}

function sortFilteredPoolEvents(
  filteredEvents: FilteredEvent[],
  order?: 'asc' | 'desc'
) {
  return filteredEvents.sort((a, b) => {
    const aDate = a.start.toMillis()
    const bDate = b.start.toMillis()
    if (!order || order === 'asc') {
      return aDate - bDate
    }
    return bDate - aDate
  })
}
