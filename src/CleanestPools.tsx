import { DateTime } from 'luxon'
import styled from '@emotion/styled'

import useGetPoolsAndClosures from './Hooks/useGetPoolsAndClosures'

export default function CleanestPools() {
  const { data, isLoading, hasError } = useGetPoolsAndClosures()

  const today = DateTime.now()

  if (hasError) {
    return <div>Something went wrong.</div>
  }
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
      <table style={{ textAlign: 'left' }}>
        <thead>
          <tr>
            <TableHeader>Pool</TableHeader>
            <TableHeader>Is Open</TableHeader>
            <TableHeader>Reopen Date</TableHeader>
            <TableHeader>Reason for closure</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const closureEndDate = d.closureEndDate
              ? DateTime.fromISO(d.closureEndDate)
              : null
            const diff = closureEndDate
              ? today.diff(closureEndDate, ['days']).toObject().days
              : null
            const isCurrentlyClosed = !!(diff && diff < 0)

            return (
              <tr key={i}>
                <TableData>
                  <a href={`pool?poolID=${d.link}`}>{d.poolName}</a>
                </TableData>
                <TableData>{isCurrentlyClosed ? '❌' : '✅'}</TableData>
                <TableData>{getReopenDate(d.closureEndDate)}</TableData>
                <TableData>{d.reasonForClosure}</TableData>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function getReopenDate(closureEndDate: string | null) {
  if (!closureEndDate) {
    return null
  }
  return DateTime.fromISO(closureEndDate).plus({ days: 1 }).toISODate()
}

const TableHeader = styled.th`
  padding-bottom: 16px;
  padding-right: 16px;
`
const TableData = styled.td`
  padding-bottom: 16px;
  padding-right: 16px;
`
