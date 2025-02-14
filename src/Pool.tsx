import { useSearchParams } from 'react-router-dom'
import CleanestPools from './CleanestPools'
import { useGetPoolsByID } from './APIs/usePoolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from './APIs/useVancouverPoolCalendarsAPI'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const { poolsByID, poolsByIDLoading, poolsByIDError } = useGetPoolsByID(
    poolID ? [Number(poolID)] : []
  )
  const centreID = poolsByID[0]?.center_id
  console.log(useGetVancouverPoolCalendarByCentreID(centreID))

  if (!poolID) {
    return (
      <>
        <h2>Select a pool to view details</h2>
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
        <i>only the stuff i want to see</i>
      </div>
      <ul style={{ listStyleType: 'none' }}>
        {/* {filteredPoolTimesLoading ? <li>Loading...</li> : null} */}
      </ul>
    </div>
  )
}
