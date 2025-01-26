import client from "./db.js";

async function runQuery() {
    try {
        await client.connect();

        const database = client.db("CATERING"); 
        const subscriptions = database.collection("subscriptions"); 

        const pipeline = [
            {
                $addFields: {
                    minDate: { 
                    $dateFromString: { 
                        dateString: { $min: "$daily_plans.date" }
                    }
                    },
                    maxDate: { 
                    $dateFromString: { 
                        dateString: { $max: "$daily_plans.date" }
                    }
                    },
                    currentDate: { $literal: new Date("2025-02-01T00:00:00.000Z") } // assuming today is February 1st, 2025
                }
              },
              {
                $group: {
                  _id: "$diet_type",
                  total_subscriptions: { $sum: 1 },
                  total_active_subscriptions_next_month: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $gte: [
                                {
                                    $dateAdd:
                                        {
                                            startDate: "$currentDate",
                                            unit: "month",
                                            amount: 1
                                        }
                                },
                                "$minDate"
                            ]},
                            { $lte: ["$currentDate", "$maxDate"] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  }
                }
              },
            
              {
                $project: {
                  diet_type: "$_id",
                  total_subscriptions: 1,
                  total_active_subscriptions_next_month: 1,
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