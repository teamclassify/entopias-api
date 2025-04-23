import prisma from "../config/prisma.js";

class AddressService {
  constructor() {}

  #normalizeText(text) {
    return text.trim().toLowerCase();
  }

  #normalizePostal(code) {
    return code.trim();
  }

  //Verificar que el usuario no repita la misma direccion
  async #checkDuplicates(
    { city, country, postalCode, address },
    userId,
    excludeId = null
  ) {
    const normalizedCity = this.#normalizeText(city);
    const normalizedCountry = this.#normalizeText(country);
    const normalizedPostal = this.#normalizePostal(postalCode);
    const normalizedAddress = this.#normalizeText(address);
    const where = {
      userId,
      city: normalizedCity,
      country: normalizedCountry,
      postalCode: normalizedPostal,
      address: normalizedAddress,
    };
    if (excludeId !== null) {
      where.NOT = { id: Number(excludeId) };
    }

    const existing = await prisma.address.findFirst({ where });
    if (existing) {
      throw new Error("You already have this address registered.");
    }

    return {
      normalizedCity,
      normalizedCountry,
      normalizedPostal,
      normalizedAddress,
    };
  }

  async findAllByUser(userId) {
    return prisma.address.findMany({
      where: { userId },
    });
  }

  async findOne(id, userId) {
    return prisma.address.findFirst({
      where: { id: Number(id), userId },
    });
  }

  async create(userId, data) {
    console.log(data);
    const {
      normalizedCity,
      normalizedCountry,
      normalizedPostal,
      normalizedAddress,
    } = await this.#checkDuplicates(data, userId);

    return prisma.address.create({
      data: {
        userId,
        city: normalizedCity,
        country: normalizedCountry,
        postalCode: normalizedPostal,
        address: normalizedAddress,
      },
    });
  }

  async update(id, userId, data) {
    let normalizedData = {};
    if (data.city || data.country || data.postalCode || data.address) {
      normalizedData = await this.#checkDuplicates(data, userId, id);
    }

    return prisma.address.updateMany({
      where: { id: Number(id), userId },
      data: {
        city: normalizedData.normalizedCity,
        country: normalizedData.normalizedCountry,
        postalCode: normalizedData.normalizedPostal,
        address: normalizedData.normalizedAddress,
      },
    });
  }

  async delete(id, userId) {
    return prisma.address.deleteMany({
      where: { id: Number(id), userId },
    });
  }
}

export default AddressService;
