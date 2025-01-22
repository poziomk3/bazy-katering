import { readFileSync } from "fs";
import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

// ✅ Load JSON Data
const allergens = JSON.parse(readFileSync("./data/allergens.json", "utf8"));
const dietTypes = JSON.parse(readFileSync("./data/diet_types.json", "utf8"));
const ingredientCategories = JSON.parse(
  readFileSync("./data/ingredient_categories.json", "utf8")
);
const recipesData = JSON.parse(
  readFileSync("./data/recipes_data.json", "utf8")
);

// 🛠 Ingredient Cache (Ensures same ingredient always has the same properties)
const ingredientCache = new Map();

// Function to generate allergens for an ingredient (if not cached)
const generateAllergens = () => {
  const numAllergens = faker.number.int({ min: 0, max: 3 });
  return Array.from({ length: numAllergens }, () => ({
    name: faker.helpers.arrayElement(allergens),
  }));
};

// Function to generate ingredient details, ensuring consistent records
const getIngredientDetails = (ingredientName) => {
  if (ingredientCache.has(ingredientName)) {
    return ingredientCache.get(ingredientName); // Return cached ingredient
  }

  // If not cached, generate new details
  const ingredientDetails = {
    name: ingredientName,
    category: faker.helpers.arrayElement(ingredientCategories),
    kilocalories: faker.number.int({ min: 50, max: 600 }),
    fat: faker.number.int({ min: 1, max: 50 }),
    protein: faker.number.int({ min: 1, max: 50 }),
    carbohydrates: faker.number.int({ min: 1, max: 100 }),
    sugar: faker.number.int({ min: 0, max: 20 }),
    salt: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
    allergens: generateAllergens(),
  };

  ingredientCache.set(ingredientName, ingredientDetails); // Store in cache
  return ingredientDetails;
};

// Function to generate structured ingredient data for a recipe
const generateIngredients = (recipeIngredients) => {
  return recipeIngredients.map(getIngredientDetails); // Ensure consistency
};

// Function to generate meals
const generateMeals = () => {
  const meals = [];

  for (const recipe of recipesData) {
    meals.push({
      _id: new ObjectId(),
      name: recipe.recipe_name,
      meal_category: faker.helpers.arrayElement([
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
      ]),
      ingredients: generateIngredients(recipe.ingredients),
      created_at: { $date: new Date().toISOString() },
      updated_at: { $date: new Date().toISOString() },
      diet_type: faker.helpers.arrayElement(dietTypes),
    });
  }

  return meals;
};

// Seed Meals into MongoDB
const seedMeals = async (db) => {
  console.log("🌱 Seeding meals...");
  await db.collection("meals").deleteMany({});
  const meals = generateMeals();
  await db.collection("meals").insertMany(meals);
  console.log(`✅ ${meals.length} meals seeded successfully!`);
};

export default seedMeals;
