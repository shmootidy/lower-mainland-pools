import { ReactElement } from 'react'

interface IProps {
  isLoading: boolean
  hasError: boolean
  noData: boolean
  children: ReactElement
  isCompact?: boolean
  errorMessage?: ReactElement
}

export default function StateManager(props: IProps) {
  const { isLoading, hasError, children, noData, isCompact, errorMessage } =
    props

  if (isLoading) {
    return (
      <div data-testid={`${!isCompact ? '' : 'compact-'}loader`}>{`${
        !isCompact ? 'Loading' : ''
      }...`}</div>
    )
  }
  if (hasError) {
    if (errorMessage) {
      return errorMessage
    }
    return (
      <div data-testid={`${!isCompact ? '' : 'compact-'}error`}>
        {!isCompact ? 'Oh no! Something went terrible wrong.' : '!'}
      </div>
    )
  }
  if (noData) {
    return (
      <div data-testid={`${!isCompact ? '' : 'compact-'}no-data`}>
        {!isCompact ? 'No data.' : '.'}
      </div>
    )
  }
  return children
}
