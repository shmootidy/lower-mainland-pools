import { DateTime } from 'luxon'
import { expect, describe, it } from 'vitest'

import {
  getFilteredPoolEventsForToday,
  getFirstEventTomorrow,
} from '../poolsUtils'
import {
  expectedFilteredEvents,
  MOCK_CURRENT_DATE_TIME_STRING,
  mockPoolEvents,
  tomorrowEvent1End,
  tomorrowEvent1Start,
} from '../../testData'

describe('poolsUtils', () => {
  const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_TIME_STRING)
  describe('getFilteredPoolEventsForToday', () => {
    it('returns all events for today if no filtered events are passed', () => {
      expect(
        getFilteredPoolEventsForToday(mockPoolEvents, [], mockNow)
      ).toEqual(expectedFilteredEvents.slice(0, 3))
    })

    it('returns events for today, filtered by category', () => {
      expect(
        getFilteredPoolEventsForToday(mockPoolEvents, ['event 1'], mockNow)
      ).toEqual([expectedFilteredEvents[0]])
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
