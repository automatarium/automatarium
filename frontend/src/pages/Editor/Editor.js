import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAutosaveProject, useSyncCurrentProject, useActions, useEvent } from '/src/hooks'
import { useToolStore, useProjectStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'
import { Menubar, Sidepanel, Toolbar, EditorPanel, Spinner } from '/src/components'

import { Content, LoadingContainer } from './editorStyle'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState()

  // Syncronize last-opened project with backend before showing it
  const loading = useSyncCurrentProject() 

  // Auto save project as its edited
  useAutosaveProject() 

  // Register action hotkey
  useActions(true)

  // Project must be set
  useEffect(() => {
    if (!useProjectStore.getState().project) {
      navigate('/new')
    }
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
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  if (loading) return <LoadingContainer>
    <Spinner />
  </LoadingContainer>

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
