import prisma from "../config/prisma.js";

class CustomerStatsService {
  constructor() {}

  // Total de clientes
  async getTotalCustomers() {
    return prisma.user.count();
  }

  // Clientes registrados por mes (últimos 12 meses)
  async getCustomersRegisteredMonthly({ months = 12 }) {
    const result = await prisma.$queryRaw`
      SELECT 
        to_char("createdAt", 'YYYY-MM') AS month, 
        COUNT(*) as total
      FROM "User"
      GROUP BY month
      ORDER BY month DESC
      LIMIT ${months};
    `;
    return result;
  }

  // Clientes con al menos una compra
  async getCustomersWithOrders() {
    const count = await prisma.user.count({
      where: {
        orders: {
          some: {},
        },
      },
    });
    return count;
  }

  // Top clientes por gasto (basado en facturas pagadas)
  async getTopSpenders({ limit = 5 }) {
    const invoices = await prisma.invoice.findMany({
      where: {
        status: "paid",
      },
      select: {
        amount: true,
        order: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const spenderMap = new Map();

    for (const invoice of invoices) {
      const user = invoice.order?.user;
      if (!user) continue;

      const prev = spenderMap.get(user.id) || { ...user, totalSpent: 0 };
      spenderMap.set(user.id, {
        ...user,
        totalSpent: prev.totalSpent + invoice.amount,
      });
    }

    return [...spenderMap.values()]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  // Clientes agrupados por ciudad
  async getCustomersByCity() {
    const result = await prisma.$queryRaw`
      SELECT 
        "city",
        COUNT(DISTINCT "userId") as total
      FROM "Address"
      GROUP BY "city"
      ORDER BY total DESC;
    `;
    return result;
  }

  // Clientes agrupados por país
  async getCustomersByCountry() {
    const result = await prisma.$queryRaw`
      SELECT 
        "country",
        COUNT(DISTINCT "userId") as total
      FROM "Address"
      GROUP BY "country"
      ORDER BY total DESC;
    `;
    return result;
  }

  // Clientes con facturas pendientes
  async getCustomersWithPendingInvoices() {
    const pendingInvoices = await prisma.invoice.findMany({
      where: {
        status: "pending",
      },
      select: {
        amount: true,
        order: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const pendingMap = new Map();

    for (const invoice of pendingInvoices) {
      const user = invoice.order?.user;
      if (!user) continue;

      const prev = pendingMap.get(user.id) || { ...user, totalPending: 0, count: 0 };
      pendingMap.set(user.id, {
        ...user,
        totalPending: prev.totalPending + invoice.amount,
        count: prev.count + 1,
      });
    }

    return [...pendingMap.values()].sort((a, b) => b.totalPending - a.totalPending);
  }

  // Resumen general de facturas pendientes
  async getPendingInvoicesSummary() {
    const result = await prisma.invoice.aggregate({
      where: { status: "pending" },
      _count: { id: true },
      _sum: { amount: true },
    });

    return {
      totalPendientes: result._count.id,
      montoPendiente: result._sum.amount || 0,
    };
  }
}

export default CustomerStatsService;
