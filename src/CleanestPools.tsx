import { DateTime } from 'luxon'
import styled from '@emotion/styled'

import useGetPoolsAndClosures from './APIs/useGetPoolsAndClosures'

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
            <TableHeader>Last closed</TableHeader>
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
                <TableData>{d.poolName}</TableData>
                <TableData>{isCurrentlyClosed ? '❌' : '✅'}</TableData>
                <TableData>{d.closureEndDate}</TableData>
                <TableData>{d.reasonForClosure}</TableData>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const TableHeader = styled.th`
  padding-bottom: 16px;
  padding-right: 16px;
`
const TableData = styled.td`
  padding-bottom: 16px;
  padding-right: 16px;
`
