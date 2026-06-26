export const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");

  return new Date(
    `2000-01-01T${hours}:${minutes}:00`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};