import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Plane } from "lucide-react";
import { formatBannerText, formatMeetingTime } from "../features/reminders/reminderText";
import type { ActiveReminder } from "../features/reminders/types";

const EDGE_OFFSET = 88;

type ReminderOverlayProps = {
  reminder: ActiveReminder | null;
  nativeWindow?: boolean;
};

export function ReminderOverlay({ reminder, nativeWindow = false }: ReminderOverlayProps) {
  if (!reminder) {
    return null;
  }

  const { display } = reminder.target;
  const left = nativeWindow ? 0 : display.x;
  const top = nativeWindow ? 0 : display.y;
  const width = nativeWindow ? window.innerWidth : display.width;
  const height = nativeWindow ? window.innerHeight : display.height;
  const y = Math.max(80, Math.round(height * 0.2));
  const travelsRight = reminder.direction === "left-to-right";
  const startX = travelsRight ? -EDGE_OFFSET : width + EDGE_OFFSET;
  const endX = travelsRight ? width + EDGE_OFFSET : -EDGE_OFFSET;

  return (
    <div
      className="pointer-events-none fixed z-50 overflow-hidden"
      style={{ left, top, width, height }}
      aria-live="polite"
    >
      <motion.div
        className="absolute flex items-center gap-3"
        style={{ top: y }}
        initial={{ x: startX, opacity: 0 }}
        animate={{ x: endX, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 7,
          ease: [0.42, 0, 0.18, 1],
          opacity: { duration: 7, times: [0, 0.12, 0.88, 1] },
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-mac-panel backdrop-blur-xl">
          <Plane
            className="h-7 w-7 text-signal"
            aria-hidden="true"
            style={{ transform: travelsRight ? "none" : "scaleX(-1)" }}
          />
        </div>
        <div className="banner-tail rounded-full border border-white/70 bg-white/90 px-5 py-3 shadow-mac-panel backdrop-blur-xl">
          <p className="max-w-[440px] truncate text-[15px] font-semibold text-ink">
            {formatBannerText(reminder.leadMinutes, reminder.meeting.title)}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          key={reminder.id}
          className="pointer-events-auto absolute left-1/2 top-[calc(20%+92px)] w-[min(420px,calc(100%-32px))] rounded-lg border border-white/70 bg-white/92 p-4 shadow-mac-panel backdrop-blur-xl"
          initial={{ opacity: 0, x: "-50%", y: 12, scale: 0.98 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: -8, scale: 0.98 }}
          transition={{ delay: 7, duration: 0.28, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">{reminder.meeting.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatMeetingTime(reminder.meeting.startsAt)} · {reminder.meeting.source}
              </p>
            </div>
            {reminder.meeting.meetingUrl ? (
              <a
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-signal px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                href={reminder.meeting.meetingUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Join
              </a>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
