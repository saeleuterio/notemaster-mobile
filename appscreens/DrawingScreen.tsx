import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import { useDrawing } from "../contexts/DrawingContext";
import { useNotebook } from "../contexts/NotebookContext";
import { DrawingCanvas } from "../components/DrawingCanvas";
import { ToolBar } from "../components/ToolBar";
import { COLORS } from "../utils/constants";
import { Page } from "../types";

const { width, height } = Dimensions.get("window");

export function DrawingScreen({ onGoBack }: { onGoBack: () => void }) {
  const { paths, undo, redo, clearCanvas } = useDrawing();
  const { currentPage, updatePage } = useNotebook();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    setCanUndo(paths.length > 0);
  }, [paths]);

  const handleSave = async () => {
    if (!currentPage) {
      Alert.alert("Erro", "Nenhuma página selecionada");
      return;
    }

    try {
      const updatedPage: Page = {
        ...currentPage,
        drawingData: paths,
        updatedAt: new Date(),
      };

      await updatePage(updatedPage);
      Alert.alert("Sucesso", "Página salva com sucesso!");
      onGoBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar página");
      console.error(error);
    }
  };

  const handleClear = () => {
    Alert.alert("Limpar Canvas", "Tem certeza que deseja limpar o desenho?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        style: "destructive",
        onPress: clearCanvas,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.headerButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentPage?.title || "Nova Página"}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <DrawingCanvas
        width={width}
        height={height - 200}
        onDrawingComplete={() => {}}
      />

      <ToolBar
        onUndo={canUndo ? undo : undefined}
        onRedo={canRedo ? redo : undefined}
        onClear={handleClear}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  headerButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
});
