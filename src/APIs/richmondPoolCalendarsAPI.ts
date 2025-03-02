import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'
import { PoolCalendar } from './vancouverPoolCalendarsAPI'

// useScrape for scraper calls
export function useGetRichmondPoolCalendars(poolIDs: number[]) {
  async function getRichmondPoolCalendars() {
    const res = await fetch(
      `${VERCEL_URL}/getRichmondPoolSchedules?poolIDs=${poolIDs.join(',')}`,
    )
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: richmondPoolCalendars = [],
    isLoading: richmondPoolCalendarsLoading,
    isError: richmondPoolCalendarsError,
  } = useQuery<PoolCalendar[]>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['richmondPoolCalendars', poolIDs],
    queryFn: getRichmondPoolCalendars,
    enabled: !!poolIDs.length,
  })

  return {
    richmondPoolCalendars,
    richmondPoolCalendarsLoading,
    richmondPoolCalendarsError,
  }
}
