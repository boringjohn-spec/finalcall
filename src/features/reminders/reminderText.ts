export function truncateBannerText(text: string, maxLength = 50) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

export function formatBannerText(leadMinutes: number, title: string) {
  return truncateBannerText(`${leadMinutes} min to ${title}`);
}

export function formatMeetingTime(startsAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(startsAt));
}
