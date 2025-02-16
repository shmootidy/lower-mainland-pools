import { renderHook, waitFor } from '@testing-library/react'

import { wrapper } from '../../testUtils'
import { useGetPools, useGetPoolsByID } from '../poolsAPI'
import { mockPools } from '../../testData'

describe('poolsAPI', () => {
  describe('useGetPools', () => {
    it('gets pools data', async () => {
      const { result } = renderHook(() => useGetPools(), { wrapper })

      await waitFor(() => expect(result.current.poolsLoading).toBeFalsy())

      expect(result.current.pools).toEqual(mockPools)
    })
  })

  describe('useGetPoolsByID', () => {
    it('returns pool data', async () => {
      const { result } = renderHook(() => useGetPoolsByID([1]), { wrapper })

      await waitFor(() => expect(result.current.poolsByIDLoading).toBeFalsy())

      expect(result.current.poolsByID).toEqual(mockPools)
    })
  })
})
