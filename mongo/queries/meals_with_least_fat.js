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
                  _id: "$name",
                  total_fat: { $sum: "$ingredients.fat" }
                }
              },
              {
                $sort: { total_fat: 1 }
              },
              {
                $project: {
                  meal_name: "$_id",
                  total_fat: 1,
                  _id: 0
                }
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