import prisma from "../config/prisma.js";

class StatsService {
    constructor() { }

    //product stats

    async mostSoldVariety({ limit = 10, startDate, endDate }) {

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
                    quantity: 'desc',
                },
            },
            take: limit,
        });

        const varieties = await prisma.variety.findMany({
            where: {
                id: { in: sales.map(s => s.varietyId) },
            },
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

    

}

export default StatsService;
