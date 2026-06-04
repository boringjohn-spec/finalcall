import { Bell, CalendarDays, Check, Clock, Plane, Power, Settings } from "lucide-react";
import type { Meeting, ReminderSettings } from "../features/reminders/types";
import { formatMeetingTime } from "../features/reminders/reminderText";
import { invokeIfAvailable } from "../lib/tauri";

type MenuBarPanelProps = {
  meetings: Meeting[];
  settings: ReminderSettings;
  onSettingsChange(settings: ReminderSettings): void;
  onTriggerReminder(leadMinutes: 10 | 5): void;
};

export function MenuBarPanel({
  meetings,
  settings,
  onSettingsChange,
  onTriggerReminder,
}: MenuBarPanelProps) {
  return (
    <main className="w-[360px] h-[550px] overflow-y-auto overflow-x-hidden bg-slate-50 text-slate-800 flex flex-col p-4 select-none">
      <header className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
            <Plane className="h-4 w-4 text-signal" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">FinalCall</h1>
            <p className="text-[10px] text-slate-400">Meeting Reminders</p>
          </div>
        </div>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 shadow-sm transition hover:text-red-600 hover:bg-red-50 hover:border-red-100"
          title="Quit App"
          type="button"
          onClick={() => invokeIfAvailable("quit_app")}
        >
          <Power className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 space-y-4">
        {/* Upcoming Meetings */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-spruce" aria-hidden="true" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Meetings</h2>
            </div>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
              60s sync
            </span>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {meetings.map((meeting) => (
              <article
                className="grid grid-cols-[auto_1fr] items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition hover:bg-slate-50"
                key={meeting.id}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-slate-600">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-xs font-semibold text-slate-800">{meeting.title}</h3>
                    {meeting.meetingUrl && (
                      <span className="rounded bg-blue-50 px-1 py-0.2 text-[8px] font-medium text-blue-600 shrink-0">
                        Link
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatMeetingTime(meeting.startsAt)} · {meeting.source}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-signal py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              type="button"
              onClick={() => onTriggerReminder(10)}
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Preview 10m
            </button>
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 transition hover:text-slate-900 hover:bg-slate-50"
              type="button"
              onClick={() => onTriggerReminder(5)}
            >
              <Plane className="h-3.5 w-3.5" aria-hidden="true" />
              Preview 5m
            </button>
          </div>
        </section>

        {/* Reminder Settings */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="mb-3 flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-coral" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Settings</h2>
          </div>

          <div className="space-y-3">
            <SettingRow
              label="10-Minute Reminder"
              enabled={settings.tenMinuteEnabled}
              onChange={(enabled) => onSettingsChange({ ...settings, tenMinuteEnabled: enabled })}
            />
            <SettingRow
              label="5-Minute Reminder"
              enabled={settings.fiveMinuteEnabled}
              onChange={(enabled) => onSettingsChange({ ...settings, fiveMinuteEnabled: enabled })}
            />
            <SettingRow
              label="Launch on Startup"
              enabled={settings.launchOnStartup}
              onChange={(enabled) => onSettingsChange({ ...settings, launchOnStartup: enabled })}
            />
          </div>
        </section>

        {/* Display Mode */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Display Mode</h2>
          <div className="rounded-lg border border-signal/10 bg-blue-50/50 p-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800">Cursor Display</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Reminders appear on the screen containing the active cursor.
              </p>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal text-white">
              <Check className="h-3 w-3" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Connected Calendars */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Connected Calendars</h2>
          <div className="space-y-1.5">
            <CalendarAccount name="Work Google" type="Google Calendar" />
            <CalendarAccount name="Personal Google" type="Google Calendar" />
            <CalendarAccount name="Apple Calendar" type="Native macOS" />
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingRow({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange(enabled: boolean): void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        checked={enabled}
        className="peer sr-only"
        type="checkbox"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span className="relative h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-signal">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

function CalendarAccount({ name, type }: { name: string; type: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/30 p-2">
      <div>
        <p className="text-xs font-semibold text-slate-700">{name}</p>
        <p className="text-[9px] text-slate-400">{type}</p>
      </div>
      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">
        Connected
      </span>
    </div>
  );
}
