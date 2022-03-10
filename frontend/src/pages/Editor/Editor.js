import { FlaskConical } from 'lucide-react'
import { useState } from 'react'

import { GraphView } from '/src/components'
import { Menubar, Sidebar, Toolbar } from './components'

import { Content } from './editorStyle'

const Editor = () => {
  const [tool, setTool] = useState('Cursor')

  return (
    <>
      <Menubar />

      <Content>
        <Toolbar value={tool} onChange={t => setTool(t)} />
        <GraphView style={{flex: 1}} />
        <Sidebar><Sidebar.Button><FlaskConical /></Sidebar.Button></Sidebar>
      </Content>
    </>
  )
}

export default Editor