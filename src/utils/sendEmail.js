import { createTransport } from "nodemailer";
import { EMAIL } from "../config/index.js";

const HTML_TEMPLATE = (subject, children) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }
        
        .logo {
            display: block;
            max-width: 100px;
            margin-bottom: 1rem;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            border-radius: 5px;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        .info {
            margin-bottom: 20px;
        }

        .info label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .info p {
            margin: 0;
        }
        
        .flex {
          display: flex;
          gap: 2;
        }
        
        /* Signature container */
        .signature-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
        }

        /* Signature content */
        .signature-content {
            line-height: 1.5;
        }

        /* Contact information */
        .contact-info {
            margin-bottom: 10px;
        }

        .contact-info p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <img class="logo" alt="logo de entopias cafe" src="https://i.imgur.com/RjbCbTD.png" />
    
        ${children}

        <div class="signature-container">
        <div class="signature-content">
            <p>Gracias,</p>
            <p>Soporte </p>
            <p>Entopias Cafe</p>
        </div>
    </div>
    </div>
</body>
</html>`;
};

async function sendEmail({ to, subject, message }) {
  const transporter = createTransport({
    host: EMAIL.HOST,
    port: EMAIL.PORT,
    service: EMAIL.SERVICE,
    secure: false,
    auth: {
      user: EMAIL.MAIL,
      pass: EMAIL.APP_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL.MAIL,
    to,
    subject,
    html: HTML_TEMPLATE(subject, message),
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    throw new Error("Error al enviar el email.");
  }
}

export default sendEmail;
