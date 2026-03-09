export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: "pen" | "eraser";
  timestamp: number;
}

export interface Page {
  id: string;
  notebookId: string;
  title: string;
  drawingData: DrawingPath[];
  createdAt: Date;
  updatedAt: Date;
  imageUri?: string;
}

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  pages: Page[];
  thumbnail?: string;
}

export interface DrawingContextType {
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentWidth: number;
  setCurrentWidth: (width: number) => void;
  currentTool: "pen" | "eraser";
  setCurrentTool: (tool: "pen" | "eraser") => void;
  paths: DrawingPath[];
  setPaths: (paths: DrawingPath[]) => void;
  addPath: (path: DrawingPath) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export interface NotebookContextType {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  currentPage: Page | null;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  setCurrentPage: (page: Page | null) => void;
  addNotebook: (notebook: Notebook) => void;
  updateNotebook: (notebook: Notebook) => void;
  deleteNotebook: (id: string) => void;
  addPage: (page: Page) => void;
  updatePage: (page: Page) => void;
  deletePage: (id: string) => void;
}
