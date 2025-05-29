import prisma from "../config/prisma.js";

class DashboardService {
  constructor() {}

  async getAdminSummary() {
    const [ordersCount, paidInvoices, clientsCount] = await Promise.all([
      prisma.order.count(),
      prisma.invoice.findMany({
        where: { status: "paid" },
        select: { amount: true },
      }),
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: {
                name: "user",
              },
            },
          },
        },
      }),
    ]);

    const salesCount = paidInvoices.length;
    const earningsCOP = paidInvoices.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0
    );

    return {
      ordersCount,
      salesCount,
      earningsCOP,
      clientsCount,
    };
  }
}

export default DashboardService;
