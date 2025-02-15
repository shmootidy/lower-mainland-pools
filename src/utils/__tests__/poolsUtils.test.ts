import { DateTime } from 'luxon'
import { expect, describe, it } from 'vitest'
import {
  getFilteredPoolEventsForToday,
  getFirstEventTomorrow,
} from '../poolsUtils'

const MOCK_CURRENT_DATE_TIME_STRING = '2025-01-01T12:00:00'

const poolEvent1Start = '2025-01-01 08:00:00'
const poolEvent1End = '2025-01-01 09:00:00'
const poolEvent2Start = '2025-01-01 11:00:00'
const poolEvent2End = '2025-01-01 13:00:00'
const poolEvent3Start = '2025-01-01 13:00:00'
const poolEvent3End = '2025-01-01 15:00:00'
const tomorrowEvent1Start = '2025-01-02 09:00:00'
const tomorrowEvent1End = '2025-01-02 10:00:00'
const tomorrowEvent2Start = '2025-01-02 13:00:00'
const tomorrowEvent2End = '2025-01-02 15:00:00'

const mockPoolEvents = [
  {
    activity_detail_url: '',
    end_time: poolEvent1End,
    price: {
      estimate_price: '',
    },
    start_time: poolEvent1Start,
    title: 'event 1',
    event_item_id: 1,
  },
  {
    activity_detail_url: '',
    end_time: poolEvent2End,
    price: {
      estimate_price: '',
    },
    start_time: poolEvent2Start,
    title: 'event 2',
    event_item_id: 2,
  },
  {
    activity_detail_url: '',
    end_time: poolEvent3End,
    price: {
      estimate_price: '',
    },
    start_time: poolEvent3Start,
    title: 'event 3',
    event_item_id: 3,
  },
  {
    activity_detail_url: '',
    end_time: tomorrowEvent1End,
    price: {
      estimate_price: '',
    },
    start_time: tomorrowEvent1Start,
    title: 'event 1',
    event_item_id: 1,
  },
  {
    activity_detail_url: '',
    end_time: tomorrowEvent2End,
    price: {
      estimate_price: '',
    },
    start_time: tomorrowEvent2Start,
    title: 'event 2',
    event_item_id: 2,
  },
]

const expectedFilteredEvents = [
  {
    ...mockPoolEvents[0],
    start: DateTime.fromSQL(poolEvent1Start),
    end: DateTime.fromSQL(poolEvent1End),
    timeline: 'past',
  },
  {
    ...mockPoolEvents[1],
    start: DateTime.fromSQL(poolEvent2Start),
    end: DateTime.fromSQL(poolEvent2End),
    timeline: 'present',
  },
  {
    ...mockPoolEvents[2],
    start: DateTime.fromSQL(poolEvent3Start),
    end: DateTime.fromSQL(poolEvent3End),
    timeline: 'future',
  },
  {
    ...mockPoolEvents[3],
    start: DateTime.fromSQL(tomorrowEvent1Start),
    end: DateTime.fromSQL(tomorrowEvent1End),
    timeline: 'future',
  },
  {
    ...mockPoolEvents[4],
    start: DateTime.fromSQL(tomorrowEvent2Start),
    end: DateTime.fromSQL(tomorrowEvent2End),
    timeline: 'future',
  },
]

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
