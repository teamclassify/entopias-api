import prisma from "../config/prisma.js";

class PaymentsService {
  constructor() {}

  async createDataPayment({ session, products, userId, address }) {
    const order = await prisma.order.create({
      data: {
        userId,
        total: session.amount_total,
        status: "pending",
        addressId: address,
      },
    });

    const orderItems = await prisma.orderItem.createMany({
      data: products.map((product) => ({
        orderId: order.id,
        varietyId: product.varietyId,
        quantity: product.quantity,
      })),
    });

    const invoice = await prisma.invoice.create({
      data: {
        orderId: order.id,
        transactionId: session.id,
        bank: session.payment_method_types[0],
        amount: session.amount_total,
        date: new Date(session.created * 1000),
        status: "pending",
      },
    });

    return { order, invoice, orderItems };
  }

  async updateDataPayment(transactionId, data) {
    const invoice = await prisma.invoice.update({
      where: { transactionId },
      data: {
        status: data.status,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const order = await prisma.order.update({
      where: { id: invoice.orderId },
      data: {
        status: data.status,
      },
    });

    return { invoice, order };
  }
}

export default PaymentsService;
