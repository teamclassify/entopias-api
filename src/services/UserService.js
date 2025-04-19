import prisma from "../config/prisma.js";

class UserService {
  constructor() {}

  async countAll({ where } = {}) {
    const count = await prisma.user.count({
      where,
    });
    return count;
  }

  async find({ page = 0, where, include }) {
    const users = await prisma.user.findMany({
      where,

      include: {
        roles: true,
        ...include,
      },

      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
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
    return roleUser?.id;
  }

  async assignUserRole(userId, roleId) {
    const existingAssignment = await prisma.usersOnRoles.findFirst({
      where: { userId, roleId },
    });

    if (!existingAssignment) {
      await prisma.usersOnRoles.create({
        data: { userId, roleId },
      });
    }
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
        birthday: data.birthday,
      },
    });

    const roleId = await this.findUserRoleId(data.role);

    /*if(!roleId){
      throw new Error(`El rol ${data.role} NO existe`);
    }*/

    await this.assignUserRole(userCreated.id, roleId);

    return userCreated;
  }

  async delete(id) {
    await prisma.user.delete({
      where: { id: id },
    });

    return { deleted: true };
  }

  async update(id, data) {
    // Verificar si el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new Error("El usuario no existe.");
    }

    // Extraer el rol antes de actualizar el usuario
    const { role, ...userData } = data;

    // Actualizar los datos del usuario (sin modificar el rol)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        gender: user.gender,
        phone: userData.phone
      },
    });

    if (role) {
      // Buscar el ID del rol
      const roleId = await this.findUserRoleId(role);

      // Actualizar o asignar el rol en la tabla intermedia
      await prisma.usersOnRoles.upsert({
        where: {
          userId_roleId: {
            userId: id,
            roleId: roleId,
          },
        },
        update: {}, // Si el usuario ya tiene ese rol, no hace nada
        create: {
          userId: id,
          roleId: roleId,
          assignedAt: new Date(),
        },
      });
    } else {
      // Si no se proporciona un nuevo rol, eliminar la asignación existente
      await prisma.usersOnRoles.deleteMany({
        where: {
          userId: id,
        },
      });
    }

    return updatedUser;
  }
}

export default UserService;
