import { DateTime } from 'luxon'

import useGetPoolsAndClosures from './APIs/useGetPoolsAndClosures'

export default function CleanestPools() {
  const { data, isLoading, hasError } = useGetPoolsAndClosures()

  const today = DateTime.now()
  const oneYearAgo = today.minus({ year: 1 }).toISODate()
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
      <ul>
        {data.map((d, i) => {
          const closureString = getClosureString(
            d.closureEndDate,
            oneYearAgo,
            today
          )
          return (
            <li key={i}>
              <div>
                {`${d.poolName} ${closureString}`}
                {d.reasonForClosure ? `(${d.reasonForClosure})` : ''}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function getClosureString(
  closureEndString: string,
  oneYearAgo: string,
  today: DateTime
) {
  const isDummyData = oneYearAgo === closureEndString
  if (isDummyData) {
    return ''
  }
  const closureEndDate = DateTime.fromISO(closureEndString)
  const diff = today.diff(closureEndDate, ['days']).toObject().days
  const isCurrentlyClosed = diff && diff < 0
  if (isCurrentlyClosed) {
    return `will reopen ${closureEndString}`
  }
  return `reopened ${closureEndString}`
}
