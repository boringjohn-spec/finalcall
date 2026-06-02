import { invokeIfAvailable } from "../../lib/tauri";
import type { DisplayBounds, DisplaySnapshot } from "./types";

const fallbackDisplay = (): DisplayBounds => ({
  id: "browser-preview",
  name: "Browser Preview",
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  scaleFactor: window.devicePixelRatio || 1,
});

export async function getDisplaySnapshot(): Promise<DisplaySnapshot> {
  const snapshot = await invokeIfAvailable<DisplaySnapshot>("get_display_snapshot");

  if (snapshot?.displays.length) {
    return snapshot;
  }

  return {
    cursor: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    displays: [fallbackDisplay()],
  };
}

export function findDisplayContainingCursor(snapshot: DisplaySnapshot): DisplayBounds {
  const matchingDisplay = snapshot.displays.find((display) => {
    const withinX = snapshot.cursor.x >= display.x && snapshot.cursor.x < display.x + display.width;
    const withinY = snapshot.cursor.y >= display.y && snapshot.cursor.y < display.y + display.height;
    return withinX && withinY;
  });

  return matchingDisplay ?? snapshot.displays[0];
}
