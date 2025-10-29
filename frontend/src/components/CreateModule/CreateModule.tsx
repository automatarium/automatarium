import { useState } from "react"
import { useEvent } from "/src/hooks"
import { Button, Modal, Input, TextArea } from "/src/components"
import { useProjectStore, useModuleStore } from "/src/stores"
import { ProjectType } from "/src/types/ProjectTypes"
import { createNewModule, createNewModuleProject, ModuleProject } from "@/stores/useModuleStore"
import { useNavigate } from "react-router-dom"
import { ColourName } from "/src/config"
import { useTranslation } from "react-i18next"
import i18n from "/src/config/i18n"

// Import helper to fix shape mismatches
import { normalizeModule } from "@/util/normalizeModule"

const CreateModule = () => {
  const navigate = useNavigate()
  const setProject = useProjectStore((s) => s.set)
  const setModule = useModuleStore((s) => s.setModule)
  const addModuleProject = useModuleStore((s) => s.upsertProject)
  const getModuleProject = useModuleStore((s) => s.getProject)
  const addQuestion = useModuleStore((s) => s.upsertQuestion)
  const showModuleWindow = useModuleStore((s) => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore((s) => s.setShowModuleWindow)
  const currentProject = useProjectStore((s) => s.project)

  const [isModalOpen, setModalOpen] = useState(false)
  const [newModuleType, setModuleType] = useState<ProjectType>("FSA")
  const [moduleName, setModuleName] = useState("")
  const [moduleDescription, setModuleDescription] = useState("")
  const [project, setProjectforModule] = useState(false)
  const { t } = useTranslation("common")

  useEvent("modal:createModule", (e) => {
    setModalOpen(true)
    setModuleType("FSA")
    setModuleName("")
    setModuleDescription("")
    setProjectforModule(e.detail.project)
  })

  const handleNewModuleFile = (project: ModuleProject | null) => {
    const newModule = createNewModule()

    // Clone or create a new one
   const rawProject =
  project !== null
    ? JSON.parse(JSON.stringify(project))
    : createNewModuleProject(newModuleType);

    // 🩹 Normalize to match the new ModuleProject type
    const newModuleProject = normalizeModule(rawProject)

    // Assign a fresh UUID + color
    newModuleProject._id = crypto.randomUUID()
    newModuleProject.config.color = "pink" as ColourName

    // Update names
    const untitled = i18n.t("create_module.untitled", { ns: "common" })
    const name = moduleName === "" ? untitled : moduleName

    newModule.meta.name = name
    newModuleProject.meta.name = name
    newModule.description = moduleDescription

    // Save the new module
    setModule(newModule)
    addModuleProject(newModuleProject)
    addQuestion(newModuleProject._id, "")

    // Assign for editor
    setProject(getModuleProject(0))

    // Open the module window
    if (!showModuleWindow) {
      setShowModuleWindow(true)
    }

    // Close modal and navigate
    setModalOpen(false)
    navigate("/editor")
  }

  return (
    <>
      <Modal
        title={t("create_module.create_new")}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        actions={
          <>
            <Button secondary onClick={() => setModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (!project) {
                  handleNewModuleFile(null)
                } else {
                  handleNewModuleFile(currentProject)
                }
              }}
            >
              {t("create")}
            </Button>
          </>
        }
      >
        {!project && (
          <>
            {t("create_module.select_type")}
            <Input
              type="select"
              value={newModuleType}
              onChange={(e) =>
                setModuleType(e.target.value as ProjectType)
              }
            >
              <option value="FSA">{t("fsa")}</option>
              <option value="PDA">{t("pda")}</option>
              <option value="TM">{t("tm")}</option>
            </Input>
          </>
        )}

        {t("create_module.name")}
        <Input
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder={t("create_module.name_placeholder")}
        />

        {t("create_module.description")}
        <TextArea
          value={moduleDescription}
          onChange={(e) => setModuleDescription(e.target.value)}
          placeholder={t("create_module.description_placeholder")}
        />
      </Modal>
    </>
  )
}

export default CreateModule
