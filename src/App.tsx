import './App.css'
import CleanestPools from './CleanestPools'

function App() {
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
