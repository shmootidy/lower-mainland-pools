import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'

import { TableData } from '../Components/StyledComponents'
import {
  getPoolStatusIcon,
  OPEN_STATUS_ICON_MAP,
} from '../utils/cleanPoolsUtils'
import { Pool } from '../APIs/poolsAPI'
import { PoolEvent } from '../APIs/vancouverPoolCalendarsAPI'
import {
  getNextPoolOpenDate,
  getPoolOpenStatus,
  getReasonForClosure,
} from '../utils/poolsAndClosuresUtils'
import {
  getFilteredPoolEventByDay,
  getFirstEventTomorrow,
} from '../utils/poolsUtils'
import { PoolClosure } from '../APIs/poolClosuresAPI'
import StateManager from '../Components/StateManager'

interface IProps {
  isCalendarLoading: boolean
  isCalendarError: boolean
  poolEvents: PoolEvent[]
  pool: Pool
  now: DateTime<boolean>
  poolClosure?: PoolClosure
}

export default function PoolRow(props: IProps) {
  const {
    poolClosure,
    isCalendarError,
    isCalendarLoading,
    now,
    poolEvents,
    pool,
  } = props

  // database
  const lastClosedForCleaningReopenDate = poolClosure?.closure_end_date ?? null
  const reasonForClosure = getReasonForClosure(poolClosure?.reason_for_closure)
  const { icon, color } = getPoolStatusIcon(
    lastClosedForCleaningReopenDate,
    reasonForClosure,
    now,
  )

  // subject to loading
  const todaysEvents = getFilteredPoolEventByDay({
    poolEvents,
    now,
  })
  const { openStatus, hasMismatch } = getPoolOpenStatus(
    todaysEvents,
    now,
    poolClosure,
  )

  return (
    <tr>
      <TableData>
        <FontAwesomeIcon style={{ color }} icon={icon} />
      </TableData>
      <TableData>
        <Link to={`pool?poolID=${pool.id}`}>{pool.name}</Link>
      </TableData>
      <TableData>
        <StateManager
          isCompact
          isLoading={isCalendarLoading}
          hasError={isCalendarError}
          noData={!poolEvents.length}
        >
          <>
            <FontAwesomeIcon
              style={{ color: OPEN_STATUS_ICON_MAP[openStatus].color }}
              icon={OPEN_STATUS_ICON_MAP[openStatus].icon}
            />
            {hasMismatch ? (
              <span title='There is a mismatch between the current event and the stored cleaning date. Check pool page for details.'>
                *
              </span>
            ) : (
              ''
            )}
          </>
        </StateManager>
      </TableData>
      <TableData>
        <StateManager
          isCompact
          isLoading={isCalendarLoading}
          hasError={isCalendarError}
          noData={!poolEvents.length}
        >
          <>
            {openStatus === 'open'
              ? ''
              : getNextPoolOpenDate(
                  todaysEvents,
                  getFirstEventTomorrow(poolEvents, now),
                  now,
                  poolClosure,
                )}
          </>
        </StateManager>
      </TableData>
      <TableData style={{ paddingRight: 0 }}>
        {pool.url ? (
          <a href={pool.url} target='_blank' rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        ) : null}
      </TableData>
    </tr>
  )
}
