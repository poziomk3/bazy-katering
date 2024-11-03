import * as fs from "fs";

interface Recipe {
  recipe_name: string;
  ingredients: string[];
}

export const insertMeals = async (prisma: any) => {
  const mealsFile = "lab4/data/recipes_data.json";
  const mealsFileData: Recipe[] = readJsonFile(mealsFile);

  for (const recipe of mealsFileData) {
    const meal = await prisma.meals.create({
      data: {
        name: recipe.recipe_name.trim(),
        fk_meal_category_id: Math.floor(Math.random() * 9) + 1,
        fk_diet_type_id: Math.floor(Math.random() * 10) + 1,
      },
    });

    await insertMealConnections(prisma, meal.id, recipe.ingredients);
  }

  console.log("Meals and meal_ingredients inserted successfully.");
};

export const insertMeal = async (
  prisma: any,
  meal: string,
  category: any,
  dietType: any
) => {
  return prisma.meals.create({
    data: {
      name: meal.trim(),
      fk_meal_category_id: category?.id || null,
      fk_diet_type_id: dietType?.id || null,
    },
  });
};

const insertMealConnections = async (
  prisma: any,
  mealId: number,
  ingredients: string[]
) => {
  const ingredientIds = await Promise.all(
    ingredients.map(async (ingredientName) => {
      const ingredient = await prisma.ingredients.findFirst({
        where: {
          name: ingredientName,
        },
      });
      return ingredient ? ingredient.id : null;
    })
  );

  const validIngredientIds = ingredientIds.filter((id) => id !== null);

  const connectionPromises = validIngredientIds.map((ingredientId) => {
    return prisma.meal_ingredients.create({
      data: {
        fk_meal_id: mealId,
        fk_ingredient_id: ingredientId,
      },
    });
  });

  await Promise.all(connectionPromises);
};

export const insertMealCategories = async (prisma: any) => {
  const mealCategoriesFile = "lab4/data/meal_categories.json";
  const mealCategoriesData = readJsonFile(mealCategoriesFile);

  await prisma.meal_categories.createMany({
    data: mealCategoriesData.map((category: string) => ({
      name: category,
    })),
    skipDuplicates: true,
  });

  console.log("Meal categories inserted successfully.");
};

export const insertDietTypes = async (prisma: any) => {
  const dietTypesFile = "lab4/data/diet_types.json";
  const dietTypesData = readJsonFile(dietTypesFile);

  await prisma.diet_types.createMany({
    data: dietTypesData.map((category: string) => ({
      name: category,
    })),
    skipDuplicates: true,
  });

  console.log("Diet types inserted successfully.");
};

const readJsonFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
};
