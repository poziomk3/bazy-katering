import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("subscriptions"); 

        const pipeline = [
            {
                $match: {
                    "state": "canceled"
                }
            },
            {
                $group: {
                    _id: "$customer.customer_id",
                    customer_name: { $first: "$customer.customer_name" },
                    canceled_count: { $sum: 1 }
                }
            },
            {
                $sort: { canceled_count: -1 }
            },
            {
                $project: {
                    customer_id: "$_id",
                    customer_name: 1,
                    canceled_count: 1,
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