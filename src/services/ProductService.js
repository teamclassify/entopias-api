import prisma from "../config/prisma";

class ProductService {
  constructor() {}

  async find(where) {
    return await prisma.product.findMany({
      where,
      include: {
        lotes: {
          include: {
            productor: true, // Incluye los datos del productor asociado a cada lote
          },
        },
        photos: true,
        variedades: true,
      },
    });
  }

  async findAll() {
    return await prisma.product.findMany({
      include: {
        lotes: {
          include: {
            productor: true,
          },
        },
        photos: true,
        variedades: true,
      },
    });
  }

  async findOne(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        lotes: {
          include: {
            productor: true,
          },
        },
        photos: true,
        variedades: true,
      },
    });
  }

  async create(data) {
    return await prisma.product.create({
      data,
      include: {
        lotes: {
          include: {
            productor: true,
          },
        },
        photos: true,
        variedades: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data,
      include: {
        lotes: {
          include: {
            productor: true,
          },
        },
        photos: true,
        variedades: true,
      },
    });
  }

  async delete(id) {
    return await prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}

export default ProductService;
