import React, { createContext, useState, useCallback, useEffect } from "react";
import { Notebook, Page, NotebookContextType } from "../types";

export const NotebookContext = createContext<NotebookContextType | undefined>(
  undefined,
);

export function NotebookProvider({ children }: { children: React.ReactNode }) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  const addNotebook = useCallback((notebook: Notebook) => {
    setNotebooks((prev) => [notebook, ...prev]);
  }, []);

  const updateNotebook = useCallback(
    (notebook: Notebook) => {
      setNotebooks((prev) =>
        prev.map((nb) => (nb.id === notebook.id ? notebook : nb)),
      );
      if (currentNotebook?.id === notebook.id) {
        setCurrentNotebook(notebook);
      }
    },
    [currentNotebook?.id],
  );

  const deleteNotebook = useCallback(
    (id: string) => {
      setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
      if (currentNotebook?.id === id) {
        setCurrentNotebook(null);
        setCurrentPage(null);
      }
    },
    [currentNotebook?.id],
  );

  const addPage = useCallback(
    (page: Page) => {
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === page.notebookId
            ? { ...nb, pages: [page, ...nb.pages] }
            : nb,
        ),
      );
      if (currentNotebook?.id === page.notebookId) {
        setCurrentNotebook((prev) =>
          prev ? { ...prev, pages: [page, ...prev.pages] } : null,
        );
      }
    },
    [currentNotebook?.id],
  );

  const updatePage = useCallback(
    (page: Page) => {
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === page.notebookId
            ? {
                ...nb,
                pages: nb.pages.map((p) => (p.id === page.id ? page : p)),
              }
            : nb,
        ),
      );
      if (currentPage?.id === page.id) {
        setCurrentPage(page);
      }
      if (currentNotebook?.id === page.notebookId) {
        setCurrentNotebook((prev) =>
          prev
            ? {
                ...prev,
                pages: prev.pages.map((p) => (p.id === page.id ? page : p)),
              }
            : null,
        );
      }
    },
    [currentPage?.id, currentNotebook?.id],
  );

  const deletePage = useCallback(
    (id: string) => {
      setNotebooks((prev) =>
        prev.map((nb) => ({
          ...nb,
          pages: nb.pages.filter((p) => p.id !== id),
        })),
      );
      if (currentPage?.id === id) {
        setCurrentPage(null);
      }
    },
    [currentPage?.id],
  );

  const value: NotebookContextType = {
    notebooks,
    currentNotebook,
    currentPage,
    setCurrentNotebook,
    setCurrentPage,
    addNotebook,
    updateNotebook,
    deleteNotebook,
    addPage,
    updatePage,
    deletePage,
  };

  return (
    <NotebookContext.Provider value={value}>
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  const context = React.useContext(NotebookContext);
  if (!context) {
    throw new Error("useNotebook must be used within NotebookProvider");
  }
  return context;
}
