import { useState, useEffect, useCallback, useRef, ReactNode, HTMLAttributes } from 'react'
import { ChevronRight } from 'lucide-react'

import { useActions } from '/src/hooks'

import {
  Wrapper,
  ItemWrapper,
  Shortcut,
  Divider
} from './dropdownStyle'
import { ContextItem, ContextItems } from '/src/components/ContextMenus/contextItem'

const ItemWithItems = ({ item, onClose }: {item: ContextItem, onClose: () => void}) => {
  const [active, setActive] = useState(false)

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setActive(false)}
    >
      <Item active={active} item={item} onClose={onClose} setActive={() => setActive(true)} />
      <Dropdown
        items={item.items}
        subMenu
        visible={active}
        onClose={onClose}
      />
    </div>
  )
}

interface ItemProps {
  item: ContextItem
  active?: boolean
  setActive?: () => void
  onClose?: () => void
}

const Item = ({ item, active, setActive, onClose }: ItemProps) => {
  const actions = useActions()
  const actionHandler = item.action ? actions[item.action]?.handler : null
  const hotKeyLabel = item.action ? actions[item.action]?.label : null
  const actionDisabled = actions[item.action]?.disabled?.()

  return (
    <ItemWrapper
      onClick={actionHandler ? e => { actionHandler(e); onClose() } : (item.items?.length > 0 ? setActive : undefined)}
      disabled={(!actionHandler && !item.items) || item.items?.length === 0 || actionDisabled}
      type="button"
      $active={active}
    >
      <label>{item.label}</label>
      {item.shortcut && <Shortcut aria-hidden="true">{item.shortcut}</Shortcut>}
      {!item.shortcut && hotKeyLabel && <Shortcut aria-hidden="true">{hotKeyLabel}</Shortcut>}
      {item.items && <ChevronRight size="1em" />}
    </ItemWrapper>
  )
}

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  subMenu?: ReactNode
  visible?: boolean
  items?: ContextItems
  onClose?: () => void
  getRef?: (ref: HTMLDivElement) => void
}

const Dropdown = ({
  subMenu,
  visible = true,
  items,
  onClose,
  getRef,
  ...props
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>()

  // Close dropdown if click outside
  const handleClick = useCallback(e => !dropdownRef.current?.contains(e.target) && onClose(), [dropdownRef.current, onClose])

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

  useEffect(() => dropdownRef.current && getRef && getRef(dropdownRef.current), [dropdownRef.current])
  if (!visible) return null
  return (
    <Wrapper
      onContextMenu={e => e.preventDefault()}
      $subMenu={subMenu}
      $visible={visible}
      ref={dropdownRef}
      // Close dropdown if focus leaves
      onBlur={e => !subMenu && visible && !e.currentTarget.contains(e.relatedTarget) && onClose()}
      {...props}
    >
      {items?.map((item, i) => {
        if (item === 'hr') {
          return <Divider key={`hr-${i}`} />
        } else if (item.items) {
          return <ItemWithItems key={item.label} item={item} onClose={onClose}/>
        } else {
          return <Item key={item.label} item={item} onClose={onClose} />
        }
      })}
      {props.children}
    </Wrapper>
  )
}

export default Dropdown
