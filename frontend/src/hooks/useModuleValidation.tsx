import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModuleStore, useModulesStore, useProjectStore } from "/src/stores";

export function useModuleValidation() {
  const navigate = useNavigate();
  const project = useProjectStore((s) => s.project);
  const currentModule = useModuleStore((s) => s.module);
  const getProjectinModule = useModuleStore((s) => s.getProjectById);
  const setModule = useModuleStore((s) => s.setModule);
  const setShowModuleWindow = useModuleStore((s) => s.setShowModuleWindow);
  const updateModule = useModulesStore((s) => s.upsertModule);

  useEffect(() => {
    if (!project) {
      navigate("/new");
      return;
    }

    if (currentModule == null) {
      setShowModuleWindow(false);
      return;
    }

    if (getProjectinModule(project._id) === undefined) {
      setModule(null);
      setShowModuleWindow(false);
      return;
    }

    updateModule(currentModule);
  }, [project, currentModule]);
}
