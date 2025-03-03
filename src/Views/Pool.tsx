import { Link, useSearchParams } from 'react-router-dom'

import { useGetPoolByID } from '../APIs/poolsAPI'
import PoolScheduleVancouver from './PoolScheduleVancouver'
import StateManager from '../Components/StateManager'
import PoolScheduleRichmond from './PoolScheduleRichmond'
import PoolsOverview from './PoolsOverview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faPhone } from '@fortawesome/free-solid-svg-icons'
import { useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { getVancouverNow } from '../utils/dateUtils'
import { DateTime } from 'luxon'
import { getReasonForClosure } from '../utils/poolsAndClosuresUtils'
import { getPoolStatusIcon } from '../utils/cleanPoolsUtils'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const {
    poolByID: pool,
    poolByIDLoading,
    poolByIDError,
  } = useGetPoolByID(poolID ? Number(poolID) : null)

  const { poolClosures } = useGetPoolClosures()

  if (!poolID) {
    return (
      <>
        <PoolsOverview />
      </>
    )
  }

  const now = getVancouverNow()

  const poolByID = pool?.[0]
  const poolMunicipalityName = poolByID?.municipality
  const poolClosure = poolClosures.find((c) => c.pool_id === Number(poolID))

  const lastClosedForCleaningReopenDate =
    (poolClosure?.closure_end_date &&
      DateTime.fromSQL(poolClosure.closure_end_date)
        .plus({ days: 1 })
        .toISODate()) ??
    null
  const reasonForClosure = getReasonForClosure(poolClosure?.reason_for_closure)
  const { icon, color } = getPoolStatusIcon(
    lastClosedForCleaningReopenDate,
    reasonForClosure,
    now,
  )

  return (
    <StateManager
      isLoading={poolByIDLoading}
      hasError={poolByIDError}
      noData={!poolByID}
    >
      <div>
        <Link to='/'>back</Link>
        <h1
          style={{
            marginBottom: 8,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          {poolByID?.name}
          {lastClosedForCleaningReopenDate ? (
            <FontAwesomeIcon style={{ color, margin: 16 }} icon={icon} />
          ) : null}
        </h1>
        {lastClosedForCleaningReopenDate ? (
          <div
            style={{ fontStyle: 'italic', textAlign: 'center' }}
          >{`Reopens ${lastClosedForCleaningReopenDate}`}</div>
        ) : null}
        {poolByID?.address ? (
          <div style={{ fontSize: 12 }}>
            <FontAwesomeIcon icon={faAddressBook} style={{ marginRight: 14 }} />
            {poolByID?.address}
          </div>
        ) : null}
        {poolByID?.phone ? (
          <a href={`tel:${poolByID?.phone}`} style={{ fontSize: 12 }}>
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 14 }} />
            {poolByID?.phone}
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
