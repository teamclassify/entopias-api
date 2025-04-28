import prisma from "../config/prisma.js";

class OrderService {
  constructor() {}

  async countAll({ where } = {}) {
    const count = await prisma.order.count({
      where,
    });

    return count;
  }

  async find({ page = 1, where }) {
    const orders = await prisma.order.findMany({
      where,
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

      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }

  async findOne({ id }) {
    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    return order;
  }
}

export default OrderService;
