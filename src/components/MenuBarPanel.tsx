import { Bell, CalendarDays, Check, Clock, Plane, Power, Settings } from "lucide-react";
import type { Meeting, ReminderSettings } from "../features/reminders/types";
import { formatMeetingTime } from "../features/reminders/reminderText";

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
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-soft-line">
              <Plane className="h-5 w-5 text-signal" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">FinalCall</h1>
              <p className="text-sm text-slate-500">Menu bar meeting reminders</p>
            </div>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-soft-line transition hover:text-ink"
            title="Quit App"
            type="button"
          >
            <Power className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-lg border border-slate-200 bg-white/86 p-5 shadow-soft-line">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-spruce" aria-hidden="true" />
                <h2 className="text-base font-semibold">Upcoming Meetings</h2>
              </div>
              <span className="rounded-full bg-runway px-3 py-1 text-xs font-medium text-slate-600">
                60 sec sync
              </span>
            </div>

            <div className="space-y-3">
              {meetings.map((meeting) => (
                <article
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-4"
                  key={meeting.id}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-runway text-slate-600">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{meeting.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatMeetingTime(meeting.startsAt)} · {meeting.source}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {meeting.meetingUrl ? "Online" : "No link"}
                  </span>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-signal px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                type="button"
                onClick={() => onTriggerReminder(10)}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                Preview 10 min
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:text-ink"
                type="button"
                onClick={() => onTriggerReminder(5)}
              >
                <Plane className="h-4 w-4" aria-hidden="true" />
                Preview 5 min
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white/86 p-5 shadow-soft-line">
              <div className="mb-5 flex items-center gap-2">
                <Settings className="h-5 w-5 text-coral" aria-hidden="true" />
                <h2 className="text-base font-semibold">Reminder Settings</h2>
              </div>

              <div className="space-y-5">
                <SettingRow
                  label="10-minute reminder"
                  enabled={settings.tenMinuteEnabled}
                  onChange={(enabled) => onSettingsChange({ ...settings, tenMinuteEnabled: enabled })}
                />
                <SettingRow
                  label="5-minute reminder"
                  enabled={settings.fiveMinuteEnabled}
                  onChange={(enabled) => onSettingsChange({ ...settings, fiveMinuteEnabled: enabled })}
                />
                <SettingRow
                  label="Launch on startup"
                  enabled={settings.launchOnStartup}
                  onChange={(enabled) => onSettingsChange({ ...settings, launchOnStartup: enabled })}
                />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white/86 p-5 shadow-soft-line">
              <h2 className="text-base font-semibold">Display Mode</h2>
              <div className="mt-4 rounded-lg border border-signal/20 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Cursor Display</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Reminders appear on the monitor containing the cursor.
                    </p>
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white/86 p-5 shadow-soft-line">
              <h2 className="text-base font-semibold">Connected Calendars</h2>
              <div className="mt-4 grid gap-3">
                <CalendarAccount name="Work Google" type="Google Calendar" />
                <CalendarAccount name="Personal Google" type="Google Calendar" />
                <CalendarAccount name="Apple Calendar" type="Native macOS" />
              </div>
            </section>
          </aside>
        </div>
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
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        checked={enabled}
        className="peer sr-only"
        type="checkbox"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span className="relative h-7 w-12 rounded-full bg-slate-200 transition peer-checked:bg-signal">
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function CalendarAccount({ name, type }: { name: string; type: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-3">
      <div>
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="mt-0.5 text-xs text-slate-500">{type}</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        Connected
      </span>
    </div>
  );
}
