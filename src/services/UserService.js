import prisma from "../config/prisma.js";

class UserService {
  constructor() {}

  async find(where) {
    const users = await prisma.user.findMany({
      where,
    });

    return users;
  }

  async findOne(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  async create(data) {
    const userCreated = await prisma.user.create({
      data,
    });

    return userCreated;
  }

  async delete(id) {
    const userDeleted = await prisma.user.delete({
      where: id,
    });

    return { deleted: true };
  }

  async update(id, data) {
    const userUpdated = await prisma.user.update({
      where: {
        id: id,
      },
      data,
    });
    return userUpdated;
  }
}

export default UserService;
