import { renderHook, waitFor } from '@testing-library/react'
import { useGetPoolClosures } from '../poolClosuresAPI'
import { wrapper } from '../../testUtils'

describe('poolClosuresAPI', () => {
  describe('useGetPoolClosures', () => {
    it('returns data', async () => {
      const { result } = renderHook(() => useGetPoolClosures(), {
        wrapper,
      })

      await waitFor(() =>
        expect(result.current.poolClosuresLoading).toBeFalsy()
      )

      expect(result.current.poolClosures).toEqual([
        {
          id: 1,
          pool_id: 10,
          reason_for_closure: null,
          event_id: 123,
          created_at: '2025-01-01',
          closure_end_date: '2025-03-01',
        },
      ])
    })
  })
})
