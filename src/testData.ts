import { PoolClosure } from './APIs/poolClosuresAPI'
import { Pool } from './APIs/poolsAPI'
import { VancouverPoolCalendar } from './APIs/vancouverPoolCalendarsAPI'

export const poolClosuresData: PoolClosure[] = [
  {
    id: 1,
    pool_id: 10,
    reason_for_closure: null,
    event_id: 123,
    created_at: '2025-01-01',
    closure_end_date: '2025-03-01',
  },
]

export const poolsData: Pool[] = [
  {
    id: 1,
    address: null,
    coordinates: null,
    created_date: '',
    amenities: ['pool', 'slide'],
    locker_type: null,
    name: 'Pool 1',
    notes: null,
    url: null,
    center_id: 12,
  },
]

export const poolCalendars: VancouverPoolCalendar[] = [
  {
    center_id: 12,
    center_name: 'Pool 1',
    total: 1,
    events: [
      {
        activity_detail_url: '',
        end_time: '2025-01-01T12:00:00',
        price: {
          estimate_price: '',
        },
        start_time: '2024-01-01T11:00:00',
        title: 'Test event',
        event_item_id: 1,
      },
    ],
  },
]
