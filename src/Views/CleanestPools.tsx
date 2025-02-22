import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import useGetPoolsAndClosures from '../Hooks/useGetPoolsAndClosures'
import {
  getPoolStatusIcon,
  OPEN_STATUS_ICON_MAP,
} from '../utils/cleanPoolsUtils'
import StateManager from '../Components/StateManager'
import { TableData, TableHeader } from '../Components/StyledComponents'

export default function CleanestPools() {
  const { data, isLoading, hasError } = useGetPoolsAndClosures()

  const now = DateTime.now()

  return (
    <StateManager
      isLoading={isLoading}
      hasError={hasError}
      noData={!data.length}
    >
      <>
        <h2>Select a pool to view details</h2>
        <div
          style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}
        >
          <table style={{ textAlign: 'left' }}>
            <thead>
              <tr>
                <TableHeader></TableHeader>
                <TableHeader>Pool</TableHeader>
                <TableHeader>Open</TableHeader>
                <TableHeader>Reopens</TableHeader>
                <TableHeader></TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const { icon, color } = getPoolStatusIcon(
                  d.lastClosedForCleaningReopenDate,
                  d.reasonForClosure,
                  now,
                )

                return (
                  <tr key={i}>
                    <TableData>
                      <FontAwesomeIcon style={{ color }} icon={icon} />
                    </TableData>
                    <TableData>
                      <Link to={`pool?poolID=${d.poolID}`}>{d.poolName}</Link>
                    </TableData>
                    <TableData>
                      <FontAwesomeIcon
                        style={{
                          color: OPEN_STATUS_ICON_MAP[d.openStatus].color,
                        }}
                        icon={OPEN_STATUS_ICON_MAP[d.openStatus].icon}
                      />
                    </TableData>
                    <TableData>
                      {d.openStatus === 'open' ? '' : d.nextPoolOpenDate}
                    </TableData>
                    <TableData>
                      <a
                        href={d.poolUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    </TableData>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    </StateManager>
  )
}
