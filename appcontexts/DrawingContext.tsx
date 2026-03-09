import React, { createContext, useState, useCallback } from "react";
import { DrawingPath, DrawingContextType } from "../types";
import { v4 as uuidv4 } from "uuid";
import { MAX_UNDO_STEPS } from "../utils/constants";

export const DrawingContext = createContext<DrawingContextType | undefined>(
  undefined,
);

export function DrawingProvider({ children }: { children: React.ReactNode }) {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(2);
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingPath[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingPath[][]>([]);

  const addPath = useCallback((path: DrawingPath) => {
    setPaths((prev) => {
      const newPaths = [...prev, path];
      setUndoStack((prevUndo) => {
        if (prevUndo.length >= MAX_UNDO_STEPS) {
          return [...prevUndo.slice(1), prev];
        }
        return [...prevUndo, prev];
      });
      setRedoStack([]);
      return newPaths;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, paths]);
      setPaths(previousState);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  }, [undoStack, paths]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, paths]);
      setPaths(nextState);
      setRedoStack((prev) => prev.slice(0, -1));
    }
  }, [redoStack, paths]);

  const clearCanvas = useCallback(() => {
    setUndoStack((prev) => [...prev, paths]);
    setPaths([]);
    setRedoStack([]);
  }, [paths]);

  const value: DrawingContextType = {
    currentColor,
    setCurrentColor,
    currentWidth,
    setCurrentWidth,
    currentTool,
    setCurrentTool,
    paths,
    setPaths,
    addPath,
    undo,
    redo,
    clearCanvas,
  };

  return (
    <DrawingContext.Provider value={value}>{children}</DrawingContext.Provider>
  );
}

export function useDrawing() {
  const context = React.useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within DrawingProvider");
  }
  return context;
}
