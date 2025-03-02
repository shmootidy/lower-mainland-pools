import { useQuery } from '@tanstack/react-query'

import VERCEL_URL from '../utils/apiUrls'
import { DEFAULT_COMMON_API_CONFIG } from '../utils/apiUtils'

export function useGetRichmondPDF(poolName?: string) {
  async function getRichmondPDF() {
    const res = await fetch(
      `${VERCEL_URL}/getRichmondSchedulePdfByPoolName?poolName=${poolName}`,
    )
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.blob()
  }

  const {
    data: richmondPdfData,
    isError: richmondPdfDataError,
    isLoading: richmondPdfDataLoading,
  } = useQuery<Blob>({
    ...DEFAULT_COMMON_API_CONFIG,
    queryFn: getRichmondPDF,
    queryKey: ['richmondPDF', poolName],
    enabled: !!poolName,
  })

  return {
    richmondPdfData,
    richmondPdfDataLoading,
    richmondPdfDataError,
  }
}
