import { useGetRichmondPDFTEMP } from '../APIs/richmondPoolCalendarAPI'
import StateManager from '../Components/StateManager'

export default function PoolScheduleRichmond() {
  const { richmondPdfData, richmondPdfDataLoading, richmondPdfDataError } =
    useGetRichmondPDFTEMP()

  return (
    <StateManager
      isLoading={richmondPdfDataLoading}
      hasError={richmondPdfDataError}
      noData={!richmondPdfData}
    >
      <embed
        src={richmondPdfData ? URL.createObjectURL(richmondPdfData) : ''}
        width='600'
        height='800'
        type='application/pdf'
      />
    </StateManager>
  )
}
