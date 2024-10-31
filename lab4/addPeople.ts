import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
export const createRandomUser = () => {
  return {
    name: faker.person.lastName(),
    surname: faker.person.firstName(),
    password: uuid(),
  };
};

export const createRandomAddress = () => {
  return {
    street: faker.location.street(),
    city: faker.location.city(),
    postcode: faker.location.zipCode(),
    country:"Poland",
    // country: faker.location.country(),
    building_number: parseInt(faker.location.buildingNumber(), 10),
    flat_number:
      Math.random() < 0.5 ? Math.floor(Math.random() * 100) + 1 : null,
  };
};

export const insertPositions = async (prisma: any) => {
  await prisma.positions.createMany({
    data: [
      { name: "Admin" },
      { name: "Courier" },
      { name: "Chef" },
      { name: "Manager" },
    ],
  });
};

export const insertRandomCustomersWithTheirAddresses = async (
  prisma: any,
  number: number
) => {
  const emails = faker.helpers.uniqueArray(faker.internet.email, number);
  const positions = await prisma.positions.findMany();
  const positionsIds = positions.map((position: any) => position.id);

  const batchSize = 1000; // Adjust this number based on memory limits
  const createPromises = [];

  for (let i = 0; i < number; i++) {
    const randomUser = createRandomUser();
    const randomAddress = createRandomAddress();

    createPromises.push(
      prisma.users.create({
        data:
          Math.random() > 0.005
            ? {
                email: emails[i], // Assign unique email
                ...randomUser, // Spread user data
                customers: {
                  create: {
                    addresses: {
                      create: randomAddress,
                    },
                  },
                },
              }
            : {
                email: emails[i], // Assign unique email
                ...randomUser, // Spread user data
                employees: {
                  create: {
                    fk_position_id:
                      positionsIds[
                        Math.floor(Math.random() * positionsIds.length)
                      ],
                  },
                },
              },
      })
    );

    if (createPromises.length >= batchSize) {
      await Promise.all(createPromises);
      createPromises.length = 0; // Clear the array for the next batch
    }
  }

  // Run any remaining promises
  if (createPromises.length > 0) {
    await Promise.all(createPromises);
  }
};
