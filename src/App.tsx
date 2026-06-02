import { useEffect, useMemo, useRef, useState } from "react";
import { defaultSettings, meetings } from "./data";
import { ReminderOverlay } from "./components/ReminderOverlay";
import { MenuBarPanel } from "./components/MenuBarPanel";
import { ReminderQueue } from "./features/reminders/reminderQueue";
import type { ActiveReminder, ReminderLeadTime, ReminderSettings } from "./features/reminders/types";

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
      <ReminderOverlay reminder={activeReminder} />
    </>
  );
}
