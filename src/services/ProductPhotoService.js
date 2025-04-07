import prisma from "../config/prisma";

class ProductPhotoService {
  async findAll({ where, include } = {}) {
    return await prisma.productPhoto.findMany({
      where,
      include: {
        product: true,
        ...include,
      },
    });
  }

  async findOne(id, include) {
    return await prisma.productPhoto.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        ...include,
      },
    });
  }

  async create(data) {
    return await prisma.productPhoto.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.productPhoto.update({
      where: { id: Number(id) },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id) {
    return await prisma.productPhoto.delete({
      where: { id: Number(id) },
    });
  }
}

export default ProductPhotoService;
