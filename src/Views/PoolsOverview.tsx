import { DateTime } from 'luxon'

import { useEffect, useState } from 'react'
import StateManager from '../Components/StateManager'
import {
  ContentWrapper,
  Table,
  TableHeader,
} from '../Components/StyledComponents'
import { useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { useGetPools } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'
import { useGetRichmondPoolCalendars } from '../APIs/richmondPoolCalendarsAPI'
import PoolRow from './PoolRows'
import Checkbox from '../Components/Checkbox'

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

  const [municipalitiesToView, setMunicipalitiesToView] = useState<
    { label: string; isChecked: boolean }[]
  >([])

  useEffect(() => {
    if (!poolsLoading) {
      const initialPoolsToView = pools
        .map((p) => p.municipality)
        .filter((p, i, a) => a.indexOf(p) === i)
        .map((m) => {
          return {
            label: m,
            isChecked: true,
          }
        })
      setMunicipalitiesToView(initialPoolsToView)
    }
  }, [pools, poolsLoading])

  function handleCheckMunicipality(municipalityName: string) {
    setMunicipalitiesToView((prev) => {
      return prev.map((m) => {
        return {
          isChecked: m.label === municipalityName ? !m.isChecked : m.isChecked,
          label: m.label,
        }
      })
    })
  }

  const now = DateTime.now()

  const showVancouverPools = !!municipalitiesToView.find(
    (m) => m.label === 'Vancouver' && m.isChecked,
  )
  const vancouverPools = pools.filter((p) => p.municipality === 'Vancouver')

  const showRichmondPools = !!municipalitiesToView.find(
    (m) => m.label === 'Richmond' && m.isChecked,
  )
  const richmondPools = pools.filter((p) => p.municipality === 'Richmond')

  return (
    <StateManager
      isLoading={poolClosuresLoading || poolsLoading}
      hasError={poolClosuresError || poolsError}
      noData={!pools.length}
    >
      <>
        <h2>Select a pool to view details</h2>
        <div style={{ marginBottom: 16 }}>
          {municipalitiesToView.map((p, i) => {
            return (
              <Checkbox
                key={i}
                label={p.label}
                isChecked={p.isChecked}
                onToggleChecked={handleCheckMunicipality}
              />
            )
          })}
        </div>
        <ContentWrapper>
          <Table>
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
              {showVancouverPools &&
                vancouverPools.map((p, i) => {
                  const poolEvents =
                    vancouverPoolCalendars.find(
                      (c) => c.center_id === p.center_id,
                    )?.events || []
                  const poolClosure = poolClosures.find(
                    (c) => c.pool_id === p.id,
                  )
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
              {showRichmondPools &&
                richmondPools.map((p, i) => {
                  const poolEvents =
                    richmondPoolCalendars.find((c) => c.center_name === p.name)
                      ?.events || []
                  const poolClosure = poolClosures.find(
                    (c) => c.pool_id === p.id,
                  )
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
          </Table>
        </ContentWrapper>
      </>
    </StateManager>
  )
}
