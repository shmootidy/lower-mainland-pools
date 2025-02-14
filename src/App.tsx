import { useMemo } from 'react'
import { useGetPoolClosures } from './APIs/usePoolClosuresAPI'
import { useGetPoolsByID } from './APIs/usePoolsAPI'
import './App.css'
import useGetThisWeeksPoolTimes from './Hooks/useGetThisWeeksPoolTimes'
import useGetPoolsAndClosures from './APIs/useGetPoolsAndClosures'
import CleanestPools from './CleanestPools'

function App() {
  // const {
  //   filteredPoolTimes,
  //   filteredPoolTimesLoading,
  //   filteredPoolTimesError,
  // } = useGetThisWeeksPoolTimes()
  // console.log(filteredPoolTimes)
  // const { poolClosures, poolClosuresLoading, poolClosuresError } =
  //   useGetPoolClosures()

  // console.log(poolClosures, poolClosuresLoading ? 'Loading...' : '')

  // const poolIDs = useMemo(
  //   () => poolClosures.map((p) => p.pool_id),
  //   [poolClosures]
  // )
  // const { poolsByID, poolsByIDLoading, poolsByIDError } =
  //   useGetPoolsByID(poolIDs)
  // console.log(poolsByID, poolsByIDLoading ? 'Loading...' : '')
  const { data, isLoading, hasError } = useGetPoolsAndClosures()
  console.log(data, isLoading, hasError)
  return (
    <>
      <CleanestPools />
      {/* {filteredPoolTimesLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {filteredPoolTimes.map((pool) => {
            return (
              <div key={pool.center_id}>
                <div>{pool.center_name}</div>
                {pool.events.map((e, i) => {
                  return (
                    <div key={`${e.event_item_id}-${i}`}>
                      <div>{e.title}</div>
                      <div>{`${e.start_time} - ${e.end_time}`}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )} */}
    </>
  )
}

export default App
