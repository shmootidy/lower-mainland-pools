export interface CheckboxProps {
  isChecked: boolean
  onToggleChecked: (value: string) => void
  label: string
}

export default function Checkbox(props: CheckboxProps) {
  const { isChecked, onToggleChecked, label } = props

  return (
    <label>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={() => onToggleChecked(label)}
      />
      {label}
    </label>
  )
}
