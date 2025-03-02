import { DateTime } from 'luxon'

import { PoolClosure } from './APIs/poolClosuresAPI'
import { Pool } from './APIs/poolsAPI'
import { PoolCalendar } from './APIs/vancouverPoolCalendarsAPI'
import { FilteredEvent } from './utils/poolsUtils'

export const MOCK_CURRENT_DATE_TIME_STRING = '2025-01-01T12:00:00'

export const mockPoolClosures: PoolClosure[] = [
  {
    id: 1,
    pool_id: 1,
    reason_for_closure: 'annual maintenance',
    event_id: 123,
    created_at: '2024-01-01',
    closure_end_date: '2024-03-01',
    closure_start_date: '2024-02-01',
  },
  {
    id: 2,
    pool_id: 2,
    reason_for_closure: 'closed because of bears',
    event_id: 123,
    created_at: '2025-01-01',
    closure_end_date: null, // sometimes pools don't know when they will reopend
    closure_start_date: null,
  },
  {
    id: 3,
    pool_id: 1,
    reason_for_closure: 'annual maintenance',
    event_id: 123,
    created_at: '2025-01-01',
    closure_end_date: '2025-03-01',
    closure_start_date: '2025-01-01',
  },
]

export const mockPools: Pool[] = [
  {
    id: 1,
    address: null,
    coordinates: null,
    amenities: ['pool', 'slide'],
    locker_type: null,
    name: 'Pool 1',
    notes: null,
    url: null,
    center_id: 11,
    municipality: 'Vancouver,',
  },
  {
    id: 2,
    address: null,
    coordinates: null,
    amenities: ['pool', 'slide'],
    locker_type: null,
    name: 'Pool 2',
    notes: null,
    url: null,
    center_id: 22,
    municipality: 'Vancouver,',
  },
  {
    id: 3,
    address: null,
    coordinates: null,
    amenities: ['pool', 'slide'],
    locker_type: null,
    name: 'Pool 3',
    notes: null,
    url: null,
    center_id: 33,
    municipality: 'Vancouver,',
  },
  {
    id: 4,
    address: null,
    coordinates: null,
    amenities: ['pool', 'slide'],
    locker_type: null,
    name: 'Pool 4',
    notes: null,
    url: null,
    municipality: 'Richmond,',
  },
]

const poolEvent1Start = '2025-01-01 08:00:00' // past
const poolEvent1End = '2025-01-01 09:00:00' // past
const poolEvent2Start = '2025-01-01 11:00:00' // present
const poolEvent2End = '2025-01-01 13:00:00' // present
const poolEvent3Start = '2025-01-01 13:00:00' // future
const poolEvent3End = '2025-01-01 15:00:00' // future
export const tomorrowEvent1Start = '2025-01-02 09:00:00'
export const tomorrowEvent1End = '2025-01-02 10:00:00'
const tomorrowEvent2Start = '2025-01-02 13:00:00'
const tomorrowEvent2End = '2025-01-02 15:00:00'

export const mockPoolEvents = [
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

export const mockFilteredEvents: FilteredEvent[] = [
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

const allDayClosureEvent = {
  activity_detail_url: '',
  end_time: '2025-01-01T23:59:59',
  price: {
    estimate_price: '',
  },
  start_time: '2025-01-01T00:00:00',
  title: 'Pool Closure',
  event_item_id: 1,
}

export const mockPoolCalendars: PoolCalendar[] = [
  {
    center_id: mockPools[0].center_id,
    center_name: mockPools[0].name,
    total: 1,
    events: [allDayClosureEvent],
  },
  {
    center_id: mockPools[1].center_id,
    center_name: mockPools[1].name,
    total: 0,
    events: [], // closed for bears
  },
  {
    center_id: mockPools[2].center_id,
    center_name: mockPools[2].name,
    total: mockPoolEvents.length,
    events: mockPoolEvents,
  },
]
