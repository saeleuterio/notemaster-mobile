import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useNotebook } from "../contexts/NotebookContext";
import { useDrawing } from "../contexts/DrawingContext";
import { COLORS } from "../utils/constants";
import { Page, Notebook } from "../types";
import { v4 as uuidv4 } from "uuid";

interface NotebookScreenProps {
  notebook: Notebook;
  onGoBack: () => void;
  onSelectPage: (page: Page) => void;
}

export function NotebookScreen({
  notebook,
  onGoBack,
  onSelectPage,
}: NotebookScreenProps) {
  const { addPage, deletePage } = useNotebook();
  const { setPaths } = useDrawing();
  const [modalVisible, setModalVisible] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  const handleCreatePage = () => {
    if (!pageTitle.trim()) {
      Alert.alert("Erro", "Digite um nome para a página");
      return;
    }

    const newPage: Page = {
      id: uuidv4(),
      notebookId: notebook.id,
      title: pageTitle,
      drawingData: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addPage(newPage);
    setPageTitle("");
    setModalVisible(false);
  };

  const handleSelectPage = (page: Page) => {
    setPaths(page.drawingData);
    onSelectPage(page);
  };

  const handleDeletePage = (id: string) => {
    Alert.alert(
      "Deletar Página",
      "Tem certeza que deseja deletar esta página?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => deletePage(id),
        },
      ],
    );
  };

  const renderPageCard = ({ item }: { item: Page }) => (
    <TouchableOpacity
      style={styles.pageCard}
      onPress={() => handleSelectPage(item)}
      onLongPress={() => handleDeletePage(item.id)}
    >
      <View style={styles.pagePreview}>
        <Text style={styles.pagePreviewText}>📄</Text>
      </View>
      <View style={styles.pageInfo}>
        <Text style={styles.pageTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.pageDate}>
          {item.updatedAt.toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.headerButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {notebook.title}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {notebook.pages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhuma página criada</Text>
          <Text style={styles.emptyStateSubtext}>
            Toque em "+" para adicionar uma página
          </Text>
        </View>
      ) : (
        <FlatList
          data={notebook.pages}
          renderItem={renderPageCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Page Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Página</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da página"
              value={pageTitle}
              onChangeText={setPageTitle}
              placeholderTextColor={COLORS.textLight}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreatePage}
              >
                <Text style={styles.createButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    marginHorizontal: 12,
  },
  headerButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 20,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  listContent: {
    padding: 12,
  },
  pageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pagePreview: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pagePreviewText: {
    fontSize: 28,
  },
  pageInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  pageDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  createButtonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 16,
  },
});
