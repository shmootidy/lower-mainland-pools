import { DateTime } from 'luxon'
import { expect, describe, it } from 'vitest'

import { getFilteredPoolEventByDay, getFirstEventTomorrow } from '../poolsUtils'
import {
  mockFilteredEvents,
  MOCK_CURRENT_DATE_TIME_STRING,
  mockPoolEvents,
  tomorrowEvent1End,
  tomorrowEvent1Start,
} from '../../testData'

describe('poolsUtils', () => {
  const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_TIME_STRING)
  describe('getFilteredPoolEventByDay', () => {
    it('returns all events for today if no filtered events are passed', () => {
      expect(
        getFilteredPoolEventByDay({ poolEvents: mockPoolEvents, now: mockNow }),
      ).toEqual(mockFilteredEvents.slice(0, 3))
    })

    it('returns events for today, filtered by category', () => {
      expect(
        getFilteredPoolEventByDay({
          poolEvents: mockPoolEvents,
          filteredEventCategories: ['event 1'],
          now: mockNow,
        }),
      ).toEqual([mockFilteredEvents[0]])
    })
  })

  describe('getFirstEventTomorrow', () => {
    it("returns the first of tomorrow's events", () => {
      expect(getFirstEventTomorrow(mockPoolEvents, mockNow)).toEqual({
        ...mockPoolEvents[3],
        start: DateTime.fromSQL(tomorrowEvent1Start),
        end: DateTime.fromSQL(tomorrowEvent1End),
        timeline: 'future',
      })
    })
  })
})
