import { FilteredEvent } from '../utils/poolsUtils'
import { TableData, TableHeader } from '../Components/StyledComponents'

interface IProps {
  filteredEvents: FilteredEvent[]
}

export default function PoolSchedule(props: IProps) {
  const { filteredEvents } = props

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <table style={{ marginBottom: 24 }}>
        <thead>
          <tr>
            <TableHeader>Event</TableHeader>
            <TableHeader>Start</TableHeader>
            <TableHeader>End</TableHeader>
            <TableHeader>Now</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredEvents?.map((e, i) => {
            const isNow = e.timeline === 'present'
            const isPast = e.timeline === 'past'
            return (
              <tr key={i} style={{ color: isPast ? 'grey' : 'white' }}>
                <TableData>{e.title}</TableData>
                <TableData>{e.start.toFormat('t')}</TableData>
                <TableData>{e.end.toFormat('t')}</TableData>
                <TableData style={{ textAlign: 'center' }}>
                  {isNow ? '---' : '|'}
                </TableData>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
