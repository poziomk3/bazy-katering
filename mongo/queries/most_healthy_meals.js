import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("meals"); 

        const pipeline = [
              { 
                $unwind: "$ingredients"
              },
              {
                $group: {
                  _id: "$_id",
                  meal_name: { $first: "$name" },
                  total_fat: { $sum: "$ingredients.fat" },
                  total_sugar: { $sum: "$ingredients.sugar" },
                  total_protein: { $sum: "$ingredients.protein" },
                  total_carbohydrates: { $sum: "$ingredients.carbohydrates" },
                  total_protein_squared: { $sum: { $multiply: ["$ingredients.protein", "$ingredients.protein"] } },
                  fat_sugar_carbs: { $sum: { $add: ["$ingredients.fat", "$ingredients.sugar", "$ingredients.carbohydrates"] } }
                }
              },
              {
                $project: {
                  meal_id: "$_id",
                  meal_name: 1,
                  healthiness_score: {
                    $cond: [
                      { $eq: ["$fat_sugar_carbs", 0] }, 0,
                      { $round: [{ $divide: ["$total_protein_squared", "$fat_sugar_carbs"] }, 2] }
                    ]
                  },
                  total_fat: { $round: ["$total_fat", 2] },
                  total_sugar: { $round: ["$total_sugar", 2] },
                  total_protein: { $round: ["$total_protein", 2] },
                  total_carbohydrates: { $round: ["$total_carbohydrates", 2] }
                }
              },
              {
                $sort: { healthiness_score: -1 }
              }
        ]


        const results = await subscriptions.aggregate(pipeline).toArray();
        console.log(results);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

runQuery();