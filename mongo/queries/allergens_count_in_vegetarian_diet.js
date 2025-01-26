import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("meals"); 

        const pipeline = [
            { 
                $match: { "diet_type": "DASH" }
              },
              { 
                $unwind: "$ingredients"
              },
              { 
                $unwind: "$ingredients.allergens"
              },
              {
                $group: {
                  _id: "$ingredients.allergens.name",
                  allergen_count: { $sum: 1 }
                }
              },
              {
                $sort: { allergen_count: -1 }
              },
              {
                $project: {
                  allergen_name: "$_id",
                  allergen_count: 1,
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