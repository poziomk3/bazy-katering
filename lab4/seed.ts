import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  insertPositions,
  insertRandomCustomersWithTheirAddresses,
} from "./addPeople";
import {
  extractLinesFromBigAssDataFile,
  extractUniqueIngredients,
} from "./data/dataManipulation";
import {
  insertAllergens,
  insertIngredientCategories,
  insertIngredients,
} from "./addIngredients";
import { insertDietTypes, insertMealCategories, insertMeals } from "./addMeals";
import { insertDailyPlans } from "./addDailyPlans";
import {
  insertSubscriptions,
  insertSubscriptionStates,
} from "./addSubscriptions";


async function main() {
  //helpers for handling the big ass file
  // extractLinesFromBigAssDataFile();
  // extractUniqueIngredients();
  //seeders
  // await insertPositions(prisma);
  // await insertRandomCustomersWithTheirAddresses(prisma, 200000);
  // await insertAllergens(prisma);
  // await insertIngredientCategories(prisma);
  // await insertIngredients(prisma);
  // await insertMealCategories(prisma);
  // await insertDietTypes(prisma);
  // await insertMeals(prisma);
  // await insertDailyPlans(prisma, 5000);
  // await insertSubscriptionStates(prisma);
  // await insertSubscriptions(prisma, 10000);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
