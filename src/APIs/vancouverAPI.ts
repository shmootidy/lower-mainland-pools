import { useQuery } from '@tanstack/react-query'

import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

// the opendatasoft datasets don't have the data i'm after
// parks are parks, not community centres
// not all of the swimming pools have associated community centres
// and not all of the parks-facilities have the pools i'm after
// the most reliable way of getting the pools and their data is through the schedule endpoint

// not in use right now
export function useGetVancouverDatasetRecords() {
  async function getVancouverDatasetRecords() {
    const res = await fetch(
      // 'https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks/records?limit=100'
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/community-centres/records?limit=100`
      // `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets/parks-facilities/records?limit=100&where=facilitytype='Swimming Pools'`
      ''
    )
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  }

  const { data, isLoading, isError } = useQuery({
    ...DEFAULT_COMMON_API_CONFIG,

    queryKey: ['vancouverDataset'],
    queryFn: getVancouverDatasetRecords,
  })

  return {
    data,
    isLoading,
    isError,
  }
}
