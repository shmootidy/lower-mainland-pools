export interface CheckboxProps {
  isChecked: boolean
  onToggleChecked: (value: string) => void
  label: string
}

export default function Checkbox(props: CheckboxProps) {
  const { isChecked, onToggleChecked, label } = props

  return (
    <label data-testid='checkbox'>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={() => onToggleChecked(label)}
      />
      {label}
    </label>
  )
}
