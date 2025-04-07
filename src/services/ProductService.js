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

  async find({ where } = {}) {
    return await prisma.product.findMany({
      where,
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

  async findAll({ page = 1, where } = {}) {
    return await prisma.product.findMany({
      where,
      include: {
        lotes: {
          include: {
            productor: true,
          },
        },
        photos: true,
        variedades: true,
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
    console.log(data);

    return await prisma.product.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: data.tipo,
        photos: {
          create: data.photos.map((photo) => ({
            url: photo.url,
            name: photo.name,
          })),
        },
      },
      include: {
        lotes: {
          include: {
            productor:true,
          },
        },
        photos:true,
        variedades:true,
      },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: data.tipo,
      },
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
