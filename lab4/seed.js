import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {
const dietTypes =await prisma.diet_types.createMany({
    
    data: [
      { name: 'Vegetarian' },
      { name: 'Vegan' },
      { name: 'Keto' },
    ],
  });
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