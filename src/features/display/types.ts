export type DisplayMode = "cursor";

export type FutureDisplayMode = DisplayMode | "active" | "main" | "all";

export type DisplayBounds = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleFactor: number;
};

export type CursorPosition = {
  x: number;
  y: number;
};

export type DisplaySnapshot = {
  cursor: CursorPosition;
  displays: DisplayBounds[];
};

export type TargetDisplay = {
  mode: DisplayMode;
  display: DisplayBounds;
  cursorAtStart: CursorPosition;
};

export interface DisplayStrategy {
  mode: DisplayMode;
  resolveTarget(): Promise<TargetDisplay>;
}
