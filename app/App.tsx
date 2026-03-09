import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NotebookProvider } from "./contexts/NotebookContext";
import { DrawingProvider } from "./contexts/DrawingContext";
import { HomeScreen } from "./screens/HomeScreen";
import { NotebookScreen } from "./screens/NotebookScreen";
import { DrawingScreen } from "./screens/DrawingScreen";
import { Notebook, Page } from "./types";
import { COLORS } from "./utils/constants";

type Screen = "home" | "notebook" | "drawing";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(
    null,
  );
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handleSelectNotebook = (notebook: Notebook) => {
    setSelectedNotebook(notebook);
    setCurrentScreen("notebook");
  };

  const handleSelectPage = (page: Page) => {
    setSelectedPage(page);
    setCurrentScreen("drawing");
  };

  const handleGoBack = () => {
    if (currentScreen === "drawing") {
      setCurrentScreen("notebook");
    } else if (currentScreen === "notebook") {
      setCurrentScreen("home");
    }
  };

  return (
    <NotebookProvider>
      <DrawingProvider>
        {currentScreen === "home" && (
          <HomeScreen onSelectNotebook={handleSelectNotebook} />
        )}
        {currentScreen === "notebook" && selectedNotebook && (
          <NotebookScreen
            notebook={selectedNotebook}
            onGoBack={handleGoBack}
            onSelectPage={handleSelectPage}
          />
        )}
        {currentScreen === "drawing" && selectedPage && (
          <DrawingScreen onGoBack={handleGoBack} />
        )}
      </DrawingProvider>
    </NotebookProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
