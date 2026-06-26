import emailjs from "@emailjs/browser";
import { formatTime12Hour } from "./formatTime12Hour";

export const sendBookingEmail = async (booking) => {
  try {
    console.log("EMAIL SENT TO:", booking.customer.email);
console.log("BOOKING:", booking);
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        customer_name: booking.customer.name,
        email: booking.customer.email,
        service_name: booking.service.name,
        booking_date: booking.date,
        booking_time: formatTime12Hour(booking.startTime),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};