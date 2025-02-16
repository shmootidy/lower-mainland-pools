import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

export interface PoolEvent {
  activity_detail_url: string
  end_time: string
  price: {
    estimate_price: string
  }
  start_time: string
  title: string
  event_item_id: number
}

export interface VancouverPoolCalendar {
  center_id: number
  center_name: string
  total: number
  events: PoolEvent[]
}

export function useGetVancouverPoolCalendars() {
  async function getVancouverPoolCalendars() {
    const res = await fetch(`${VERCEL_URL}/getPoolSchedules`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const {
    data: poolCalendars = [],
    isLoading: poolCalendarsLoading,
    isError: poolCalendarsError,
  } = useQuery<VancouverPoolCalendar[]>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['poolCalendars'],
    queryFn: getVancouverPoolCalendars,
  })

  return {
    poolCalendars,
    poolCalendarsLoading,
    poolCalendarsError,
  }
}

export function useGetVancouverPoolCalendarByCentreID(centreID?: number) {
  async function getVancouverPoolCalendars() {
    const res = await fetch(
      `${VERCEL_URL}/getPoolScheduleByCentreID?centreID=${centreID}`
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
  } = useQuery<VancouverPoolCalendar>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryKey: ['poolCalendar'],
    queryFn: getVancouverPoolCalendars,
    enabled: !!centreID,
  })

  return {
    poolCalendar,
    poolCalendarLoading,
    poolCalendarError,
  }
}
