import prisma from "../config/prisma.js";

class StatsService {
    constructor() { }

    //product stats

    async getSalesVarieties({ limit = 10, startDate, endDate, order = "desc"}) {
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
            _count: {
                quantity: true,
            },
            orderBy: {
                _count: {
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
                soldCount: s._count.quantity,
            };
        });
    }

    async mostProfitableVarieties({ limit = 10, startDate, endDate }) {

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

        const sorted = [...revenueMap.entries()]
            .sort((a, b) => b[1] - a[1])
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
