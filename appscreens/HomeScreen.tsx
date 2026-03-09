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
import { useNotebook } from "../appcontexts/NotebookContext";
import {
  COLORS,
  NOTEBOOK_COLORS,
  MAX_FREE_NOTEBOOKS,
} from "../utils/constants";
import { Notebook } from "../types";
import { v4 as uuidv4 } from "uuid";

interface HomeScreenProps {
  onSelectNotebook: (notebook: Notebook) => void;
}

export function HomeScreen({ onSelectNotebook }: HomeScreenProps) {
  const { notebooks, addNotebook, deleteNotebook } = useNotebook();
  const [modalVisible, setModalVisible] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTEBOOK_COLORS[0]);

  const handleCreateNotebook = () => {
    if (!notebookTitle.trim()) {
      Alert.alert("Erro", "Digite um nome para o caderno");
      return;
    }

    if (notebooks.length >= MAX_FREE_NOTEBOOKS) {
      Alert.alert(
        "Limite Atingido",
        `Você atingiu o limite de ${MAX_FREE_NOTEBOOKS} cadernos na versão gratuita.`,
      );
      return;
    }

    const newNotebook: Notebook = {
      id: uuidv4(),
      title: notebookTitle,
      color: selectedColor,
      createdAt: new Date(),
      updatedAt: new Date(),
      pages: [],
    };

    addNotebook(newNotebook);
    setNotebookTitle("");
    setSelectedColor(NOTEBOOK_COLORS[0]);
    setModalVisible(false);
  };

  const handleDeleteNotebook = (id: string) => {
    Alert.alert(
      "Deletar Caderno",
      "Tem certeza que deseja deletar este caderno?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => deleteNotebook(id),
        },
      ],
    );
  };

  const renderNotebookCard = ({ item }: { item: Notebook }) => (
    <TouchableOpacity
      style={[styles.notebookCard, { backgroundColor: item.color }]}
      onPress={() => onSelectNotebook(item)}
      onLongPress={() => handleDeleteNotebook(item.id)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.notebookTitle}>{item.title}</Text>
        <Text style={styles.pageCount}>{item.pages.length} páginas</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Cadernos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {notebooks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum caderno criado</Text>
          <Text style={styles.emptyStateSubtext}>
            Toque em "+ Novo" para começar
          </Text>
        </View>
      ) : (
        <FlatList
          data={notebooks}
          renderItem={renderNotebookCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Notebook Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Caderno</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do caderno"
              value={notebookTitle}
              onChangeText={setNotebookTitle}
              placeholderTextColor={COLORS.textLight}
            />

            <Text style={styles.colorLabel}>Cor:</Text>
            <View style={styles.colorGrid}>
              {NOTEBOOK_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateNotebook}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 14,
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
    padding: 8,
  },
  columnWrapper: {
    gap: 8,
    paddingHorizontal: 8,
  },
  notebookCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 120,
    justifyContent: "flex-end",
  },
  cardContent: {
    gap: 4,
  },
  notebookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  pageCount: {
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
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: COLORS.text,
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
