import { getDisplayStrategy } from "../display/strategies";
import { invokeIfAvailable } from "../../lib/tauri";
import type { ActiveReminder, ReminderRequest, ReminderSettings } from "./types";

type ReminderListener = (reminder: ActiveReminder | null) => void;

const FLIGHT_MS = 7_000;
const CARD_MS = 10_000;

export class ReminderQueue {
  private queue: ReminderRequest[] = [];
  private activeReminder: ActiveReminder | null = null;
  private listeners = new Set<ReminderListener>();
  private activeTimer: number | undefined;

  constructor(private getSettings: () => ReminderSettings) {}

  subscribe(listener: ReminderListener) {
    this.listeners.add(listener);
    listener(this.activeReminder);

    return () => {
      this.listeners.delete(listener);
    };
  }

  enqueue(reminder: ReminderRequest) {
    const settings = this.getSettings();

    if (!settings.enabled) {
      return;
    }

    this.queue.push(reminder);
    void this.pump();
  }

  private async pump() {
    if (this.activeReminder || !this.queue.length) {
      return;
    }

    const nextReminder = this.queue.shift();

    if (!nextReminder) {
      return;
    }

    const strategy = getDisplayStrategy(this.getSettings().displayMode);
    const target = await strategy.resolveTarget();
    this.activeReminder = { ...nextReminder, target };
    this.emit();
    void invokeIfAvailable("show_reminder_overlay", { reminder: this.activeReminder });

    window.clearTimeout(this.activeTimer);
    this.activeTimer = window.setTimeout(() => {
      this.activeReminder = null;
      this.emit();
      void this.pump();
    }, FLIGHT_MS + CARD_MS);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.activeReminder);
    }
  }
}
