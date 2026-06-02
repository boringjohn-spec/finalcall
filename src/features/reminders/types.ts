import type { DisplayMode, TargetDisplay } from "../display/types";

export type Meeting = {
  id: string;
  title: string;
  startsAt: string;
  source: "Google Calendar" | "Apple Calendar";
  meetingUrl?: string;
};

export type ReminderLeadTime = 10 | 5 | 15 | 1;

export type AnimationSpeed = "slow" | "normal" | "fast";

export type ReminderDirection = "left-to-right" | "right-to-left";

export type ReminderRequest = {
  id: string;
  meeting: Meeting;
  leadMinutes: ReminderLeadTime;
  direction: ReminderDirection;
};

export type ActiveReminder = ReminderRequest & {
  target: TargetDisplay;
};

export type ReminderSettings = {
  displayMode: DisplayMode;
  enabled: boolean;
  tenMinuteEnabled: boolean;
  fiveMinuteEnabled: boolean;
  launchOnStartup: boolean;
  animationSpeed: AnimationSpeed;
  reminderTimings: ReminderLeadTime[];
};
