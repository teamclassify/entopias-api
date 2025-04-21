import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDatabase() {
  const producers = await prisma.producer.findMany();

  const seenNames = new Set();
  const seenEmails = new Set();
  const seenPhones = new Set();

  for (const producer of producers) {
    const name = (producer.name || "").toLowerCase();
    const email = (producer.email || "").toLowerCase();
    const phone = producer.phone || "";

    const isDuplicate =
      seenNames.has(name) || seenEmails.has(email) || seenPhones.has(phone);

    if (isDuplicate) {
      try {
        await prisma.producer.delete({
          where: { id: producer.id },
        });
        console.log(`Eliminado duplicado con ID: ${producer.id}`);
      } catch (error) {
        console.error(
          `Error al eliminar productor con ID ${producer.id}: ${error.message}`
        );
      }
    } else {
      seenNames.add(name);
      seenEmails.add(email);
      seenPhones.add(phone);
    }
  }

  console.log("Limpieza de base de datos completada.");
}

async function main() {
  // ... you will write your Prisma Client queries here
  //await cleanDatabase();
  try {
    await prisma.role.create({
      data: {
        id: 0,
        name: "admin",
      },
    });

    await prisma.role.create({
      data: {
        id: 1,
        name: "sales",
      },
    });

    await prisma.role.create({
      data: {
        id: 2,
        name: "user",
      },
    });
  } catch (err) {
    // console.log("ERROR CARGANDO EL ROL ADMIN.");
  }

  try {
    await prisma.user.create({
      data: {
        email: "byandrev@gmail.com",
        id: "KoT8x22CpCR3KZFsdMKBKNgsBQu2",
        name: "Andres",
        phone: "319889249",
        gender: "na",
      },
    });
  } catch (err) {
    // console.log("ERROR CREANDO EL USUARIO ADMIN.");
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
            id: "KoT8x22CpCR3KZFsdMKBKNgsBQu2",
          },
        },
      },
    });
  } catch {
    // console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
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
            id: "KoT8x22CpCR3KZFsdMKBKNgsBQu2",
          },
        },
      },
    });
  } catch {
    // console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
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
            id: "KoT8x22CpCR3KZFsdMKBKNgsBQu2",
          },
        },
      },
    });
  } catch {
    // console.log("ERROR ASIGNANDO LOS ROLES AL USUARIO ADMIN.");
  }

  try {
    await prisma.cart.create({
      data: {
        userId: "KoT8x22CpCR3KZFsdMKBKNgsBQu2",
      },
    });
  } catch {
    // console.log("ERROR CREANDO EL CARRITO DEL USUARIO ADMIN.");
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
