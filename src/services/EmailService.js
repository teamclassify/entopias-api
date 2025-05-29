import nodemailer from "nodemailer";

export const sendEmailToClient = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SMPT_SERVICE,
      host: process.env.EMAIL_SMPT_HOST,
      port: process.env.EMAIL_SMPT_PORT,
      auth: {
        user: process.env.EMAIL_SMPT_MAIL,
        pass: process.env.EMAIL_SMPT_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"Entopías Café ☕" <${process.env.EMAIL_SMPT_MAIL}>`,
      to,
      subject,
      text: message,
    };

    console.log("📤 Enviando correo...");
    console.log("▶️ Para:", to);
    console.log("▶️ Asunto:", subject);
    console.log("▶️ Mensaje:", message);

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    throw new Error("Falló el envío del correo");
  }
};
