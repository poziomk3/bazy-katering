import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  insertPositions,
  insertRandomCustomersWithTheirAddresses,
} from "./addPeople";
import { extractLinesFromBigAssDataFile, extractUniqueIngredients } from "./data/dataManipulation";
import { insertAllergens, insertIngredientCategories, insertIngredients } from "./addIngredients";

async function main() {
  
  // extractLinesFromBigAssDataFile();
  // extractUniqueIngredients();

  // await insertPositions(prisma);
  // await insertRandomCustomersWithTheirAddresses(prisma, 250000);
  await insertAllergens(prisma);
  await insertIngredientCategories(prisma);
  await insertIngredients(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
function textractLines() {
  throw new Error("Function not implemented.");
}
