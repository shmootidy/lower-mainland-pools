import { Pool } from '../APIs/poolsAPI'
import { useGetRichmondPDF } from '../APIs/richmondPoolCalendarAPI'
import StateManager from '../Components/StateManager'

interface IProps {
  selectedPool?: Pool
}

export default function PoolScheduleRichmond(props: IProps) {
  const { selectedPool } = props
  const poolName = selectedPool?.name

  const { richmondPdfData, richmondPdfDataLoading, richmondPdfDataError } =
    useGetRichmondPDF(poolName)

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
