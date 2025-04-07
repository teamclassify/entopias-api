import prisma from "../config/prisma.js";

class LoteService {
  constructor() {}
  async create(data) {
    return await prisma.lote.create({
      data,
      include: {
        products: true,
        productor: true,
      },
    });
  }

  async find(where) {
    const lotes = await prisma.lote.findMany({
      where,
      include: {
        product: true,
        productor: true,
      },
    });
    return lotes;
  }

  async findAll() {
    return await prisma.lote.findMany({
      include: { 
        product: true, 
        productor: true,
      },
    });
  }

  async findOne(id) {
    return await prisma.lote.findUnique({
      where: { id },
      include: { 
        product: true, 
        productor: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.lote.update({
      where: { id },
      data,
      include: { 
        product: true, 
        productor: true,
      },
    });
  }

  async delete(id) {
    return await prisma.lote.delete({
      where: { id },
    });
  }
}

export default LoteService;
