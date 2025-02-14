import { useEffect, useState } from 'react'

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

export default function useGetVancouverPoolCalendars() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [poolCalendars, setPoolCalendars] = useState<VancouverPoolCalendar[]>(
    []
  )

  useEffect(() => {
    setIsLoading(true)
    // need the real proxy from vercel!
    fetch(`http://localhost:3001/api/proxy`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        // console.log(data)
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
