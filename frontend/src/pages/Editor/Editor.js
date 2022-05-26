import { useState, useEffect } from 'react'

import { useActions, useEvent } from '/src/hooks'
import { useToolStore, useProjectStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'
import { createNewProject } from '/src/stores/useProjectStore' // #HACK
import { Menubar, Sidepanel, Toolbar, EditorPanel } from '/src/components'

import { Content } from './editorStyle'

const Editor = () => {
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState()
  const set = useProjectStore(s => s.set)

  // Register action hotkey
  useActions(true)

  // Load the test project
  useEffect(() => {
    set(createNewProject())
  }, [])

  // Change tool when holding certain keys
  useEvent('keydown', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (!priorTool && e.code === 'Space') {
      setPriorTool(tool)
      setTool('hand')
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  useEvent('keyup', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (priorTool && e.code === 'Space') {
      setTool(priorTool)
      setPriorTool(undefined)
    }
    if (e.code === 'Space') {
      console.log('pressed space')
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  return (
    <>
      <Menubar />
      <Content>
        <Toolbar />
        <EditorPanel />
        <Sidepanel />
      </Content>
    </>
  )
}

export default Editor
