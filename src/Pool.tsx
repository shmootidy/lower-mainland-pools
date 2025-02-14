import { useSearchParams } from 'react-router-dom'
import CleanestPools from './CleanestPools'
import { useGetPoolsByID } from './APIs/usePoolsAPI'

export default function Pool() {
  const [searchParams] = useSearchParams()
  const poolID = searchParams.get('poolID')

  const { poolsByID, poolsByIDLoading, poolsByIDError } = useGetPoolsByID(
    poolID ? [Number(poolID)] : []
  )
  if (!poolID) {
    return (
      <>
        <h2>Select a pool to view details</h2>
        <CleanestPools />
      </>
    )
  }

  if (poolsByIDLoading) {
    return <div>Loading...</div>
  }
  if (poolsByIDError) {
    return <div>something went horribly wrong</div>
  }
  return (
    <div>
      <h1>{poolsByID[0].name}</h1>
      <ul style={{ textAlign: 'left', listStyleType: 'none' }}>
        <li>
          <strong>Amenities</strong>
        </li>
        {poolsByID[0].amenities.map((a, i) => {
          return <li key={i}>{a}</li>
        })}
      </ul>
    </div>
  )
}
