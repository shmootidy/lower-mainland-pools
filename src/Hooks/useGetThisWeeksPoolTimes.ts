import { DateTime } from 'luxon'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'

export default function useGetThisWeeksPoolTimes() {
  const { poolCalendars, poolCalendarsLoading, poolCalendarsError } =
    useGetVancouverPoolCalendars()

  const now = DateTime.now()
  const oneWeekFromNow = now.plus({ weeks: 1 })

  const eventCategories = [
    'Free Swim',
    'Lengths',
    'Length Swim',
    'Public Swim',
    'Sauna',
    'Whirlpool',
    'Leisure Lane',
  ]

  const filteredPoolTimes = poolCalendars.map((pool) => {
    return {
      ...pool,
      center_name: stripPoolNameOfAsterisk(pool.center_name),
      events: pool.events
        .filter((e) => {
          const diffStartFromNow = DateTime.fromSQL(e.start_time)
            .diff(now, ['days'])
            .toObject().days
          const diffEndFromOneWeek = DateTime.fromSQL(e.end_time)
            .diff(oneWeekFromNow, ['days'])
            .toObject().days
          const isInTimeRange =
            diffStartFromNow &&
            diffStartFromNow > 0 &&
            diffEndFromOneWeek &&
            diffEndFromOneWeek > 0

          const eventIsValid = eventCategories.some((cat) => {
            return e.title.includes(cat)
          })

          return eventIsValid && isInTimeRange
        })
        .sort((a, b) => {
          const aDate = DateTime.fromSQL(a.start_time).toMillis()
          const bDate = DateTime.fromSQL(b.start_time).toMillis()
          return aDate - bDate
        }),
    }
  })

  return {
    filteredPoolTimes,
    filteredPoolTimesLoading: poolCalendarsLoading,
    filteredPoolTimesError: poolCalendarsError,
  }
}

function stripPoolNameOfAsterisk(poolName: string) {
  if (poolName[0] === '*') {
    return poolName.slice(1, poolName.length)
  }
  return poolName
}
