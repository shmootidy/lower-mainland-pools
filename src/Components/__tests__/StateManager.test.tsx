import { render, screen } from '@testing-library/react'

import StateManager from '../StateManager'

describe('StateManager', () => {
  const fakeChild = <div data-testid='child'>hi</div>
  it('shows a loading state', () => {
    render(
      <StateManager isLoading={true} hasError={false} noData={false}>
        {fakeChild}
      </StateManager>
    )
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  it('shows an error state', () => {
    render(
      <StateManager isLoading={false} hasError={true} noData={false}>
        {fakeChild}
      </StateManager>
    )
    const error = screen.getByTestId('error')
    expect(error).toBeInTheDocument()
  })

  it('shows a no data state', () => {
    render(
      <StateManager isLoading={false} hasError={false} noData={true}>
        {fakeChild}
      </StateManager>
    )
    const noData = screen.getByTestId('no-data')
    expect(noData).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <StateManager isLoading={false} hasError={false} noData={false}>
        {fakeChild}
      </StateManager>
    )
    const child = screen.getByTestId('child')
    expect(child).toBeInTheDocument()
  })
})
