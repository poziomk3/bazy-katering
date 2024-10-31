import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  insertPositions,
  insertRandomCustomersWithTheirAddresses,
} from "./addPeople";

async function main() {
  await insertPositions(prisma);
  await insertRandomCustomersWithTheirAddresses(prisma, 100000);

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
