import { DateTime } from 'luxon'

import StateManager from '../Components/StateManager'
import { TableHeader } from '../Components/StyledComponents'
import { useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { useGetPools } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'
import { useGetRichmondPoolCalendars } from '../APIs/richmondPoolCalendarsAPI'
import PoolRow from './PoolRows'

export default function PoolsOverview() {
  const { poolClosures, poolClosuresLoading, poolClosuresError } =
    useGetPoolClosures()
  const { pools, poolsLoading, poolsError } = useGetPools()

  const {
    vancouverPoolCalendars,
    vancouverPoolCalendarsLoading,
    vancouverPoolCalendarsError,
  } = useGetVancouverPoolCalendars()

  const {
    richmondPoolCalendars,
    richmondPoolCalendarsLoading,
    richmondPoolCalendarsError,
  } = useGetRichmondPoolCalendars()

  const now = DateTime.now()

  const vancouverPools = pools.filter((p) => p.municipality_id === 1)
  const richmondPools = pools.filter((p) => p.municipality_id === 2)

  return (
    <StateManager
      isLoading={poolClosuresLoading || poolsLoading}
      hasError={poolClosuresError || poolsError}
      noData={!pools.length}
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
              {vancouverPools.map((p, i) => {
                const poolEvents =
                  vancouverPoolCalendars.find(
                    (c) => c.center_id === p.center_id,
                  )?.events || []
                const poolClosure = poolClosures.find((c) => c.pool_id === p.id)
                return (
                  <PoolRow
                    key={i}
                    isCalendarLoading={vancouverPoolCalendarsLoading}
                    isCalendarError={vancouverPoolCalendarsError}
                    poolEvents={poolEvents}
                    pool={p}
                    now={now}
                    poolClosure={poolClosure}
                  />
                )
              })}
              {richmondPools.map((p, i) => {
                const poolEvents =
                  richmondPoolCalendars.find((c) => c.center_name === p.name)
                    ?.events || []
                const poolClosure = poolClosures.find((c) => c.pool_id === p.id)
                return (
                  <PoolRow
                    key={i}
                    isCalendarLoading={richmondPoolCalendarsLoading}
                    isCalendarError={richmondPoolCalendarsError}
                    poolEvents={poolEvents}
                    pool={p}
                    now={now}
                    poolClosure={poolClosure}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    </StateManager>
  )
}
