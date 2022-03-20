import { useState, useEffect, useCallback } from 'react'

import { GraphView } from '/src/components'
import { useToolStore } from '/src/stores'

import { Menubar, Sidepanel, Toolbar } from './components'
import { Content } from './editorStyle'

const Editor = () => {
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState()

  // Change tool when holding certain keys
  const onKeyDown = useCallback(e => {
    if (!priorTool && e.code === 'Space') {
      setPriorTool(tool)
      setTool('hand')
      e.preventDefault()
    }
  }, [tool, priorTool])
  const onKeyUp = useCallback(e => {
    if (priorTool && e.code === 'Space') {
      setTool(priorTool)
      setPriorTool(undefined)
      e.preventDefault()
    }
  }, [tool, priorTool])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  })
  
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
