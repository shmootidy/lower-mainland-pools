import { ReactElement } from 'react'

interface IProps {
  isLoading: boolean
  hasError: boolean
  noData: boolean
  children: ReactElement
}

export default function StateManager(props: IProps) {
  const { isLoading, hasError, children, noData } = props
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (hasError) {
    return <div>Oh no! Something went terrible wrong.</div>
  }
  if (noData) {
    return <div>No data.</div>
  }
  return children
}
