// Format time range (e.g. 13:03:40 -> 1 PM - 3 PM)
export function formatTimeRange(timeString, durationHours = 2) {
  if (timeString?.toLowerCase().includes(" to ")) {
    return timeString;
  }

  const [hours, minutes, seconds] = timeString?.split(":")?.map(Number);

  const start = new Date();
  start.setHours(hours, minutes, seconds || 0);

  const end = new Date(start);
  end.setHours(end.getHours() + durationHours);

  const formatOptions = {
    hour: "numeric",
    hour12: true,
  };

  const startTime = start.toLocaleTimeString("en-US", formatOptions);
  const endTime = end.toLocaleTimeString("en-US", formatOptions);

  return `${startTime} - ${endTime}`;
}

// Format date (e.g. 2026-06-01 -> Jun 1, 2026)
export function formatDate(dateString) {
  return new Date(dateString)?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
