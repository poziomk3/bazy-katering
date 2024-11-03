import * as fs from "fs";
import * as readline from "readline";

const inputFilePath = "lab4/data/recipes_data.csv/recipes_data.csv";
const recipesFile = "lab4/data/recipes_data.json";
const ingredientsFile = "lab4/data/ingredients.json";

interface Recipe {
  recipe_name: string;
  ingredients: string[];
}


export const extractLinesFromBigAssDataFile = async () => {
  const readStream = fs.createReadStream(inputFilePath, { encoding: "utf-8" });
  const writeStream = fs.createWriteStream(recipesFile);
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  const results = [];
  for await (const line of rl) {
    const regex = /^(.*?),.*\[(.*?)\](?:.*)$/;
    const match = line.match(regex);

    if (match) {
      const title = match[1].trim();
      const ner = match[2]
        .trim()
        .split(",")
        .map((item) => item.replace(/[""]/g, "").trim()); // Remove quotes and trim each item

      const jsonEntry = {
        recipe_name: title,
        ingredients: ner,
      };

      results.push(jsonEntry);
      console.log(`Match found: ${JSON.stringify(jsonEntry, null, 2)}`);
    } else {
      console.log("No match found for this line.");
    }

    lineCount++;
    if (lineCount >= 5001) {
      break;
    }
  }

  writeStream.write(JSON.stringify(results, null, 2));
  writeStream.end();
  console.log("First 5000 lines extracted and saved successfully.");
};



export const extractUniqueIngredients = async () => {
    const recipes = fs.readFileSync(recipesFile, { encoding: "utf-8" });
    const writeStream = fs.createWriteStream(ingredientsFile);
    const recipesJson = JSON.parse(recipes);
    const ingredients:string[] = [];

    recipesJson.forEach((recipe: Recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!ingredients.includes(ingredient)) {
          ingredients.push(ingredient);
            

        }
      });
    });
    writeStream.write(JSON.stringify(ingredients, null, 2));
    writeStream.end();
    console.log("Unique ingredients extracted and saved successfully.");
}
