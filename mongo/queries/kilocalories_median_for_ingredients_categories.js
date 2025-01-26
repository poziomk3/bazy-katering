import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const meals = database.collection("meals"); 

        const pipeline = [
            { $unwind: "$ingredients" },
            {
                $group: {
                    _id: "$ingredients.category",
                    kilocalories: { $push: "$ingredients.kilocalories" } 
                }
            },
            {
                $addFields: {
                    sorted_kilocalories: { $sortArray: { input: "$kilocalories", sortBy: 1 } }, 
                    total_count: { $size: "$kilocalories" }
                }
            },
            {
                $addFields: {
                    middle_index: { $floor: { $divide: ["$total_count", 2] } }, 
                    second_middle_index: { $subtract: [{ $floor: { $divide: ["$total_count", 2] } }, 1] }, 
                    median_calories: {
                        $cond: {
                            if: { $eq: [{ $mod: ["$total_count", 2] }, 1] }, 
                            then: {
                                $arrayElemAt: ["$sorted_kilocalories", { $floor: { $divide: ["$total_count", 2] } }]
                            },
                            else: {
                                $avg: [
                                    {
                                        $arrayElemAt: ["$sorted_kilocalories", { $subtract: [{ $floor: { $divide: ["$total_count", 2] } }, 1] }]
                                    },
                                    {
                                        $arrayElemAt: ["$sorted_kilocalories", { $floor: { $divide: ["$total_count", 2] } }]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    ingredient_category: "$_id",
                    median_calories: { $round: ["$median_calories", 2] } 
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