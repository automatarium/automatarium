import { useState } from 'react'
import Dropdown from '../Dropdown/Dropdown'

const KebabMenu = (props) => {
  const [open, setOpen] = useState(false)

  const handleclick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  return <div>
  <a onClick={(e) => handleclick(e)}>
    {props.icon}
  </a>
  <Dropdown
    visible={open}
    onClose={() => setOpen(false)}
    style={{
      position: 'absolute',
      background: 'hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.9)'
    }}
    items={props.kebabItems}
  />
</div>
}

export default KebabMenu
