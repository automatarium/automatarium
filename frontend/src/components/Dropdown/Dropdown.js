import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { Wrapper, ItemWrapper, Shortcut, Divider } from './dropdownStyle'

const ItemWithItems = ({ item }) => {
  const [active, setActive] = useState(false)

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <Item active={active} item={item} />
      <Dropdown
        items={item.items}
        subMenu
        visible={active}
      />
    </div>
  )
}

const Item = ({ item, active }) => (
  <ItemWrapper
    onClick={item.onClick}
    type="button"
    $active={active}
  >
    <span>{item.label}</span>
    {item.shortcut && <Shortcut>{item.shortcut}</Shortcut>}
    {item.items && <ChevronRight size="1em" />}
  </ItemWrapper>
)

const Dropdown = ({
  subMenu,
  visible = true,
  items,
  x,
  y,
  ...props
}) => (
  <Wrapper
    $x={`${x}px`}
    $y={`${y}px`}
    $subMenu={subMenu}
    $visible={visible}
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

export default Dropdown