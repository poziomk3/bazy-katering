import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const meals = database.collection("meals"); 

        const pipeline = [
            {
                $unwind: "$ingredients"
            },
            {
                $unwind: "$ingredients.allergens"
            },
            {
                $match: {
                    "ingredients.allergens.name": { $in: ["Peanuts", "Tree nuts", "Coconut"] }
                }
            },
            {
                $group: {
                    _id: {
                        meal_id: "$_id", 
                        meal_name: "$name", 
                        meal_category: "$meal_category" 
                    },
                    allergens: { $addToSet: "$ingredients.allergens.name" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    meal_id: "$_id.meal_id", 
                    meal_name: "$_id.meal_name", 
                    meal_category: "$_id.meal_category", 
                    allergens: 1 
                }
            },
            {
                $sort: {
                    meal_name: 1
                }
            }
        ]

        const results = await meals.aggregate(pipeline).toArray();
        console.log(results);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

runQuery();