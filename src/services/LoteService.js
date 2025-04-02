import prisma from "../config/prisma.js";

class LoteService {
  constructor() {}
  async create(data) {
    return await prisma.lote.create({
      data,
      include: { cafe: true },
    });
  }

  async find(where) {
    const cafes = await prisma.cafe.findMany({
      where,
      include: { cafe: true },
    });
    return cafes;
  }

  async findAll({ page = 1, where }) {
    return await prisma.lote.findMany({
      where,

      include: { cafe: true },

      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id) {
    return await prisma.lote.findUnique({
      where: { id },
      include: { cafe: true },
    });
  }

  async update(id, data) {
    return await prisma.lote.update({
      where: { id },
      data,
      include: { cafe: true },
    });
  }

  async delete(id) {
    return await prisma.lote.delete({
      where: { id },
    });
  }
}

export default LoteService;
