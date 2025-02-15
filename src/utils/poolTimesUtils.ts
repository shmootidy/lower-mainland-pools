import { DateTime } from 'luxon'
import { PoolEvent } from '../APIs/useVancouverPoolCalendarsAPI'

export function filteredPoolEvents(
  poolEvents: PoolEvent[],
  filterEventCategories: boolean
) {
  const now = DateTime.now()

  const eventCategories = [
    'Free Swim',
    'Lengths',
    'Length Swim',
    'Public Swim',
    'Sauna',
    'Whirlpool',
    'Leisure Lane',
  ]

  const filteredEvents = poolEvents
    .filter((e) => {
      const isToday = DateTime.fromSQL(e.start_time).hasSame(now, 'day')

      const eventIsValid = eventCategories.some((cat) => {
        return e.title.includes(cat)
      })

      if (filterEventCategories) {
        return eventIsValid && isToday
      }
      return isToday
    })
    .map((e) => {
      const end = DateTime.fromSQL(e.end_time)
      const start = DateTime.fromSQL(e.start_time)
      const timeline: 'past' | 'present' | 'future' =
        now.toMillis() > start.toMillis() && now.toMillis() < end.toMillis()
          ? 'present'
          : now.toMillis() > start.toMillis()
          ? 'past'
          : 'future'
      return {
        ...e,
        end,
        start,
        timeline,
      }
    })
    .sort((a, b) => {
      const aDate = a.start.toMillis()
      const bDate = b.start.toMillis()
      return aDate - bDate
    })

  return filteredEvents
}
