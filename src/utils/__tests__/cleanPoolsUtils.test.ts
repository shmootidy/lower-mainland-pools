import { DateTime } from 'luxon'
import { expect, describe, it } from 'vitest'
import { getPoolStatusIcon } from '../cleanPoolsUtils'

const MOCK_CURRENT_DATE_STRING = '2025-01-01'

describe('cleanPoolsUtils', () => {
  describe('getPoolStatusIcon', () => {
    const poolLastCleanedDateNull = null
    const poolLastCleanedDateFuture = '2025-02-01'

    const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_STRING)

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

    it('returns 2 icon', () => {
      expect(
        getPoolStatusIcon('2024-12-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('face-grin-hearts')
    })

    it('returns 4 icon', () => {
      expect(
        getPoolStatusIcon('2024-10-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('face-smile')
    })

    it('returns 6 icon', () => {
      expect(
        getPoolStatusIcon('2024-08-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('face-meh')
    })

    it('returns 8 icon', () => {
      expect(
        getPoolStatusIcon('2024-06-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('face-flushed')
    })

    it('returns 10 icon', () => {
      expect(
        getPoolStatusIcon('2024-04-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('face-grimace')
    })

    it('returns 12 icon', () => {
      expect(
        getPoolStatusIcon('2024-02-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('skull')
    })

    it('returns undefined icon', () => {
      expect(
        getPoolStatusIcon('2018-02-01', 'annual maintenance', mockNow).icon
          .iconName
      ).toEqual('ghost')
    })
  })
})
