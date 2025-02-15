import { DateTime } from 'luxon'
import { expect, vi, describe, it, beforeEach, afterEach } from 'vitest'
import { getPoolStatusIcon } from '../cleanPoolsUtils'

const MOCK_CURRENT_DATE_STRING = '2025-01-01'
vi.mock('luxon', () => ({
  DateTime: {
    now: vi.fn(() => MOCK_CURRENT_DATE_STRING),
    fromSQL: vi.fn((timeString) => timeString),
    isValid: true,
  },
}))

describe('cleanPoolsUtils', () => {
  describe('getPoolStatusIcon', () => {
    const poolLastCleanedDateNull = null
    const poolLastCleanedDateFuture = '2025-02-01'
    // const poolLastCleanedDateCurrent = MOCK_CURRENT_DATE_STRING
    const mockNow = DateTime.now()

    it('returns unknown icon when there is no last cleaned date', () => {
      expect(
        getPoolStatusIcon(poolLastCleanedDateNull, null, mockNow).icon.iconName
      ).toEqual('hourglass-half')
    })

    it('returns mystery icon when pool is ', () => {
      expect(
        getPoolStatusIcon(MOCK_CURRENT_DATE_STRING, 'unknown', mockNow).icon
          .iconName
      ).toEqual('dragon')
    })

    it('returns cleaning icon', () => {
      expect(
        getPoolStatusIcon(
          poolLastCleanedDateFuture,
          'annual maintenance',
          mockNow
        ).icon.iconName
      ).toEqual('soap')
    })

    it('returns unknown icon when monthsSinceCleaning is not found by internal logic', () => {})

    it('returns 2 icon', () => {
      expect(
        getPoolStatusIcon(poolLastCleanedDateNull, null, mockNow).icon.iconName
      ).toEqual('hourglass-half')
    })
  })
})
