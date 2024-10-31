import * as fs from "fs";

export const insertIngredients = async (prisma: any) => {
  const ingredientsFile = "lab4/data/ingredients.json";
  const ingredientsData = readJsonFile(ingredientsFile);

  const ingredientCategories = await prisma.ingredients_categories.findMany();
  const allergens = await prisma.allergens.findMany();

  const ingredientPromises = ingredientsData.map(async (ingredient: string) => {
    const randomCategory = getRandomElement(ingredientCategories);

    try {
      const createdIngredient = await insertIngredient(
        prisma,
        ingredient,
        randomCategory
      );
      await insertAllergenConnections(prisma, createdIngredient.id, allergens);
    } catch (error) {
      console.error(
        `Error inserting ingredient '${ingredient.trim()}':`,
        error
      );
    }
  });

  await Promise.all(ingredientPromises);
  console.log(
    "Ingredients with random categories and allergens inserted successfully."
  );
};

// Function for inserting a single ingredient into the database
const insertIngredient = async (
  prisma: any,
  ingredient: string,
  category: any
) => {
  const carbohydrates = getRandomValue();
  const sugar = getRandomSugarValue(carbohydrates);
  return prisma.ingredients.create({
    data: {
      name: ingredient.trim(),
      kilocalories: getRandomValue(),
      fat: getRandomValue(),
      protein: getRandomValue(),
      carbohydrates: carbohydrates,
      sugar: sugar,
      fk_ingredient_category_id: category?.id || null,
    },
  });
};

// Function for inserting allergen connections for a given ingredient
const insertAllergenConnections = async (
  prisma: any,
  ingredientId: number,
  allergens: any[]
) => {
  const numberOfAllergens = getRandomNumberOfAllergens();
  const randomAllergens = allergens
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfAllergens);

  const allergenPromises = randomAllergens.map((allergen: any) =>
    prisma.ingredient_allergens.create({
      data: {
        fk_ingredient_id: ingredientId,
        fk_allergen_id: allergen.id,
      },
    })
  );

  await Promise.all(allergenPromises);
};

// Function for inserting ingredient categories
export const insertIngredientCategories = async (prisma: any) => {
  const ingredientCategoriesFile = "lab4/data/ingredient_categories.json";
  const ingredientCategoriesData = readJsonFile(ingredientCategoriesFile);

  await prisma.ingredients_categories.createMany({
    data: ingredientCategoriesData.map((category: string) => ({
      name: category,
    })),
    skipDuplicates: true,
  });

  console.log("Ingredient categories inserted successfully.");
};

// Function for inserting allergens
export const insertAllergens = async (prisma: any) => {
  const allergensFile = "lab4/data/allergens.json";
  const allergensData = readJsonFile(allergensFile);

  await prisma.allergens.createMany({
    data: allergensData.map((allergen: string) => ({
      name: allergen,
    })),
    skipDuplicates: true,
  });

  console.log("Allergens inserted successfully.");
};

const readJsonFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
};

const getRandomValue = () => parseFloat((Math.random() * 100).toFixed(2));
const getRandomSugarValue = (carbohydrates: number) =>
  parseFloat((Math.random() * carbohydrates).toFixed(2));
const getRandomElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomNumberOfAllergens = () => {
  const distribution = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5];
  return distribution[Math.floor(Math.random() * distribution.length)];
};
