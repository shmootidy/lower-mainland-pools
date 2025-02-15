import { renderHook, waitFor } from '@testing-library/react'
import {
  useGetVancouverPoolCalendarByCentreID,
  useGetVancouverPoolCalendars,
} from '../vancouverPoolCalendarsAPI'
import { wrapper } from '../../testUtils'
import { expect } from 'vitest'
import { poolCalendars } from '../../testData'

describe('vancouverPoolCalendarsAPI', () => {
  describe('useGetVancouverPoolCalendars', () => {
    it('returns calendars data', async () => {
      const { result } = renderHook(() => useGetVancouverPoolCalendars(), {
        wrapper,
      })

      await waitFor(() =>
        expect(result.current.poolCalendarsLoading).toBeFalsy()
      )

      expect(result.current.poolCalendars).toEqual(poolCalendars)
    })
  })

  describe('useGetVancouverPoolCalendarByCentreID', () => {
    it('returns calendar for single centre', async () => {
      const { result } = renderHook(
        () => useGetVancouverPoolCalendarByCentreID(12),
        {
          wrapper,
        }
      )

      await waitFor(() =>
        expect(result.current.poolCalendarLoading).toBeFalsy()
      )

      expect(result.current.poolCalendar).toEqual(poolCalendars[0])
    })
  })
})
