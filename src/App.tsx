import { useEffect, useMemo, useRef, useState } from "react";
import { defaultSettings, meetings } from "./data";
import { ReminderOverlay } from "./components/ReminderOverlay";
import { MenuBarPanel } from "./components/MenuBarPanel";
import { ReminderQueue } from "./features/reminders/reminderQueue";
import type { ActiveReminder, ReminderLeadTime, ReminderSettings } from "./features/reminders/types";
import { invokeIfAvailable, isTauriRuntime } from "./lib/tauri";

function parseOverlayReminder(): ActiveReminder | null {
  const [, query = ""] = window.location.hash.split("?");
  const params = new URLSearchParams(query);
  const payload = params.get("payload");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(payload)) as ActiveReminder;
  } catch {
    return null;
  }
}

export default function App() {
  const [settings, setSettings] = useState<ReminderSettings>(defaultSettings);
  const [activeReminder, setActiveReminder] = useState<ActiveReminder | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const queue = useMemo(() => new ReminderQueue(() => settingsRef.current), []);

  useEffect(() => queue.subscribe(setActiveReminder), [queue]);

  // Auto-hide the panel when the window loses focus (click-outside behaviour).
  // We use the JS window blur event instead of Rust's Focused(false) because on
  // macOS with ActivationPolicy::Accessory, the OS fires Focused(false) immediately
  // on mouse-up after the tray click, which would close the panel instantly.
  // The 150ms delay lets the window fully settle before hiding.
  useEffect(() => {
    if (!isTauriRuntime()) return;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const onBlur = () => {
      hideTimer = setTimeout(() => {
        void invokeIfAvailable("hide_window");
      }, 150);
    };

    const onFocus = () => {
      if (hideTimer !== null) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (hideTimer !== null) clearTimeout(hideTimer);
    };
  }, []);

  const overlayReminder = window.location.hash.startsWith("#/overlay") ? parseOverlayReminder() : null;

  if (overlayReminder) {
    return <ReminderOverlay reminder={overlayReminder} nativeWindow />;
  }

  const triggerReminder = (leadMinutes: ReminderLeadTime) => {
    const meeting = meetings[leadMinutes === 5 ? 1 : 0];
    queue.enqueue({
      id: `${meeting.id}-${leadMinutes}-${Date.now()}`,
      meeting,
      leadMinutes,
      direction: leadMinutes === 10 ? "left-to-right" : "right-to-left",
    });
  };

  return (
    <>
      <MenuBarPanel
        meetings={meetings}
        settings={settings}
        onSettingsChange={setSettings}
        onTriggerReminder={triggerReminder}
      />
      {!isTauriRuntime() && <ReminderOverlay reminder={activeReminder} />}
    </>
  );
}
