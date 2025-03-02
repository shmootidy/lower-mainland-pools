import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import { Pool } from '../APIs/poolsAPI'
import { useGetRichmondPDF } from '../APIs/richmondPoolCalendarAPI'
import { useGetRichmondPoolCalendars } from '../APIs/richmondPoolCalendarsAPI'
import StateManager from '../Components/StateManager'
import PoolScheduleDateHeader from './PoolScheduleDateHeader'
import { getFilteredPoolEventByDay } from '../utils/poolsUtils'
import PoolSchedule from './PoolSchedule'

interface IProps {
  selectedPool?: Pool
  now: DateTime<boolean>
}

export default function PoolScheduleRichmond(props: IProps) {
  const { selectedPool, now } = props
  const poolName = selectedPool?.name

  const [daysInFuture, setDaysInFuture] = useState(0)

  const {
    richmondPoolCalendars,
    richmondPoolCalendarsLoading,
    richmondPoolCalendarsError,
  } = useGetRichmondPoolCalendars(selectedPool?.id ? [selectedPool.id] : [])

  const { richmondPdfData, richmondPdfDataLoading, richmondPdfDataError } =
    useGetRichmondPDF(poolName)

  // this prevents a visual rerendering of the <embed> node
  const pdfUrl = useMemo(
    () => (richmondPdfData ? URL.createObjectURL(richmondPdfData) : ''),
    [richmondPdfData],
  )

  const eventOfSelectedDay = getFilteredPoolEventByDay({
    poolEvents:
      richmondPoolCalendars.find((c) => c.center_name === selectedPool?.name)
        ?.events || [],
    now,
    daysInFuture,
  })

  return (
    <>
      <StateManager
        isLoading={richmondPoolCalendarsLoading}
        hasError={richmondPoolCalendarsError}
        noData={
          !richmondPoolCalendars.length ||
          !richmondPoolCalendars[0].events.length
        }
      >
        <>
          <PoolScheduleDateHeader
            daysInFuture={daysInFuture}
            onSetDaysInFuture={setDaysInFuture}
            now={now}
          />
          <PoolSchedule filteredEvents={eventOfSelectedDay} />
        </>
      </StateManager>
      <StateManager
        isLoading={richmondPdfDataLoading}
        hasError={richmondPdfDataError}
        noData={!richmondPdfData}
      >
        {/* <embed src={pdfUrl} width='600' height='800' type='application/pdf' /> */}
        <object
          data={pdfUrl}
          type='application/pdf'
          height='600px'
          width='100%'
        >
          <p>
            Your browser doesn't support PDFs. <a href={pdfUrl}>Download it.</a>
          </p>
        </object>
      </StateManager>
    </>
  )
}
