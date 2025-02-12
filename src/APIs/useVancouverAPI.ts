import { useEffect, useState } from 'react'

// ok AMAZING
// i can query opendata soft for all pools
// and then use the proxy to get the schedules for each pool
// i can add a note about when a pool is scheduled for maintenance and reopening, and then store that somewhere for my own reference
//

// in the calendar data, when pool is closed it's event_type 0 -- means nothing...
// this data has "facility_id"

export default function useVancouverAPI() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>([])

  useEffect(() => {
    setIsLoading(true)
    fetch(
      // 'https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks/records?limit=100'
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/community-centres/records?limit=100`
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks-facilities/records?limit=100&where=facilitytype='Swimming Pools'`
      `http://localhost:3001/api/proxy`
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        console.log(data)
        setData(data.body)
      })
      .catch((err) => {
        console.error('nope!', err)
        setIsLoading(false)
        setHasError(true)
      })
  }, [])

  return {
    data,
    isLoading,
    hasError,
  }
}
