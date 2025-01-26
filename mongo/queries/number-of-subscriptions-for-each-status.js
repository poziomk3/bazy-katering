import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("subscriptions"); 

        const pipeline = [
            {
                $group: {
                    _id: "$state", 
                    subscriptions_count: { $sum: 1 } 
                }
            },
            {
                $project: {
                    _id: 0, 
                    subscription_status: "$_id", 
                    subscriptions_count: 1 
                }
            },
            {
                $sort: {
                    subscriptions_count: -1
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