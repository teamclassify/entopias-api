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

    return invoice;
  }

  async findByDateRange({ from, to, limit }) {
    const where = {};

    if ((from || to) && !isNaN(new Date(from)) && !isNaN(new Date(to))) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const invoice = await prisma.invoice.findMany({
      where,
      take: limit,
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
    });
    return invoice;
  }

  async getRecentInvoices() {
    const invoices = await prisma.invoice.findMany({
      where: { status: "paid" },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        date: true,
        order: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return invoices.map((inv) => ({
      id: inv.id,
      amount: inv.amount,
      date: inv.date,
      cliente: inv.order.user.name,
    }));
  }

  async getTopSellingProducts({ limit = 5 }) {
    const result = await prisma.orderItem.groupBy({
      by: ["varietyId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const data = await Promise.all(
      result.map(async (item) => {
        const variety = await prisma.variety.findUnique({
          where: { id: item.varietyId },
          include: { product: true },
        });

        return {
          productId: variety.product.id,
          productName: variety.product.name,
          totalSold: item._sum.quantity,
        };
      })
    );

    return data;
  }
}

export default InvoicesService;
