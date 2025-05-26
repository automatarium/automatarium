import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Spinner } from '/src/components'
import { useProjectStore, useProjectsStore, useModuleStore, useModulesStore } from '/src/stores'
import { Container } from './shareStyle'

import { useParseFile, useParseModuleFile } from '/src/hooks/useActions'
import { showWarning } from '/src/components/Warning/Warning'
import { decodeData, decodeModule } from '/src/util/encoding'
import { StoredProject } from '/src/stores/useProjectStore'
import { StoredModule } from '/src/stores/useModuleStore'
import { useTranslation } from 'react-i18next'

const Share = () => {
  const { t } = useTranslation('share')
  const { type, data } = useParams()
  const navigate = useNavigate()
  const setProject = useProjectStore(s => s.set)
  const addProject = useProjectsStore(s => s.upsertProject)

  const addModule = useModulesStore(s => s.upsertModule)
  const setModule = useModuleStore(s => s.setModule)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const getModuleProject = useModuleStore(s => s.getProject)

  useEffect(() => {
    switch (type) {
      case 'raw': {
        decodeData(data).then((decodedJson) => {
          const dataJson = new File([JSON.stringify(decodedJson)], 'Shared Project')
          useParseFile(onData, t('load_fail'), dataJson, handleLoadSuccess, handleLoadFail)
        })
        break
      }
      case 'module': {
        decodeModule(data).then((decodedJson) => {
          const dataJson = new File([JSON.stringify(decodedJson)], 'Shared Project')
          useParseModuleFile(onModule, t('load_fail'), dataJson, handleLoadSuccess, handleLoadFail)
        })
        break
      }
      default: {
        showWarning(t('unknown_type') + ` ${type}`)
        handleLoadFail()
        break
      }
    }
  }, [data])

  const onData = (project: StoredProject) => {
    setProject(project)
    addProject(project)
  }

  const onModule = (module: StoredModule) => {
    setModule(module)
    addModule(module)
    setProject(getModuleProject(0))
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
  }

  const handleLoadSuccess = () => {
    navigate('/editor')
  }

  const handleLoadFail = () => {
    navigate('/new')
  }

  return (
    <Container>
      <Spinner />
    </Container>
  )
}

export default Share
