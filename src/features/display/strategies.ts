import { findDisplayContainingCursor, getDisplaySnapshot } from "./displaySnapshot";
import type { DisplayMode, DisplayStrategy, TargetDisplay } from "./types";

export class CursorDisplayStrategy implements DisplayStrategy {
  mode: DisplayMode = "cursor";

  async resolveTarget(): Promise<TargetDisplay> {
    const snapshot = await getDisplaySnapshot();

    return {
      mode: this.mode,
      display: findDisplayContainingCursor(snapshot),
      cursorAtStart: snapshot.cursor,
    };
  }
}

const strategyMap: Record<DisplayMode, DisplayStrategy> = {
  cursor: new CursorDisplayStrategy(),
};

export function getDisplayStrategy(mode: DisplayMode): DisplayStrategy {
  return strategyMap[mode];
}
