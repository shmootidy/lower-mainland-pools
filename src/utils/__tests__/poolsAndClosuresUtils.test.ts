import { DateTime } from 'luxon'
import {
  MOCK_CURRENT_DATE_TIME_STRING,
  mockFilteredEvents,
  mockPoolClosures,
} from '../../testData'
import {
  getReasonForClosure,
  getPoolOpenStatus,
} from '../poolsAndClosuresUtils'

describe('poolsAndClosuresUtils', () => {
  describe('getReasonForClosure', () => {
    it('returns correct reason for closure', () => {
      expect(getReasonForClosure('annual maintenance')).toEqual(
        'annual maintenance'
      )
      expect(getReasonForClosure('closed because of bears')).toEqual('unknown')
      expect(getReasonForClosure(null)).toEqual(null)
    })
  })

  describe('getPoolOpenStatus', () => {
    const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_TIME_STRING)

    const curentlyRunningEvent = mockFilteredEvents[1]
    it('returns "open" when pool has currently running event and no closure', () => {
      expect(getPoolOpenStatus([curentlyRunningEvent], mockNow)).toEqual('open')
    })

    const pastClosure = mockPoolClosures[0]
    it('returns "open" when pool has currently running event and past closure', () => {
      expect(
        getPoolOpenStatus([curentlyRunningEvent], mockNow, pastClosure)
      ).toEqual('open')
    })

    const currentClosure = mockPoolClosures[2]
    it('returns "mismatch" when pool has currently running non-closure event and overlapping closure data', () => {
      expect(
        getPoolOpenStatus([curentlyRunningEvent], mockNow, currentClosure)
      ).toEqual('mismatch')
    })

    const pastRunningEvent = mockFilteredEvents[0]
    it('returns "closed" when pool has no currently running events', () => {
      expect(getPoolOpenStatus([pastRunningEvent], mockNow)).toEqual('closed')
      expect(
        getPoolOpenStatus([pastRunningEvent], mockNow, pastClosure)
      ).toEqual('closed')
      expect(
        getPoolOpenStatus([pastRunningEvent], mockNow, currentClosure)
      ).toEqual('closed')
    })

    it('returns "closed" when pool has no currently running events and current closure', () => {
      expect(
        getPoolOpenStatus([pastRunningEvent], mockNow, currentClosure)
      ).toEqual('closed')
    })
  })
})
