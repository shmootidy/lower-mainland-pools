import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import { Pool } from '../APIs/poolsAPI'
import { useGetVancouverPoolCalendarByCentreID } from '../APIs/vancouverPoolCalendarsAPI'
import Checkbox, { CheckboxProps } from '../Components/Checkbox'
import {
  EVENT_CATEGORIES,
  getFilteredPoolEventByDay,
} from '../utils/poolsUtils'
import StateManager from '../Components/StateManager'
import PoolScheduleDateHeader from './PoolScheduleDateHeader'
import PoolSchedule from './PoolSchedule'

interface IProps {
  selectedPool?: Pool
  now: DateTime<boolean>
}

export default function PoolScheduleVancouver(props: IProps) {
  const { selectedPool, now } = props
  const centreID = selectedPool?.center_id
  const { poolCalendar, poolCalendarLoading, poolCalendarError } =
    useGetVancouverPoolCalendarByCentreID(centreID)

  const [filteredEventCategories, setFilteredEventCategories] = useState<
    Omit<CheckboxProps, 'onToggleChecked'>[]
  >([])
  const [daysInFuture, setDaysInFuture] = useState(0)

  useEffect(() => {
    if (!poolCalendarLoading) {
      const initialFilteredEvents = getFilteredPoolEventByDay({
        poolEvents: poolCalendar?.events ?? [],
        filteredEventCategories: [],
        now,
      })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredEvents = getFilteredPoolEventByDay({
    poolEvents: poolCalendar?.events ?? [],
    filteredEventCategories: filteredEventCategories
      .filter((c) => c.isChecked)
      .map((c) => c.label),
    now,
    daysInFuture,
  })

  return (
    <StateManager
      isLoading={poolCalendarLoading}
      hasError={poolCalendarError}
      noData={!poolCalendar}
    >
      <>
        <PoolScheduleDateHeader
          now={now}
          daysInFuture={daysInFuture}
          onSetDaysInFuture={setDaysInFuture}
        />
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
        <PoolSchedule filteredEvents={filteredEvents} />
      </>
    </StateManager>
  )
}
