import React, { useRef, useState } from "react";
import { View, GestureResponderEvent } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useDrawing } from "../appcontexts/DrawingContext";
import { DrawingPath, Point } from "../apptypes";
import { v4 as uuidv4 } from "uuid";

interface DrawingCanvasProps {
  width: number;
  height: number;
  onDrawingComplete?: (paths: DrawingPath[]) => void;
}

export function DrawingCanvas({
  width,
  height,
  onDrawingComplete,
}: DrawingCanvasProps) {
  const { currentColor, currentWidth, currentTool, paths, addPath } =
    useDrawing();
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPathRef = useRef<Point[]>([]);
  const skiaPathRef = useRef<ReturnType<typeof Skia.Path.Make> | null>(null);

  const handleTouchStart = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    currentPathRef.current = [{ x: locationX, y: locationY }];
    skiaPathRef.current = Skia.Path.Make();
    skiaPathRef.current.moveTo(locationX, locationY);
    setIsDrawing(true);
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;
    currentPathRef.current.push({ x: locationX, y: locationY });

    if (skiaPathRef.current) {
      skiaPathRef.current.lineTo(locationX, locationY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDrawing || currentPathRef.current.length === 0) return;

    const newPath: DrawingPath = {
      id: uuidv4(),
      points: currentPathRef.current,
      color: currentColor,
      width: currentWidth,
      tool: currentTool,
      timestamp: Date.now(),
    };

    addPath(newPath);
    setIsDrawing(false);
    currentPathRef.current = [];
    skiaPathRef.current = null;

    if (onDrawingComplete) {
      onDrawingComplete(paths);
    }
  };

  const renderPaths = () => {
    return paths.map((path) => {
      const skiaPath = Skia.Path.Make();
      if (path.points.length > 0) {
        skiaPath.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          skiaPath.lineTo(path.points[i].x, path.points[i].y);
        }
      }

      const paint = Skia.Paint();
      paint.setColor(Skia.Color(path.color));
      paint.setStrokeWidth(path.width);
      paint.setStyle(0);

      return (
        <Path
          key={path.id}
          path={skiaPath}
          paint={paint}
          strokeCap="round"
          strokeJoin="round"
        />
      );
    });
  };

  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
      style={{
        width,
        height,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Canvas style={{ width, height }}>{renderPaths()}</Canvas>
    </View>
  );
}
