import { DateTime } from 'luxon'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useGetPoolsAndClosures from '../Hooks/useGetPoolsAndClosures'
import {
  getPoolCleanlinessIcon,
  OPEN_CLOSED_ICON_MAP,
} from '../utils/cleanPoolsUtils'
import StateManager from '../Components/StateManager'

export default function CleanestPools() {
  const { data, isLoading, hasError } = useGetPoolsAndClosures()

  const today = DateTime.now()

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
                <TableHeader></TableHeader>
                <TableHeader>Reopens</TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const closureEndDate = d.closureEndDate
                  ? DateTime.fromISO(d.closureEndDate)
                  : null
                const diff = closureEndDate
                  ? today.diff(closureEndDate, ['days']).toObject().days
                  : null
                const isCurrentlyClosed = !!(diff && diff < 0)
                const { icon, color } = getPoolCleanlinessIcon(
                  d.lastClosedForCleaningReopenDate
                )
                const openKey = isCurrentlyClosed ? 'closed' : 'open'

                return (
                  <tr key={i}>
                    <TableData>
                      <FontAwesomeIcon style={{ color }} icon={icon} />
                    </TableData>
                    <TableData>
                      <a href={`pool?poolID=${d.link}`}>{d.poolName}</a>
                    </TableData>
                    <TableData>
                      <FontAwesomeIcon
                        style={{
                          color: OPEN_CLOSED_ICON_MAP[openKey].color,
                        }}
                        icon={OPEN_CLOSED_ICON_MAP[openKey].icon}
                      />
                    </TableData>
                    <TableData>{d.reasonForClosure}</TableData>
                    <TableData>{d.closureEndDate}</TableData>
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

export const TableHeader = styled.th`
  padding-bottom: 16px;
  padding-right: 16px;
`
export const TableData = styled.td`
  padding-bottom: 16px;
  padding-right: 16px;
`
