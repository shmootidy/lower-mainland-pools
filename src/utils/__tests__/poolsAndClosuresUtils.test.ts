import { DateTime } from 'luxon'
import {
  MOCK_CURRENT_DATE_TIME_STRING,
  mockFilteredEvents,
  mockPoolClosures,
} from '../../testData'
import {
  CLOSURE_EVENT_MISMATCH_ERROR_MESSAGE,
  getReasonForClosure,
  isPoolOpenNow,
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

  describe('isPoolOpenNow', () => {
    const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_TIME_STRING)

    const curentlyRunningEvent = mockFilteredEvents[1]
    it('returns true when pool has currently running event and no closure', () => {
      expect(isPoolOpenNow([curentlyRunningEvent], mockNow)).toEqual(true)
    })

    const pastClosure = mockPoolClosures[0]
    it('returns true when pool has currently running event and past closure', () => {
      expect(
        isPoolOpenNow([curentlyRunningEvent], mockNow, pastClosure)
      ).toEqual(true)
    })

    const currentClosure = mockPoolClosures[2]
    it('throws an error when pool has currently running non-closure event and overlapping closure data', () => {
      expect(() =>
        isPoolOpenNow([curentlyRunningEvent], mockNow, currentClosure)
      ).toThrow(new Error(CLOSURE_EVENT_MISMATCH_ERROR_MESSAGE))
    })

    const pastRunningEvent = mockFilteredEvents[0]
    it('returns false when pool has no currently running events', () => {
      expect(isPoolOpenNow([pastRunningEvent], mockNow)).toEqual(false)
      expect(isPoolOpenNow([pastRunningEvent], mockNow, pastClosure)).toEqual(
        false
      )
      expect(
        isPoolOpenNow([pastRunningEvent], mockNow, currentClosure)
      ).toEqual(false)
    })

    it('returns false when pool has no currently running events and current closure', () => {
      expect(
        isPoolOpenNow([pastRunningEvent], mockNow, currentClosure)
      ).toEqual(false)
    })
  })
})
