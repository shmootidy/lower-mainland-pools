import { useEffect, useState } from 'react'

// the opendatasoft datasets don't have the data i'm after
// parks are parks, not community centres
// not all of the swimming pools have associated community centres
// and not all of the parks-facilities have the pools i'm after
// the most reliable way of getting the pools and their data is through the schedule endpoint

// not in use right now
export default function useVancouverAPI() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataa, setData] = useState<any>([])

  useEffect(() => {
    setIsLoading(true)
    fetch(
      // 'https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks/records?limit=100'
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/community-centres/records?limit=100`
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks-facilities/records?limit=100&where=facilitytype='Swimming Pools'`
      ''
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
    dataa,
    isLoading,
    hasError,
  }
}
