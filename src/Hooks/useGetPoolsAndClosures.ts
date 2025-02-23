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
} from '../utils/poolsAndClosuresUtils'

export type ReasonForClosure = 'annual maintenance' | 'unknown' | null
export type OpenStatus = 'open' | 'closed' | 'mismatch'

interface PoolsAndClosures {
  poolName: string
  nextPoolOpenDate: string | null
  reasonForClosure: ReasonForClosure
  poolID: number
  poolUrl: string
  lastClosedForCleaningReopenDate: string | null
  openStatus: OpenStatus
}

export default function useGetPoolsAndClosures() {
  const { poolClosures, poolClosuresLoading, poolClosuresError } =
    useGetPoolClosures()
  const { pools, poolsLoading, poolsError } = useGetPools()
  console.log(pools)
  const {
    poolCalendars: cals,
    poolCalendarsLoading,
    poolCalendarsError,
  } = useGetVancouverPoolCalendars()
  console.log(cals.Richmond)
  const poolCalendarsVancouver = cals.Vancouver

  const poolClosuresGroupedByPoolID: { [poolID: number]: PoolClosure } = {}
  poolClosures.forEach((c) => {
    poolClosuresGroupedByPoolID[c.pool_id] = c
  })
  const poolsGroupedByCentreID: { [centreID: number]: Pool } = {}
  const vancouverPools = pools.filter((p) => p.municipality_id === 1)
  vancouverPools.forEach((p) => {
    poolsGroupedByCentreID[p.center_id] = p
  })

  const now = DateTime.now()

  const isLoading = poolClosuresLoading || poolsLoading || poolCalendarsLoading
  const hasError = poolClosuresError || poolCalendarsError || poolsError

  const poolsAndClosures: PoolsAndClosures[] =
    !isLoading && !hasError
      ? poolCalendarsVancouver.map((c) => {
          const pool = poolsGroupedByCentreID[c.center_id]
          const poolClosure = poolClosuresGroupedByPoolID[pool?.id]
          const todaysEvents = getFilteredPoolEventByDay(c.events, [], now)

          return {
            poolName: pool?.name ?? 'name not found',
            nextPoolOpenDate: getNextPoolOpenDate(
              todaysEvents,
              getFirstEventTomorrow(c.events, now),
              now,
              poolClosure,
            ),
            lastClosedForCleaningReopenDate:
              poolClosure?.closure_end_date ?? null,
            reasonForClosure: getReasonForClosure(
              poolClosure?.reason_for_closure,
            ),
            poolID: pool?.id,
            poolUrl: pool?.url ?? '',
            openStatus: getPoolOpenStatus(todaysEvents, now, poolClosure),
          }
        })
      : []

  const poolsGroupedByPoolName: { [poolName: string]: Pool } = {}
  pools.forEach((p) => {
    poolsGroupedByPoolName[p.name] = p
  })
  const richmond: PoolsAndClosures[] = cals.Richmond.map((pool) => {
    let poolName = ''
    Object.keys(pool).forEach((name) => {
      poolName = name
    })

    const thisPool = poolsGroupedByPoolName[poolName]

    return {
      poolName,
      nextPoolOpenDate: null,
      lastClosedForCleaningReopenDate: null,
      reasonForClosure: null,
      poolID: thisPool?.id,
      poolUrl: thisPool?.url ?? '',
      openStatus: 'open', // getRichmondOpendStatus()
    }
  })

  console.log(richmond)

  return {
    isLoading,
    hasError,
    data: [...poolsAndClosures, ...richmond],
  }
}
