import prisma from "../config/prisma";

class VarietyService {
  async countAll({ where } = {}) {
    const count = await await prisma.variety.count({ where });
    return count;
  }

  async findAll({ where, include } = {}) {
    return await prisma.variety.findMany({
      where,
      include: {
        product: true,
        ...include,
      },
    });
  }

  async findOne(id, include) {
    return await prisma.variety.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        ...include,
      },
    });
  }

  async create(data) {
    return await prisma.variety.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.variety.update({
      where: { id: Number(id) },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id) {
    return await prisma.variety.delete({
      where: { id: Number(id) },
    });
  }
}

export default VarietyService;
