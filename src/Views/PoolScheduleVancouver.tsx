import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { Pool } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from '../APIs/vancouverPoolCalendarsAPI'
import Checkbox, { CheckboxProps } from '../Components/Checkbox'
import { DateTime } from 'luxon'
import {
  EVENT_CATEGORIES,
  getFilteredPoolEventByDay,
  getPoolHeadingText,
} from '../utils/poolsUtils'
import StateManager from '../Components/StateManager'
import { TableData, TableHeader } from '../Components/StyledComponents'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

interface IProps {
  selectedPool: Pool
}

export default function PoolScheduleValue(props: IProps) {
  const { selectedPool } = props
  const centreID = selectedPool.center_id
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

  const filteredEvents = getFilteredPoolEventByDay(
    poolCalendar?.events ?? [],
    filteredEventCategories.filter((c) => c.isChecked).map((c) => c.label),
    DateTime.now(),
    daysInFuture,
  )

  return (
    <StateManager
      isLoading={poolCalendarLoading}
      hasError={poolCalendarError}
      noData={!poolCalendar}
    >
      <>
        <HeadingWrapper>
          <button
            onClick={() =>
              setDaysInFuture((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
            }
            disabled={daysInFuture === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 style={{ margin: 12, textAlign: 'center' }}>
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
        </HeadingWrapper>
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
  )
}

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`
