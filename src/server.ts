import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import VERCEL_URL from './utils/apiUrls'

const handlers = [
  http.get(`${VERCEL_URL}/getPoolClosures`, () => {
    return HttpResponse.json([
      {
        id: 1,
        pool_id: 10,
        reason_for_closure: null,
        event_id: 123,
        created_at: '2025-01-01',
        closure_end_date: '2025-03-01',
      },
    ])
  }),
]

export const server = setupServer(...handlers)
