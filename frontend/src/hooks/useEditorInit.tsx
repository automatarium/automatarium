import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExportStore, useViewStore, useProjectStore, useModulesStore, useModuleStore } from "/src/stores";

export function useEditorInit() {
  const navigate = useNavigate();
  const resetExportSettings = useExportStore((s) => s.reset);
  const setViewPositionAndScale = useViewStore((s) => s.setViewPositionAndScale);
  const project = useProjectStore((s) => s.project);
  const currentModule = useModuleStore((s) => s.module);
  const getProjectinModule = useModuleStore((s) => s.getProjectById);
  const setModule = useModuleStore((s) => s.setModule);
  const setShowModuleWindow = useModuleStore((s) => s.setShowModuleWindow);
  const updateModule = useModulesStore((s) => s.upsertModule);

  // Redirect if project not found
  useEffect(() => {
    if (!project) navigate("/new");
  }, [project]);

  // Initialize editor state
  useEffect(() => {
    resetExportSettings();
    setViewPositionAndScale({ x: 0, y: 0 }, 1);
  }, []);

  // Keep module synced with project
  useEffect(() => {
    if (!project) return;
    if (currentModule == null) {
      setShowModuleWindow(false);
    } else if (getProjectinModule(project._id) === undefined) {
      setModule(null);
      setShowModuleWindow(false);
    } else {
      updateModule(currentModule);
    }
  }, [currentModule, project]);
}
