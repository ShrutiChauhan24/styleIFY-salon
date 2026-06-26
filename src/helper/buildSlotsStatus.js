export const buildSlotsStatus = ({
  date,
  allSlots,
  blockedTimes = [],
  bookedTimes = [],
}) => {
  return allSlots.map((slot) => {
    if (blockedTimes.includes(slot)) {
      return {
        date,
        time: slot,
        status: "blocked",
      };
    }

    if (bookedTimes.includes(slot)) {
      return {
        date,
        time: slot,
        status: "booked",
      };
    }

    return {
      date,
      time: slot,
      status: "available",
    };
  });
};