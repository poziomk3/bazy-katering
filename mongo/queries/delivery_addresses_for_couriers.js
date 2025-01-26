import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("subscriptions"); 

        const pipeline = [
            {
                $unwind: "$daily_plans"
              },
              {
                $unwind: "$daily_plans.deliveries"
              },
              {
                $lookup: {
                  from: "users",
                  localField: "daily_plans.deliveries.employee_id",
                  foreignField: "_id",
                  as: "employee_info"
                }
              },
              {
                $project: {
                  date: "$daily_plans.date",
                  address: "$daily_plans.deliveries.address",
                  employee_name: { $arrayElemAt: ["$employee_info.name", 0] },
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