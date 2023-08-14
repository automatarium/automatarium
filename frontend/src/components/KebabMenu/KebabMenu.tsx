import { useState } from 'react'

const KebabMenu = (props) => {
  const [open, setOpen] = useState(false)

  const handleclick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  return (

      <li>
        <a onClick={(e) => handleclick(e)}>
          {props.icon}
        </a>
        {open && props.children}
      </li>
  )
}

export default KebabMenu
