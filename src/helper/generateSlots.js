export const generateSlots = (
  openingTime,
  closingTime,
  slotDuration
) => {
  const slots = [];

  let current = new Date(`2000-01-01T${openingTime}:00`);
  const end = new Date(`2000-01-01T${closingTime}:00`);

  while (current < end) {
    slots.push(
      current.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    current = new Date(
      current.getTime() + slotDuration * 60000
    );
  }

  return slots;
};