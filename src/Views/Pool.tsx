import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import CleanestPools from './CleanestPools'
import { useGetPoolsByID } from '../APIs/usePoolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from '../APIs/useVancouverPoolCalendarsAPI'
import {
  EVENT_CATEGORIES,
  getFilteredPoolEventsForToday,
} from '../utils/poolsUtils'
import StateManager from '../Components/StateManager'
import Checkbox, { CheckboxProps } from '../Components/Checkbox'
import { TableData, TableHeader } from '../Components/StyledComponents'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')
  // console.log(poolID)
  const [filteredEventCategories, setFilteredEventCategories] = useState<
    Omit<CheckboxProps, 'onToggleChecked'>[]
  >([])
  const { poolsByID, poolsByIDLoading, poolsByIDError } = useGetPoolsByID(
    poolID ? [Number(poolID)] : []
  )
  const centreID = poolsByID[0]?.center_id
  const { poolCalendar, poolCalendarLoading, poolCalendarError } =
    useGetVancouverPoolCalendarByCentreID(centreID)

  useEffect(() => {
    if (!poolCalendarLoading) {
      const filteredEvents2 = getFilteredPoolEventsForToday(
        poolCalendar?.events ?? [],
        []
      )
      setFilteredEventCategories(
        Array.from(
          new Set(
            filteredEvents2.map((e) => {
              const isChecked = EVENT_CATEGORIES.some((c) =>
                e.title.includes(c)
              )
              return JSON.stringify({
                isChecked,
                label: e.title,
              })
            })
          )
        ).map((e) => JSON.parse(e)) ?? []
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

  const filteredEvents = getFilteredPoolEventsForToday(
    poolCalendar?.events ?? [],
    filteredEventCategories.filter((c) => c.isChecked).map((c) => c.label)
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
      isLoading={poolsByIDLoading}
      hasError={poolsByIDError}
      noData={!poolsByID.length}
    >
      <div>
        <a href='/'>back</a>
        <h1>{poolsByID[0]?.name}</h1>
        <h2>Amenities</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {poolsByID[0]?.amenities.map((a, i) => {
            return <li key={i}>{a}</li>
          })}
        </ul>
        <hr />
        <h2 style={{ margin: 0 }}>Today's schedule</h2>
        <StateManager
          isLoading={poolCalendarLoading}
          hasError={poolCalendarError}
          noData={!poolCalendar}
        >
          <>
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
