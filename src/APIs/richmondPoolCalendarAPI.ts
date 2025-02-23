import { useQuery } from '@tanstack/react-query'
import VERCEL_URL from '../utils/apiUrls'

export function useGetRichmondPDFTEMP() {
  async function getRichmondPDFTEMP() {
    const res = await fetch(`${VERCEL_URL}/getRichmondSchedulePdfByPoolID`)
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
    queryFn: getRichmondPDFTEMP,
    queryKey: ['richmondPDF'],
  })

  return {
    richmondPdfData,
    richmondPdfDataLoading,
    richmondPdfDataError,
  }
}
