import prisma from "../config/prisma.js";

class ProducerService {
  constructor() {}

  #normalizeName(name) {
    return name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  #normalizeEmail(email) {
    return email.trim().toLowerCase();
  }

  async #checkDuplicates({ name, email, phone }, excludeId = null) {
    const normalizedName = this.#normalizeName(name);
    const normalizedEmail = this.#normalizeEmail(email);

    const whereClause = {
      OR: [
        { name: normalizedName },
        { email: normalizedEmail },
        { phone },
      ],
    };

    if (excludeId !== null) {
      whereClause.NOT = { id: Number(excludeId) };
    }

    const existing = await prisma.producer.findFirst({ where: whereClause });

    if (existing) {
      const reasons = [];
      if (existing.name === normalizedName) reasons.push("name");
      if (existing.email === normalizedEmail) reasons.push("email");
      if (existing.phone === phone) reasons.push("phone");

      throw new Error(`A producer with this ${reasons.join(", ")} already exists.`);
    }

    return { normalizedName, normalizedEmail };
  }

  async countAll({ where } = {}) {
    const count = await prisma.producer.count({ where });
    return count;
  }

  async find({ page = 1, where, include } = {}) {
    const producers = await prisma.producer.findMany({
      where,
      include: {
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
        ...include,
      },
    });
    return producer;
  }

  async create(data) {
    const { normalizedName, normalizedEmail } = await this.#checkDuplicates(data);
    const producer = await prisma.producer.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
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
