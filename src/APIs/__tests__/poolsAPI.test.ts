import { renderHook, waitFor } from '@testing-library/react'

import { wrapper } from '../../testUtils'
import { useGetPools, useGetPoolByID } from '../poolsAPI'
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
      const { result } = renderHook(() => useGetPoolByID(1), { wrapper })

      await waitFor(() => expect(result.current.poolByIDLoading).toBeFalsy())

      expect(result.current.poolByID).toEqual(mockPools)
    })
  })
})
