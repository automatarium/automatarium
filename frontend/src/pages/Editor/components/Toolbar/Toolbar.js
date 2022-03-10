import { MousePointer2, Hand, MessageSquare, Circle } from 'lucide-react'

import { Sidebar } from '../../components'

const tools = [
  {
    label: 'Cursor',
    icon: <MousePointer2 />,
  },
  {
    label: 'Hand',
    icon: <Hand />,
  },
  {
    label: 'Transition',
    icon: <Circle />,
  },
  {
    label: 'Comment',
    icon: <MessageSquare />,
  },
]

const Toolbar = ({
  onChange,
  value,
}) => {
  return (
    <Sidebar $tools>
      {tools.map(tool => (
        <Sidebar.Button
          key={tool.label}
          onClick={() => onChange(tool.label)}
          $active={value === tool.label}
        >
          {tool.icon}
        </Sidebar.Button>
      ))}
    </Sidebar>
  )
}

export default Toolbar