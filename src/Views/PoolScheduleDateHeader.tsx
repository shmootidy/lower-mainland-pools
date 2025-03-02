import { SetStateAction } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { DateTime } from 'luxon'

export default function PoolScheduleDateHeader(props: {
  daysInFuture: number
  onSetDaysInFuture: (value: SetStateAction<number>) => void
  now: DateTime<boolean>
}) {
  const { daysInFuture, onSetDaysInFuture, now } = props

  const headingText = `Schedule: ${now
    .plus({ days: daysInFuture })
    .toFormat('ccc d')}`

  return (
    <HeadingWrapper>
      <button
        onClick={() =>
          onSetDaysInFuture((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
        }
        disabled={daysInFuture === 0}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <h2 style={{ margin: 12, textAlign: 'center' }}>{headingText}</h2>
      <button
        onClick={() =>
          onSetDaysInFuture((prev) => (prev + 1 <= 5 ? prev + 1 : prev))
        }
        disabled={daysInFuture === 5}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </HeadingWrapper>
  )
}

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`
