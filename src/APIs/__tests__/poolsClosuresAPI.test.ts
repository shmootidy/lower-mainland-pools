import { renderHook, waitFor } from '@testing-library/react'

import { useGetPoolClosures } from '../poolClosuresAPI'
import { wrapper } from '../../testUtils'
import { mockPoolClosures } from '../../testData'

describe('poolClosuresAPI', () => {
  describe('useGetPoolClosures', () => {
    it('returns data', async () => {
      const { result } = renderHook(() => useGetPoolClosures(), {
        wrapper,
      })

      await waitFor(() =>
        expect(result.current.poolClosuresLoading).toBeFalsy()
      )

      expect(result.current.poolClosures).toEqual(mockPoolClosures)
    })
  })
})
