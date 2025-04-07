import prisma from "../config/prisma";

class VariedadService {
  async countAll({ where } = {}) {
    const count = await prisma.variedad.count({ where });
    return count;
  }

  async findAll({ where, include } = {}) {
    return await prisma.variedad.findMany({
      where,
      include: {
        product: true,
        ...include,
      },
    });
  }

  async findOne(id, include) {
    return await prisma.variedad.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        ...include,
      },
    });
  }

  async create(data) {
    return await prisma.variedad.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.variedad.update({
      where: { id: Number(id) },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id) {
    return await prisma.variedad.delete({
      where: { id: Number(id) },
    });
  }
}

export default VariedadService;
