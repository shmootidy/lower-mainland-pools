import { DateTime } from 'luxon'
import { renderHook, waitFor } from '@testing-library/react'
import { wrapper } from '../../testUtils'
import useGetPoolsAndClosures from '../useGetPoolsAndClosures'
import { vi } from 'vitest'
import { MOCK_CURRENT_DATE_TIME_STRING } from '../../testData'

describe('useGetPoolsAndClosures', () => {
  it('returns pools and closures data', async () => {
    const mockNow = DateTime.fromISO(MOCK_CURRENT_DATE_TIME_STRING)
    vi.spyOn(DateTime, 'now').mockReturnValue(mockNow as DateTime<boolean>)

    const { result } = renderHook(() => useGetPoolsAndClosures(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(result.current.data).toEqual([
      {
        isOpen: false,
        lastClosedForCleaningReopenDate: '2025-03-01',
        link: '1',
        nextPoolOpenDate: '2025-03-02',
        poolName: 'Pool 1',
        poolUrl: '',
        reasonForClosure: 'annual maintenance',
      },
      {
        isOpen: false,
        lastClosedForCleaningReopenDate: null,
        link: '2',
        nextPoolOpenDate: null,
        poolName: 'Pool 2',
        poolUrl: '',
        reasonForClosure: 'unknown', // 'closed because of bears' becomes 'unknown'
      },
      {
        isOpen: true,
        lastClosedForCleaningReopenDate: null,
        link: '3',
        nextPoolOpenDate: 'Wed 1 1:00 p.m.',
        poolName: 'Pool 3',
        poolUrl: '',
        reasonForClosure: null,
      },
    ])
  })
})
