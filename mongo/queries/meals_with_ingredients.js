import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const meals = database.collection("meals"); 

        const pipeline = [
            {
                $project: {
                    _id: 0, 
                    meal_name: "$name", 
                    ingredients: {
                        $map: {
                            input: "$ingredients",
                            as: "ingredient",
                            in: {
                                name: "$$ingredient.name",
                                kilocalories: "$$ingredient.kilocalories",
                                fat_content: "$$ingredient.fat",
                                protein_content: "$$ingredient.protein",
                                carbohydrates_content: "$$ingredient.carbohydrates",
                                sugar_content: "$$ingredient.sugar"
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    meal_name: 1
                }
            }
        ];

        const results = await meals.aggregate(pipeline).toArray();
        console.log(JSON.stringify(results, null, 2)); 
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

runQuery();