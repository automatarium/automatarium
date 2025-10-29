import { useState } from "react";
import { useEvent } from "/src/hooks";
import { haveInputFocused } from "/src/util/actions";
import useToolStore, { Tool } from "/src/stores/useToolStore";

export function useEditorControls() {
  const { tool, setTool } = useToolStore();
  const [priorTool, setPriorTool] = useState<Tool | undefined>(undefined);

  // Spacebar down → temporarily switch to "hand" tool
  useEvent("keydown", (e) => {
    if (haveInputFocused(e)) return;

    if (!priorTool && e.code === "Space") {
      setPriorTool(tool);
      setTool("hand");
    }

    if (e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [tool, priorTool]);

  // Spacebar up → restore previous tool
  useEvent("keyup", (e) => {
    if (haveInputFocused(e)) return;

    if (priorTool && e.code === "Space") {
      setTool(priorTool);
      setPriorTool(undefined);
    }

    if (e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [tool, priorTool]);

  // Middle mouse click also switches to "hand" tool
  useEvent("svg:mousedown", (e) => {
    if (!priorTool && e.detail.originalEvent.button === 1) {
      setPriorTool(tool);
      setTool("hand");
    }
  }, [tool, priorTool]);

  useEvent("svg:mouseup", (e) => {
    if (priorTool && e.detail.originalEvent.button === 1) {
      setTool(priorTool);
      setPriorTool(undefined);
    }
  }, [tool, priorTool]);
}
