import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import VERCEL_URL from './utils/apiUrls'
import { poolClosuresData, poolsData } from './testData'

const handlers = [
  http.get(`${VERCEL_URL}/getPoolClosures`, () => {
    return HttpResponse.json(poolClosuresData)
  }),
  http.get(`${VERCEL_URL}/getPools`, () => {
    return HttpResponse.json(poolsData)
  }),
  http.get(`${VERCEL_URL}/getPoolsByID`, ({ request }) => {
    const url = new URL(request.url)
    const poolIDs = url.searchParams.get('poolIDs')

    if (!poolIDs) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(poolsData)
  }),
]

export const server = setupServer(...handlers)
