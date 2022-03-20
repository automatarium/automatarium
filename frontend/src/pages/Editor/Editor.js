import { GraphView } from '/src/components'

import { Menubar, Sidepanel, Toolbar } from './components'
import { Content } from './editorStyle'

const Editor = () => {
  return (
    <>
      <Menubar />

      <Content>
        <Toolbar />
        <GraphView style={{flex: 1}} />
        <Sidepanel />
      </Content>
    </>
  )
}

export default Editor
