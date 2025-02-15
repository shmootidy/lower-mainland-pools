import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

import CleanestPools, { TableData, TableHeader } from './CleanestPools'
import { useGetPoolsByID } from '../APIs/usePoolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from '../APIs/useVancouverPoolCalendarsAPI'
import { getFilteredPoolEventsForToday } from '../utils/poolsUtils'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const [isFilterEventCategories, setIsFilterEventCategories] = useState(true)
  const { poolsByID, poolsByIDLoading, poolsByIDError } = useGetPoolsByID(
    poolID ? [Number(poolID)] : []
  )
  const centreID = poolsByID[0]?.center_id
  const { poolCalendar, poolCalendarLoading, poolCalendarError } =
    useGetVancouverPoolCalendarByCentreID(centreID)

  if (!poolID) {
    return (
      <>
        <CleanestPools />
      </>
    )
  }

  if (poolsByIDLoading) {
    return <div>Loading...</div>
  }
  if (poolsByIDError) {
    return <div>something went horribly wrong</div>
  }

  const filteredEvents = getFilteredPoolEventsForToday(
    poolCalendar?.events ?? [],
    isFilterEventCategories
  )

  return (
    <div>
      <a href='/'>back</a>
      <h1>{poolsByID[0].name}</h1>
      <h2>Amenities</h2>
      <ul style={{ listStyleType: 'none' }}>
        {poolsByID[0].amenities.map((a, i) => {
          return <li key={i}>{a}</li>
        })}
      </ul>
      <hr />
      <h2 style={{ margin: 0 }}>Today's schedule</h2>
      <div style={{ fontSize: 10 }}>
        <button onClick={() => setIsFilterEventCategories((prev) => !prev)}>
          {`Show ${isFilterEventCategories ? 'all' : 'filtered'} events`}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <TableHeader>Event</TableHeader>
            <TableHeader>Start</TableHeader>
            <TableHeader>End</TableHeader>
            <TableHeader>Now</TableHeader>
          </tr>
        </thead>
        <tbody>
          {poolCalendarLoading ? (
            <tr>
              <TableData colSpan={3}>Loading...</TableData>
            </tr>
          ) : (
            filteredEvents?.map((e, i) => {
              const isNow = e.timeline === 'present'
              const isPast = e.timeline === 'past'
              return (
                <tr key={i} style={{ color: isPast ? 'grey' : 'white' }}>
                  <TableData>{e.title}</TableData>
                  <TableData>{e.start.toFormat('t')}</TableData>
                  <TableData>{e.end.toFormat('t')}</TableData>
                  <TableData style={{ textAlign: 'center' }}>
                    {isNow ? '---' : '|'}
                  </TableData>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
