import { PrismaClient } from "@prisma/client";

class ProductService {
  constructor() {}

  async find(where) {
    return await this.prisma.product.findMany({
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
    return await this.prisma.product.findMany({
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
    return await this.prisma.product.findMany({
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
    return await this.prisma.product.findUnique({
      where: { id: id },
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
    return await this.prisma.product.create({
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
    return await this.prisma.product.update({
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
    return await this.prisma.product.delete({
      where: { id: id },
    });
  }
}

export default ProductService;
