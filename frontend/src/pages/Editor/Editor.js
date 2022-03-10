import { Menubar, Toolbar } from './components'

import { Content } from './editorStyle'

const Editor = () => (
  <>
    <Menubar />

    <Content>
      <Toolbar value='Cursor' />
    </Content>
  </>
)

export default Editor