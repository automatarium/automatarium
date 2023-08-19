import Dropdown from '../Dropdown/Dropdown'
import kebabContextItems from './kebabDropdownItems'

type KebabProps = { x: number, y: number, isOpen: boolean, onClose: () => void }

const KebabMenu = (props: KebabProps) => {
  return <Dropdown
    visible={props.isOpen}
    onClose={props.onClose}
    style={{
      position: 'absolute',
      top: `${props.y}px`,
      left: `${props.x}px`,
      borderStyle: 'solid',
      borderWidth: '0.15em',
      borderColor: 'hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.9)'
    }}
    items={kebabContextItems}
  />
}

export default KebabMenu
