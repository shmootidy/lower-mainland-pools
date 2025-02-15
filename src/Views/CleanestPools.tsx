import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useGetPoolsAndClosures from '../Hooks/useGetPoolsAndClosures'
import {
  getPoolStatusIcon,
  OPEN_CLOSED_ICON_MAP,
} from '../utils/cleanPoolsUtils'
import StateManager from '../Components/StateManager'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { TableData, TableHeader } from '../Components/StyledComponents'

export default function CleanestPools() {
  const { data, isLoading, hasError } = useGetPoolsAndClosures()

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
                  d.reasonForClosure
                )
                const openKey = d.isOpen ? 'open' : 'closed'

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
                    <TableData>{d.closureEndDate}</TableData>
                    <TableData>
                      <a href={d.poolUrl} target='_blank'>
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
