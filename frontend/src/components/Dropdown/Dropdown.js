import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronRight } from 'lucide-react'

import {
  Wrapper,
  ItemWrapper,
  Shortcut,
  Divider,
} from './dropdownStyle'

const ItemWithItems = ({ item }) => {
  const [active, setActive] = useState(false)

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setActive(false)}
    >
      <Item active={active} item={item} setActive={() => setActive(true)} />
      <Dropdown
        items={item.items}
        subMenu
        visible={active}
      />
    </div>
  )
}

const Item = ({ item, active, setActive }) => (
  <ItemWrapper
    onClick={item.onClick ?? (item.items?.length > 0 ? setActive : undefined)}
    disabled={(!item.onClick && !item.hasOwnProperty('items')) || item.items?.length === 0}
    type="button"
    $active={active}
  >
    <label>{item.label}</label>
    {item.shortcut && <Shortcut aria-hidden="true">{item.shortcut}</Shortcut>}
    {item.items && <ChevronRight size="1em" />}
  </ItemWrapper>
)

const Dropdown = ({
  subMenu,
  visible = true,
  items,
  x,
  y,
  onClose,
  ...props
}) => {
  const dropdownRef = useRef()

  // Close dropdown if click outside
  const handleClick = useCallback(e => !dropdownRef.current?.contains(e.target) && onClose(), [onClose])

  // Close dropdown if escape pressed
  const handleKey = useCallback(e => e.key === 'Escape' && onClose(), [onClose])

  useEffect(() => {
    if (!subMenu && visible) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [visible, subMenu, onClose, handleClick, handleKey])

  return (
    <Wrapper
      $x={`${x}px`}
      $y={`${y}px`}
      $subMenu={subMenu}
      $visible={visible}
      ref={dropdownRef}
      // Close dropdown if focus leaves
      onBlur={e => !subMenu && visible && !e.currentTarget.contains(e.relatedTarget) && onClose()}
      {...props}
    >
      {items.map((item, i) => item === 'hr' ? (
          <Divider key={`hr-${i}`} />
        ) : (
          item.items ? (
            <ItemWithItems key={item.label} item={item} />
          ) : (
            <Item key={item.label} item={item} />
          )
      ))}
    </Wrapper>
  )
}

export default Dropdown