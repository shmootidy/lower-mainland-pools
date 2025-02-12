import { DateTime } from 'luxon'
import './App.css'
import useGetVancouverPoolCalendars from './APIs/useGetVancouverPoolCalendars'
import useGetThisWeeksPoolTimes from './Hooks/useGetThisWeeksPoolTimes'

function App() {
  const {
    filteredPoolTimes,
    filteredPoolTimesLoading,
    filteredPoolTimesError,
  } = useGetThisWeeksPoolTimes()
  console.log(
    filteredPoolTimes,
    filteredPoolTimesLoading,
    filteredPoolTimesError
  )
  // const parkIds = data.map((d) => d.parkid)
  // console.log(parkIds)

  return (
    <>
      {filteredPoolTimesLoading ? (
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
      )}
    </>
  )
}

export default App
