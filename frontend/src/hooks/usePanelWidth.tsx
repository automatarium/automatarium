import { useState, useEffect } from "react";
import { useModuleStore } from "/src/stores";

export function usePanelWidth(defaultWidth = 300): [number, React.Dispatch<React.SetStateAction<number>>] {
  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const showModuleWindow = useModuleStore((s) => s.showModuleWindow);

  useEffect(() => {
    if (showModuleWindow) setPanelWidth(defaultWidth);
  }, [showModuleWindow]);

  return [ panelWidth, setPanelWidth ];
}
