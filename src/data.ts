import type { Meeting, ReminderSettings } from "./features/reminders/types";

const now = new Date();

export const meetings: Meeting[] = [
  {
    id: "standup",
    title: "Daily Standup",
    startsAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
    source: "Google Calendar",
    meetingUrl: "https://meet.google.com/final-call-demo",
  },
  {
    id: "founder",
    title: "Meeting with Founder",
    startsAt: new Date(now.getTime() + 38 * 60 * 1000).toISOString(),
    source: "Apple Calendar",
  },
  {
    id: "planning",
    title: "Quarterly Planning Review for Growth Systems",
    startsAt: new Date(now.getTime() + 74 * 60 * 1000).toISOString(),
    source: "Google Calendar",
    meetingUrl: "https://zoom.us/j/1234567890",
  },
];

export const defaultSettings: ReminderSettings = {
  displayMode: "cursor",
  enabled: true,
  tenMinuteEnabled: true,
  fiveMinuteEnabled: true,
  launchOnStartup: true,
  animationSpeed: "normal",
  reminderTimings: [10, 5],
};
