import prisma from "../config/prisma.js";

class InvoicesService {
  constructor() {}

  async countAll({ where } = {}) {
    const count = await prisma.invoice.count({
      where,
    });

    return count;
  }

  async find({ page = 1, where }) {
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: {
            user: true,
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

      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        date: "desc",
      },
    });

    return invoices;
  }

  async findOne({ id }) {
    const invoice = await prisma.invoice.findFirst({
      where: { id },
      include: {
        order: true,
      },
    });

    return invoice;
  }
}

export default InvoicesService;
