import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("subscriptions"); 

        const pipeline = [
            {
                $lookup: {
                    from: "users",                  
                    localField: "customer.customer_id", 
                    foreignField: "_id",            
                    as: "user"                      
                }
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    minDate: { $dateFromString: { 
                        dateString: { $min: "$daily_plans.date" }
                    }}, 
                    maxDate: { $dateFromString: { 
                        dateString: { $max: "$daily_plans.date" }
                    }},
                    currentDate: { $literal: new Date("2025-02-01T00:00:00.000Z") } // assuming today is February 1st, 2025
                }
            },
            {
                $match: {
                    state: "active",
                    $expr: {
                        $and: [
                          { $gte: ["$currentDate", "$minDate"] },
                          { $lte: ["$currentDate", "$maxDate"] }
                        ]
                    }
                }
            },
            {
                $project: {
                    date: "$currentDate",
                    subscription_state: "$state",
                    customer: "$user.name"
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