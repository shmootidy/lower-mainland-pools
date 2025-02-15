import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Checkbox from '../Checkbox'

test('renders the Checkbox and calls onClick', async () => {
  const user = userEvent.setup()
  const mockClick = vi.fn()
  render(
    <Checkbox
      onToggleChecked={mockClick}
      label='Test checkbox'
      isChecked={true}
    />
  )

  const checkbox = screen.getByTestId('checkbox')
  expect(checkbox).toHaveTextContent('Test checkbox')

  await user.click(checkbox)
  expect(mockClick).toHaveBeenCalledTimes(1)
})
