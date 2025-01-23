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
                $group: {
                    _id: "$ingredients.category", 
                    ingredients: {
                        $push: {
                            name: "$ingredients.name", 
                            kilocalories: "$ingredients.kilocalories" 
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category_name: "$_id", 
                    sorted_low: {
                        $slice: [
                            { $sortArray: { input: "$ingredients", sortBy: { kilocalories: 1 } } }, 
                            5
                        ]
                    },
                    sorted_high: {
                        $slice: [
                            { $sortArray: { input: "$ingredients", sortBy: { kilocalories: -1 } } }, 
                            5
                        ]
                    }
                }
            },
            {
                $project: {
                    category_name: 1,
                    ranked_ingredients: {
                        $concatArrays: [
                            {
                                $map: {
                                    input: "$sorted_low",
                                    as: "low",
                                    in: {
                                        ingredient_name: "$$low.name",
                                        kilocalories: "$$low.kilocalories",
                                        rank_type: "Lowest"
                                    }
                                }
                            },
                            {
                                $map: {
                                    input: "$sorted_high",
                                    as: "high",
                                    in: {
                                        ingredient_name: "$$high.name",
                                        kilocalories: "$$high.kilocalories",
                                        rank_type: "Highest"
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $unwind: "$ranked_ingredients"
            },
            {
                $project: {
                    category_name: 1,
                    ingredient_name: "$ranked_ingredients.ingredient_name",
                    kilocalories: { $round: ["$ranked_ingredients.kilocalories", 2] },
                    rank_type: "$ranked_ingredients.rank_type"
                }
            },
            {
                $sort: {
                    category_name: 1, 
                    rank_type: 1, 
                    kilocalories: 1 
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