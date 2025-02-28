import { DateTime } from 'luxon'

import { PoolClosure, useGetPoolClosures } from '../APIs/poolClosuresAPI'
import { Pool, useGetPools } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendars } from '../APIs/vancouverPoolCalendarsAPI'
import {
  getFilteredPoolEventByDay,
  getFirstEventTomorrow,
} from '../utils/poolsUtils'
import {
  getNextPoolOpenDate,
  getReasonForClosure,
  getPoolOpenStatus,
  convertPoolCalendarDataIntoPoolsAndClosures,
} from '../utils/poolsAndClosuresUtils'
import { useGetRichmondPoolCalendars } from '../APIs/richmondPoolCalendarsAPI'

export type ReasonForClosure = 'annual maintenance' | 'unknown' | null
export type OpenStatus = 'open' | 'closed' | 'mismatch'

// useGet for.... i don't know, maybe hooks shouldn't be useGet
export default function useGetPoolsAndClosures() {
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

  const poolClosuresGroupedByPoolID: { [poolID: number]: PoolClosure } = {}
  poolClosures.forEach((c) => {
    poolClosuresGroupedByPoolID[c.pool_id] = c
  })
  const poolsGroupedByCentreID: { [centreID: number]: Pool } = {}
  const poolsGroupedByPoolName: Record<string, Pool> = {}
  pools.forEach((p) => {
    poolsGroupedByCentreID[p.center_id] = p
    poolsGroupedByPoolName[p.name] = p
  })

  // const now = DateTime.now()

  const isLoading =
    poolClosuresLoading || poolsLoading || vancouverPoolCalendarsLoading
  const hasError =
    poolClosuresError || vancouverPoolCalendarsError || poolsError

  // const poolsAndClosuresOLD: PoolsAndClosures[] =
  //   !isLoading && !hasError
  //     ? vancouverPoolCalendars.map((c) => {
  //         const pool = c.center_id
  //           ? poolsGroupedByCentreID[c.center_id]
  //           : poolsGroupedByPoolName[c.center_name]
  //         const poolClosure = poolClosuresGroupedByPoolID[pool?.id]
  //         const todaysEvents = getFilteredPoolEventByDay(c.events, [], now)

  //         return {
  //           poolName: pool?.name ?? 'name not found',
  //           nextPoolOpenDate: getNextPoolOpenDate(
  //             todaysEvents,
  //             getFirstEventTomorrow(c.events, now),
  //             now,
  //             poolClosure,
  //           ),
  //           lastClosedForCleaningReopenDate:
  //             poolClosure?.closure_end_date ?? null,
  //           reasonForClosure: getReasonForClosure(
  //             poolClosure?.reason_for_closure,
  //           ),
  //           poolID: pool?.id,
  //           poolUrl: pool?.url ?? '',
  //           openStatus: getPoolOpenStatus(todaysEvents, now, poolClosure),
  //         }
  //       })
  //     : []
  const poolsAndClosures = convertPoolCalendarDataIntoPoolsAndClosures(
    poolClosures,
    [...vancouverPoolCalendars, ...richmondPoolCalendars],
    pools,
  )

  return {
    isLoading,
    hasError,
    data: poolsAndClosures,
  }
}
