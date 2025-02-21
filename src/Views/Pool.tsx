import { DateTime } from 'luxon'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import CleanestPools from './CleanestPools'
import { useGetPoolsByID } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from '../APIs/vancouverPoolCalendarsAPI'
import {
  EVENT_CATEGORIES,
  getFilteredPoolEventByDay,
  getPoolHeadingText,
} from '../utils/poolsUtils'
import StateManager from '../Components/StateManager'
import Checkbox, { CheckboxProps } from '../Components/Checkbox'
import { TableData, TableHeader } from '../Components/StyledComponents'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const { poolsByID, poolsByIDLoading, poolsByIDError } = useGetPoolsByID(
    poolID ? [Number(poolID)] : [],
  )
  const centreID = poolsByID[0]?.center_id
  const { poolCalendar, poolCalendarLoading, poolCalendarError } =
    useGetVancouverPoolCalendarByCentreID(centreID)

  const [filteredEventCategories, setFilteredEventCategories] = useState<
    Omit<CheckboxProps, 'onToggleChecked'>[]
  >([])
  const [daysInFuture, setDaysInFuture] = useState(0)

  useEffect(() => {
    if (!poolCalendarLoading) {
      const now = DateTime.now()
      const initialFilteredEvents = getFilteredPoolEventByDay(
        poolCalendar?.events ?? [],
        [],
        now,
      )
      setFilteredEventCategories(
        Array.from(
          new Set(
            initialFilteredEvents.map((e) => {
              const isChecked = EVENT_CATEGORIES.some((c) =>
                e.title.includes(c),
              )
              return JSON.stringify({
                isChecked,
                label: e.title,
              })
            }),
          ),
        ).map((e) => JSON.parse(e)) ?? [],
      )
    }
  }, [poolCalendar, poolCalendarLoading])

  if (!poolID) {
    return (
      <>
        <CleanestPools />
      </>
    )
  }

  const filteredEvents = getFilteredPoolEventByDay(
    poolCalendar?.events ?? [],
    filteredEventCategories.filter((c) => c.isChecked).map((c) => c.label),
    DateTime.now(),
    daysInFuture,
  )

  function handleToggleCheck(eventCategory: string) {
    setFilteredEventCategories((prev) => {
      return prev.map((c) => {
        return {
          isChecked: c.label === eventCategory ? !c.isChecked : c.isChecked,
          label: c.label,
        }
      })
    })
  }

  return (
    <StateManager
      isLoading={poolsByIDLoading || poolCalendarLoading}
      hasError={poolsByIDError || poolCalendarError}
      noData={!poolsByID.length || !filteredEvents?.length}
    >
      <div>
        <Link to='/'>back</Link>
        <h1>{poolsByID[0]?.name}</h1>
        <h2>Amenities</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {poolsByID[0]?.amenities.map((a, i) => {
            return <li key={i}>{a}</li>
          })}
        </ul>
        <hr />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <button
            onClick={() =>
              setDaysInFuture((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
            }
            disabled={daysInFuture === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 style={{ margin: 0, textAlign: 'center' }}>
            {getPoolHeadingText(filteredEvents ? filteredEvents[0] : null)}
          </h2>
          <button
            onClick={() =>
              setDaysInFuture((prev) => (prev + 1 <= 5 ? prev + 1 : prev))
            }
            disabled={daysInFuture === 5}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <StateManager
          isLoading={poolCalendarLoading}
          hasError={poolCalendarError}
          noData={!poolCalendar}
        >
          <>
            <div style={{ marginBottom: 16 }}>
              {filteredEventCategories.map((c, i) => {
                return (
                  <div key={i}>
                    <Checkbox
                      label={c.label}
                      isChecked={c.isChecked}
                      onToggleChecked={handleToggleCheck}
                    />
                  </div>
                )
              })}
            </div>
            <table>
              <thead>
                <tr>
                  <TableHeader>Event</TableHeader>
                  <TableHeader>Start</TableHeader>
                  <TableHeader>End</TableHeader>
                  <TableHeader>Now</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredEvents?.map((e, i) => {
                  const isNow = e.timeline === 'present'
                  const isPast = e.timeline === 'past'
                  return (
                    <tr key={i} style={{ color: isPast ? 'grey' : 'white' }}>
                      <TableData>{e.title}</TableData>
                      <TableData>{e.start.toFormat('t')}</TableData>
                      <TableData>{e.end.toFormat('t')}</TableData>
                      <TableData style={{ textAlign: 'center' }}>
                        {isNow ? '---' : '|'}
                      </TableData>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        </StateManager>
      </div>
    </StateManager>
  )
}
