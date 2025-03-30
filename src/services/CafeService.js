import prisma from "../config/prisma.js";

class CafeService {
    constructor() { }
    async create(data) {
        return await prisma.cafe.create({ data });
    }

    async find(where) {
        const cafes = await prisma.cafe.findMany({ where });
        return cafes;
    }

    async findAll() {
        return await prisma.cafe.findMany();
    }

    async findOne(id) {
        return await prisma.cafe.findUnique({
            where: { id: id },
        });
    }

    async update(id, data) {
        return await prisma.cafe.update({
            where: { id: id },
            data,
        });
    }

    async delete(id) {
        const cafeDeleted = prisma.cafe.delete({
            where: { id: id },
        });
        return { deleted: true };
    }
}

export default CafeService;
