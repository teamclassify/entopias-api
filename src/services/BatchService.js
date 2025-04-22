import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma.js";

class BatchService {
  constructor() {}

  async create(data) {
    const uid = uuidv4();
    let product = { id: data.productId };

    if (!data.productId) {
      product = await prisma.product.create({
        data: {
          name: uid,
          description: data.aromaticNotes ?? "",
          type: "",
          status: false,
        },
      });
    }

    return await prisma.batch.create({
      data: {
        productId: product.id,
        producerId: data.producerId,
        initialWeight: Number(data.initialWeight),
        finalWeight: Number(data.finalWeight),
        roastedDate: data.roastedDate,
        roastedType: data.roastedType,
        aromaticNotes: data.aromaticNotes,
        expirationDate: data.expirationDate,
        purchasePrice: data.purchasePrice ?? 0,
      }
    });
  }

  async find(where) {
    const batches = await prisma.batch.findMany({
      where,
      include: {
        product: true,
        producer: true,
      },
    });
    return batches;
  }

  async findAll({ page = 1, where } = {}) {
    return await prisma.batch.findMany({
      where,
      include: {
        product: true,
        producer: true,
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id) {
    return await prisma.batch.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        producer: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.batch.update({
      where: { id: Number(id) },
      data,
      include: {
        product: true,
        producer: true,
      },
    });
  }

  async delete(id) {
    return await prisma.batch.delete({
      where: { id: Number(id) },
    });
  }
}

export default BatchService;
