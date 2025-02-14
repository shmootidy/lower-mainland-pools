import { useEffect, useState } from 'react'
import VERCEL_URL from '../utils/apiUrls'

interface PoolEvent {
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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [poolCalendars, setPoolCalendars] = useState<VancouverPoolCalendar[]>(
    []
  )

  useEffect(() => {
    setIsLoading(true)
    fetch(`${VERCEL_URL}/proxy`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        setPoolCalendars(data.body.center_events)
      })
      .catch((err) => {
        console.error('nope!', err)
        setIsLoading(false)
        setHasError(true)
      })
  }, [])

  return {
    poolCalendars,
    poolCalendarsLoading: isLoading,
    poolCalendarsError: hasError,
  }
}
