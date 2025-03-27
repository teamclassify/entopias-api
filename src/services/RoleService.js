import prisma from "../config/prisma.js"

class RoleService{

 constructor(){}

 async find(where,include){
    const roles = await prisma.role.findMany({
        where,
        include:{
            users:{include:{user:true}},
            ...include,
        },
    });
    
    return roles;
 }

 async findOne(id,include){
    const role = await prisma.role.findUnique({
        where:{id},
        include:{
            users:{include: {user: true}},
            ...include,
        },
    });
    return role;
 }

 async create(data) {
    return await prisma.role.create({
      data: {
        name: data.name,
      },
    });
  }

  async delete(id) {
    await prisma.role.delete({
      where: { id },
    });
    return { deleted: true };
  }

  async update(id, data) {
    return await prisma.role.update({
      where: { id },
      data,
    });
  }

}

export default RoleService;