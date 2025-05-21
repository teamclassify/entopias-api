import prisma from "../config/prisma.js";

class StatsService {
    constructor() { }


    async getSalesVarieties({ limit = 10, startDate, endDate, order = "desc" }) {
        if (!startDate) {
            startDate = new Date(new Date().setDate(new Date().getDate() - 30));
        }
        if (!endDate) {
            endDate = new Date();
        }
        const sales = await prisma.orderItem.groupBy({
            by: ['varietyId'],
            where: {
                order: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: order,
                },
            },
            take: limit,
        });

        const varieties = await prisma.variety.findMany({
            where: {
                id: { in: sales.map(s => s.varietyId) },
            },
            include: {
                product: true,
            }
        });

        const varietyMap = Object.fromEntries(
            varieties.map(v => [v.id, v])
        );

        return sales.map(s => {
            const v = varietyMap[s.varietyId];
            if (!v) {
                throw new Error(`Variety with ID ${s.varietyId} not found.`);
            }
            return {
                ...v,
                soldCount: s._sum.quantity,
            };
        });
    }

    async getSalesProducts({ limit = 10, startDate, endDate, order = "desc" }) {
        if (!startDate) {
            startDate = new Date(new Date().setDate(new Date().getDate() - 30)); // 30 días atrás
        }
        if (!endDate) {
            endDate = new Date(); // Fecha actual
        }
        const sales = await prisma.orderItem.groupBy({
            by: ['varietyId'],
            where: {
                order: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: order,
                },
            },
        });

        const varietiesInRange = sales.map(s => s.varietyId);

        const products = await prisma.product.findMany({
            where: {
                varieties: {
                    some: {
                        id: { in: varietiesInRange }
                    }
                },
            },
            include: {
                varieties: {
                    where: {
                        id: { in: varietiesInRange }
                    },
                }
            }
        });

        const varietyToProductId = new Map();
        products.forEach(p => {
            p.varieties.forEach(v => {
                varietyToProductId.set(v.id, p.id);
            });
        });

        const productCount = new Map();
        sales.forEach(s => {
            const productId = varietyToProductId.get(s.varietyId);
            const prev = productCount.get(productId) || 0;
            productCount.set(productId, prev + s._sum.quantity);
        });

        return products
            .map(p => ({
                ...p,
                soldCount: productCount.get(p.id) || 0,
            }))
            .sort((a, b) => b.soldCount - a.soldCount)
            .slice(0, limit);
    }

    async topProfitableVarieties({ limit = 10, startDate, endDate, order = "desc" }) {
        if (!startDate) {
            startDate = new Date(new Date().setDate(new Date().getDate() - 30)); // 30 días atrás
        }
        if (!endDate) {
            endDate = new Date(); // Fecha actual
        }

        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            select: {
                varietyId: true,
                quantity: true,
                variety: {
                    select: {
                        price: true,
                    },
                },
            },
        });

        const revenueMap = new Map();

        for (const item of orderItems) {
            const revenue = item.variety.price * item.quantity;
            const prev = revenueMap.get(item.varietyId) || 0;
            revenueMap.set(item.varietyId, prev + revenue);
        }

        //obtener los limit mejores (basado en el "asc" o "desc")
        const sorted = [...revenueMap.entries()]
            .sort((a, b) => order === "asc" ? a[1] - b[1] : b[1] - a[1])
            .slice(0, limit);

        const varietyIds = sorted.map(([id]) => id);

        const varieties = await prisma.variety.findMany({
            where: {
                id: { in: varietyIds },
            },
            include: {
                product: true,
            },
        });

        const varietyMap = Object.fromEntries(varieties.map(v => [v.id, v]));

        return sorted.map(([id, revenue]) => ({
            ...varietyMap[id],
            revenue,
            productName: varietyMap[id].product.name,
        }));
    }

}

export default StatsService;
