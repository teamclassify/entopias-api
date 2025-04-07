import prisma from "../config/prisma.js";

class ProductorService {
  constructor() {}

  async countAll({ where } = {}) {
    const count = await prisma.productor.count({ where });
    return count;
  }

  async find({ page = 1, where, include } = {}) {
    const productores = await prisma.productor.findMany({
      where,
      include: {
        lotes: true, 
        ...include,
      },
      skip: (page - 1) * 10, // Paginación de 10
      take: 10,
      orderBy: {
        id: "asc",
      },
    });
    return productores;
  }

  async findOne(id, include) {
    const productor = await prisma.productor.findUnique({
      where: { id: Number(id) },
      include: {
        lotes: true, // Incluimos los lotes asociados
        ...include,
      },
    });
    return productor;
  }

  async create(data) {
    const productor = await prisma.productor.create({
      data: {
        nombre: data.nombre,
        finca: data.finca, // Opcional
        direccion: data.direccion, // Opcional
        telefono: data.telefono,
        ciudad: data.ciudad,
        pais: data.pais,
      },
    });
    return productor;
  }

  async update(id, data) {
    const productor = await prisma.productor.update({
      where: { id: Number(id) },
      data,
    });
    return productor;
  }

  async delete(id) {
    const productor = await prisma.productor.delete({
      where: { id: Number(id) },
    });
    return productor;
  }
}

export default ProductorService;