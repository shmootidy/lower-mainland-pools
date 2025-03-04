import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

export interface PoolEvent {
  activity_detail_url?: string
  end_time: string
  price?: {
    estimate_price: string
  }
  start_time: string
  title: string
  event_item_id?: number
}

export interface PoolCalendar {
  center_id?: number
  center_name: string
  total?: number
  events: PoolEvent[]
}

// useFetch for endpoint calls
export function useGetVancouverPoolCalendars() {
  async function getVancouverPoolCalendars() {
    const res = await fetch(`${VERCEL_URL}/getVancouverPoolSchedules`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: vancouverPoolCalendars = [],
    isLoading: vancouverPoolCalendarsLoading,
    isError: vancouverPoolCalendarsError,
  } = useQuery<PoolCalendar[]>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['vancouverPoolCalendars'],
    queryFn: getVancouverPoolCalendars,
  })

  return {
    vancouverPoolCalendars,
    vancouverPoolCalendarsLoading,
    vancouverPoolCalendarsError,
  }
}

export function useGetVancouverPoolCalendarByCentreID(centreID?: number) {
  async function getVancouverPoolCalendars() {
    const res = await fetch(
      `${VERCEL_URL}/getPoolScheduleByCentreID?centreID=${centreID}`,
    )
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: poolCalendar = null,
    isLoading: poolCalendarLoading,
    isError: poolCalendarError,
  } = useQuery<PoolCalendar>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['poolCalendar', `${centreID}`],
    queryFn: getVancouverPoolCalendars,
    enabled: !!centreID,
  })

  return {
    poolCalendar,
    poolCalendarLoading,
    poolCalendarError,
  }
}
