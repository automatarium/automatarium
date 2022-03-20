import { useState } from 'react'

import { GraphView } from '/src/components'
import { Menubar, Sidepanel, Toolbar } from './components'

import { Content } from './editorStyle'

const Editor = () => {
  const [tool, setTool] = useState('Cursor')

  return (
    <>
      <Menubar />

      <Content>
        <Toolbar value={tool} onChange={t => setTool(t)} />
        <GraphView style={{flex: 1}} />
        <Sidepanel />
      </Content>
    </>
  )
}

export default Editor