import { Link, useSearchParams } from 'react-router-dom'
import { DateTime } from 'luxon'

import { useGetPoolByID } from '../APIs/poolsAPI'
import PoolScheduleVancouver from './PoolScheduleVancouver'
import StateManager from '../Components/StateManager'
import PoolScheduleRichmond from './PoolScheduleRichmond'
import PoolsOverview from './PoolsOverview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faPhone } from '@fortawesome/free-solid-svg-icons'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const {
    poolByID: pool,
    poolByIDLoading,
    poolByIDError,
  } = useGetPoolByID(poolID ? Number(poolID) : null)
  if (!poolID) {
    return (
      <>
        <PoolsOverview />
      </>
    )
  }

  const now = DateTime.now()

  const poolByID = pool?.[0]
  const poolMunicipalityName = poolByID?.municipality

  return (
    <StateManager
      isLoading={poolByIDLoading}
      hasError={poolByIDError}
      noData={!poolByID}
    >
      <div>
        <Link to='/'>back</Link>
        <h1 style={{ marginBottom: 8 }}>{poolByID?.name}</h1>
        {poolByID.address ? (
          <div style={{ fontSize: 12 }}>
            <FontAwesomeIcon icon={faAddressBook} style={{ marginRight: 14 }} />
            {poolByID.address}
          </div>
        ) : null}
        {poolByID.phone ? (
          <a href={`tel:${poolByID.phone}`} style={{ fontSize: 12 }}>
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 14 }} />
            {poolByID.phone}
          </a>
        ) : null}
        <h2>Amenities</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {poolByID?.amenities.map((a, i) => {
            return <li key={i}>{a}</li>
          })}
        </ul>
        <hr />
        {poolMunicipalityName === 'Vancouver' ? (
          <PoolScheduleVancouver selectedPool={poolByID} now={now} />
        ) : null}
        {poolMunicipalityName === 'Richmond' ? (
          <PoolScheduleRichmond selectedPool={poolByID} now={now} />
        ) : null}
      </div>
    </StateManager>
  )
}
