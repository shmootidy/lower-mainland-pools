import { DateTime } from 'luxon'
import { PoolEvent } from '../APIs/useVancouverPoolCalendarsAPI'

export function filteredPoolEvents(
  poolEvents: PoolEvent[],
  filterEventCategories: boolean
) {
  const now = DateTime.local()

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
      const hasFinished = DateTime.fromSQL(e.end_time) <= now
      return {
        ...e,
        hasFinished,
      }
    })
    .sort((a, b) => {
      const aDate = DateTime.fromSQL(a.start_time).toMillis()
      const bDate = DateTime.fromSQL(b.start_time).toMillis()
      return aDate - bDate
    })

  return filteredEvents
}
