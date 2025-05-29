import prisma from "../config/prisma.js";
import { sendEmailToClient } from "../services/EmailService.js";

export default class EmailController {
  async sendInvoiceEmail(req, res) {
    const { id } = req.params;
    const { subject, message } = req.body;

    const invoiceId = parseInt(id, 10);
    if (isNaN(invoiceId)) {
      return res.status(400).json({ error: "ID de factura inválido" });
    }

    try {
      const invoice = await prisma.invoice.findFirst({
        where: { id: Number(id) },
        include: {
          order: {
            include: {
              user: true,
              address: true,
              items: {
                include: {
                  variety: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!invoice) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }

      if (invoice.order.status !== "paid") {
        return res
          .status(400)
          .json({ error: "El pedido no ha sido pagado aún." });
      }

      console.log(">> Enviando a:", invoice.order.user.email);
      console.log(">> Asunto:", subject);
      console.log(">> Mensaje:", message);

      await sendEmailToClient({
        to: invoice.order.user.email,
        subject,
        message,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("🔥 Error al enviar correo:", error);
      return res.status(500).json({ error: "Error interno al enviar correo" });
    }
  }
}
