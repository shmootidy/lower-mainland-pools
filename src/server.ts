import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

import VERCEL_URL from './utils/apiUrls'
import { mockPoolCalendars, mockPoolClosures, mockPools } from './testData'

const handlers = [
  http.get(`${VERCEL_URL}/getPoolClosures`, () => {
    return HttpResponse.json(mockPoolClosures)
  }),
  http.get(`${VERCEL_URL}/getPools`, () => {
    return HttpResponse.json(mockPools)
  }),
  http.get(`${VERCEL_URL}/getPoolsByID`, ({ request }) => {
    const url = new URL(request.url)
    const poolIDs = url.searchParams.get('poolIDs')

    if (!poolIDs) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(mockPools)
  }),
  http.get(`${VERCEL_URL}/getPoolSchedules`, () => {
    return HttpResponse.json(mockPoolCalendars)
  }),
  http.get(`${VERCEL_URL}/getPoolScheduleByCentreID`, () => {
    return HttpResponse.json(mockPoolCalendars[0])
  }),
]

export const server = setupServer(...handlers)
