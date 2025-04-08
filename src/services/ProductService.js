import prisma from "../config/prisma.js";
import { uploadFile } from "../config/supabase.js";
import { generateUUID } from "../utils/generateUUID.js";

class ProductService {
  constructor() {}

  async countAll({ where }) {
    return await prisma.product.count({
      where,
    });
  }

  async find({ where }) {
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

  async findAll({ page, where }) {
    return await prisma.product.findMany({
      where,

      include: {
        photos: true,

        varieties: true,
        batches: {
          include: {
            producer: true
          }
        }
      },

      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        photos: true,
        varieties: true,
        batches: {
          include: {
            producer: true
          }
        }
      },
    });
  }

  async create(data) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.descripcion,

        photos: {
          create: data.photos.map((photo) => ({
            url: photo.url,
            name: photo.name,
          })),
        },

        batches: {
          connect: {
            id: Number(data.loteId),
          },
        },
      },

      include: {
        batches: {
          include: {
            producer: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },

      data: {
        name: data.name,
        description: data.decripcion,
        status: data.status,
      },

      include: {
        batches: {
          include: {
            producer: true,
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

  async uploadPhotos(photos) {
    const files = await Promise.all(
      photos.map(async (photo) => {
        const file = await uploadFile(
          "products",
          photo,
          `${generateUUID()}.${photo.originalname}`
        );
        return file;
      })
    );

    return files;
  }
}

export default ProductService;
