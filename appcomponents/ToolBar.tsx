import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { useDrawing } from "../appcontexts/DrawingContext";
import { DRAWING_COLORS, STROKE_WIDTHS, COLORS } from "../utils/constants";

interface ToolBarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
}

export function ToolBar({ onUndo, onRedo, onClear }: ToolBarProps) {
  const {
    currentColor,
    setCurrentColor,
    currentWidth,
    setCurrentWidth,
    currentTool,
    setCurrentTool,
  } = useDrawing();

  return (
    <View style={styles.container}>
      {/* Tool Selection */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.toolButton,
            currentTool === "pen" && styles.toolButtonActive,
          ]}
          onPress={() => setCurrentTool("pen")}
        >
          <Text style={styles.toolButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolButton,
            currentTool === "eraser" && styles.toolButtonActive,
          ]}
          onPress={() => setCurrentTool("eraser")}
        >
          <Text style={styles.toolButtonText}>🧹</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.section}
      >
        {DRAWING_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              currentColor === color && styles.colorButtonActive,
            ]}
            onPress={() => setCurrentColor(color)}
          />
        ))}
      </ScrollView>

      {/* Stroke Width */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.section}
      >
        {STROKE_WIDTHS.map((width) => (
          <TouchableOpacity
            key={width}
            style={[
              styles.widthButton,
              currentWidth === width && styles.widthButtonActive,
            ]}
            onPress={() => setCurrentWidth(width)}
          >
            <View
              style={{
                width: width * 2,
                height: width * 2,
                borderRadius: width,
                backgroundColor: COLORS.secondary,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.section}>
        {onUndo && (
          <TouchableOpacity style={styles.actionButton} onPress={onUndo}>
            <Text style={styles.actionButtonText}>↶</Text>
          </TouchableOpacity>
        )}
        {onRedo && (
          <TouchableOpacity style={styles.actionButton} onPress={onRedo}>
            <Text style={styles.actionButtonText}>↷</Text>
          </TouchableOpacity>
        )}
        {onClear && (
          <TouchableOpacity style={styles.actionButton} onPress={onClear}>
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  section: {
    flexDirection: "row",
    gap: 8,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toolButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toolButtonText: {
    fontSize: 20,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorButtonActive: {
    borderColor: COLORS.secondary,
  },
  widthButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  widthButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: 20,
  },
});
