import { useState, useEffect, useCallback } from 'react'

import { useActions } from '/src/hooks'
import { useToolStore, useProjectStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'
import { createNewProject } from '/src/stores/useProjectStore' // #HACK

import { Menubar, Sidepanel, Toolbar, EditorPanel } from './components'
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
  const onKeyDown = useCallback(e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (!priorTool && e.code === 'Space') {
      setPriorTool(tool)
      setTool('hand')
      e.preventDefault()
    }
  }, [tool, priorTool])
  const onKeyUp = useCallback(e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (priorTool && e.code === 'Space') {
      setTool(priorTool)
      setPriorTool(undefined)
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
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
        <EditorPanel />
        <Sidepanel />
      </Content>
    </>
  )
}

export default Editor
