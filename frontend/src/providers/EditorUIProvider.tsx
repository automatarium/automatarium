import { createContext, useContext, useState, ReactNode } from "react";

interface EditorUIContextType {
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (value: boolean) => void;
  showTour: boolean;
  setShowTour: (value: boolean) => void;
}

const EditorUIContext = createContext<EditorUIContextType | undefined>(undefined);

export function EditorUIProvider({ children }: { children: ReactNode }) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  return (
    <EditorUIContext.Provider
      value={{
        confirmDialogOpen,
        setConfirmDialogOpen,
        showTour,
        setShowTour,
      }}
    >
      {children}
    </EditorUIContext.Provider>
  );
}

export function useEditorUI() {
  const context = useContext(EditorUIContext);
  if (!context) {
    throw new Error("useEditorUI must be used within an EditorUIProvider");
  }
  return context;
}
