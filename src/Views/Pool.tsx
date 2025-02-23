import { Link, useSearchParams } from 'react-router-dom'

import CleanestPools from './CleanestPools'
import { useGetPoolByID } from '../APIs/poolsAPI'
import PoolScheduleVancouver from './PoolScheduleVancouver'
import StateManager from '../Components/StateManager'
import PoolScheduleRichmond from './PoolScheduleRichmond'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const { poolByID, poolByIDLoading, poolByIDError } = useGetPoolByID(
    poolID ? Number(poolID) : null,
  )

  if (!poolID) {
    return (
      <>
        <CleanestPools />
      </>
    )
  }

  const poolMunicipalityName = poolByID?.municipalities.name

  return (
    <StateManager
      isLoading={poolByIDLoading}
      hasError={poolByIDError}
      noData={!poolByID}
    >
      <div>
        <Link to='/'>back</Link>
        <h1>{poolByID?.name}</h1>
        <h2>Amenities</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {poolByID?.amenities.map((a, i) => {
            return <li key={i}>{a}</li>
          })}
        </ul>
        <hr />
        {poolMunicipalityName === 'Vancouver' ? (
          <PoolScheduleVancouver selectedPool={poolByID} />
        ) : null}
        {poolMunicipalityName === 'Richmond' ? (
          <PoolScheduleRichmond selectedPool={poolByID} />
        ) : null}
        <PoolScheduleRichmond selectedPool={poolByID} />
      </div>
    </StateManager>
  )
}
