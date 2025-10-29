import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content, EditorContent } from "./editorStyle";
import { Menubar, Toolbar, EditorPanel, BottomPanel, Sidepanel, ExportImage, ImportDialog, ShareUrl, ShortcutGuide, FinalStatePopup, ShareUrlModule, CreateModule } from "/src/components";
import { useAutosaveProject } from "../../hooks";
import { useModuleStore, useProjectStore } from "/src/stores";
import ModuleWindow from "./components/ModuleWindow/ModuleWindow";
import PDAStackVisualiser from "../../components/PDAStackVisualiser/stackVisualiser";
import TemplateDelConfDialog from "./components/TemplateDelConfDialog/TemplateDelConfDialog";
import EditorPageTour from "../Tutorials/guidedTour/EditorPageTour";
import { useEditorInit } from "../../hooks/useEditorInit";
import { useEditorControls } from "../../hooks/useEditorControls";

export default function Editor() {
  const [panelWidth, setPanelWidth] = useState(300);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const project = useProjectStore((s) => s.project);
  const projectType = project?.config.type;
  const isSaving = useAutosaveProject();
  const { showModuleWindow, module } = useModuleStore();
  const setShowModuleWindow = useModuleStore((s) => s.setShowModuleWindow);


  useEditorInit();
  useEditorControls();

  const handlePanelWidthChange = (newWidth: number) => setPanelWidth(newWidth);

  return (
    <>
      <Menubar isSaving={isSaving} />
      <Content>
        <Toolbar />
        {showModuleWindow && module && (
          <ModuleWindow onPanelWidthChange={handlePanelWidthChange} />
        )}
        <EditorContent>
          <EditorPanel />
          <BottomPanel />
        </EditorContent>
        {projectType === "PDA" && <PDAStackVisualiser panelWidth={panelWidth} />}
        <Sidepanel onToggle={setShowModuleWindow} />

      </Content>
      <ShortcutGuide />
      <FinalStatePopup />
      <ExportImage />
      <ShareUrl />
      <ShareUrlModule />
      <TemplateDelConfDialog
        isOpen={confirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(true)}
        setClose={() => setConfirmDialogOpen(false)}
      />
      <ImportDialog navigateFunction={useNavigate()} />
      {showTour && <EditorPageTour onClose={() => setShowTour(false)} />}
      <CreateModule />
    </>
  );
}
