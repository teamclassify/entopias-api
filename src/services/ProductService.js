import prisma from "../config/prisma.js";

class ProductService {
  constructor() {}

  async find(where) {
    return await prisma.product.findMany({
      where,
      include: {
        lote: {
          include: {
            cafe: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await prisma.product.findMany({
      include: {
        lote: {
          include: {
            cafe: true,
          },
        },
      },
    });
  }

  async findOne(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        lote: {
          include: {
            cafe: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.product.create({
      data,
      include: {
        lote: {
          include: {
            cafe: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id: id },
      data,
      include: {
        lote: {
          include: {
            cafe: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.product.delete({
      where: { id: id },
    });
  }
}

export default ProductService;
