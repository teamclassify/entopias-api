import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here

  try {
    await prisma.user.create({
      data: {
        email: "byandrev@gmail.com",
        id: "VVLnneZUiaczCUvyFluc01B70r12",
        name: "Andres",
        phone: "319889249",
        gender: "na",
      },
    });
  } catch (err) {
    console.log("ERROR CREANDO EL USUARIO ADMIN.");
  }

  try {
    await prisma.usersOnRoles.create({
      data: {
        role: {
          connect: {
            id: 0,
          },
        },
        user: {
          connect: {
            id: "VVLnneZUiaczCUvyFluc01B70r12",
          },
        },
      },
    });
  } catch {
    console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
  }

  try {
    await prisma.usersOnRoles.create({
      data: {
        role: {
          connect: {
            id: 1,
          },
        },
        user: {
          connect: {
            id: "VVLnneZUiaczCUvyFluc01B70r12",
          },
        },
      },
    });
  } catch {
    console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
  }

  try {
    await prisma.usersOnRoles.create({
      data: {
        role: {
          connect: {
            id: "3",
          },
        },
        user: {
          connect: {
            id: "VVLnneZUiaczCUvyFluc01B70r12",
          },
        },
      },
    });
  } catch {
    console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default prisma;
