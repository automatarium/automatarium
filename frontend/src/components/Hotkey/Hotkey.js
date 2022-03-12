import { useHotkeyAction } from '/src/hooks'

const Hotkey = ({ action, onAction, renderLabel=true }) => {
  const { hotkeyLabel } = useHotkeyAction(action, onAction)

  return renderLabel
    ? <>{ hotkeyLabel }</>
    : null
}

export default Hotkey
