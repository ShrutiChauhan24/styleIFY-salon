import emailjs from "@emailjs/browser";

export const sendContactEmail = async (data) => {
  try {
    await emailjs.send(
      import.meta.env.VITE_CONTACT_SERVICE_ID,
      import.meta.env.VITE_CONTACT_TEMPLATE_ID,
      {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        customer_message: data.message,
      },
      import.meta.env.VITE_CONTACT_PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};