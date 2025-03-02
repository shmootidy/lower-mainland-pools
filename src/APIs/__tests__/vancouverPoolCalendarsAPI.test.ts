import { renderHook, waitFor } from '@testing-library/react'

import {
  useGetVancouverPoolCalendarByCentreID,
  useGetVancouverPoolCalendars,
} from '../vancouverPoolCalendarsAPI'
import { wrapper } from '../../testUtils'
import { mockPoolCalendars } from '../../testData'

describe('vancouverPoolCalendarsAPI', () => {
  describe('useGetVancouverPoolCalendars', () => {
    it('returns calendars data', async () => {
      const { result } = renderHook(() => useGetVancouverPoolCalendars(), {
        wrapper,
      })

      await waitFor(() =>
        expect(result.current.vancouverPoolCalendarsLoading).toBeFalsy(),
      )

      expect(result.current.vancouverPoolCalendars).toEqual(mockPoolCalendars)
    })
  })

  describe('useGetVancouverPoolCalendarByCentreID', () => {
    it('returns calendar for single centre', async () => {
      const { result } = renderHook(
        () => useGetVancouverPoolCalendarByCentreID(12),
        {
          wrapper,
        },
      )

      await waitFor(() =>
        expect(result.current.poolCalendarLoading).toBeFalsy(),
      )

      expect(result.current.poolCalendar).toEqual(mockPoolCalendars[0])
    })
  })
})
