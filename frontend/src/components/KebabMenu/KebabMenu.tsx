import { useTranslation } from 'react-i18next'
import Dropdown from '../Dropdown/Dropdown'
import kebabContextItems from './kebabDropdownItems'

type KebabProps = { x: number, y: number, isOpen: boolean, onClose: () => void }

const KebabMenu = (props: KebabProps) => {
  const { t } = useTranslation('common')

  return <Dropdown
    visible={props.isOpen}
    onClose={props.onClose}
    style={{
      position: 'absolute',
      top: `${props.y}px`,
      left: `${props.x}px`,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'var(--toolbar)',
      boxShadow: '0 2px 5px rgba(0 0 0 / .3)'
    }}
    items={kebabContextItems(t)}
  />
}

export default KebabMenu
