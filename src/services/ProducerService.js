import prisma from "../config/prisma.js";

class ProducerService {
  constructor() {}

  async countAll({ where } = {}) {
    const count = await prisma.producer.count({ where });
    return count;
  }

  async find({ page = 1, where, include } = {}) {
    const producers = await prisma.producer.findMany({
      where,
      include: {
        batches: true, 
        ...include,
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        id: "asc",
      },
    });
    return producers;
  }

  async findOne(id, include) {
    const producer = await prisma.producer.findUnique({
      where: { id: Number(id) },
      include: {
        batches: true,
        ...include,
      },
    });
    return producer;
  }

  async create(data) {
    const producer = await prisma.producer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        state: data.state,
        farm: data.farm,
      },
    });
    return producer;
  }

  async update(id, data) {
    const producer = await prisma.producer.update({
      where: { id: Number(id) },
      data,
    });
    return producer;
  }

  async delete(id) {
    const producer = await prisma.producer.delete({
      where: { id: Number(id) },
    });
    return producer;
  }
}

export default ProducerService;