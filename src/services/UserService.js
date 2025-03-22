import prisma from "../config/prisma.js";

class UserService {
  constructor() {}

  async find(where, include) {
    const users = await prisma.user.findMany({
      where,

      include: {
        roles: true,
        ...include,
      },
    });

    return users;
  }

  async findOne(id, include) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },

      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async findUserRoleId(role) {
    const roleUser = await prisma.role.findFirst({
      where: {
        name: role,
      },
    });
    return roleUser.id;
  }

  async assignUserRole(userId, roleId) {
    await prisma.usersOnRoles.create({
      data: {
        role: {
          connect: {
            id: roleId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async create(data) {
    const userCreated = await prisma.user.create({
      data: {
        name: data.name,
        photo: data.photo,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        id: data.id,
      },
    });

    const roleId = await this.findUserRoleId(data.role);

    await this.assignUserRole(userCreated.id, roleId);

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
