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
                $addFields: {
                    delivery_day: {
                        $dateTrunc: {
                            date: {
                                $dateFromString: {
                                    dateString: "$daily_plans.date" 
                                }
                            },
                            unit: "day"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$delivery_day",        
                    delivery_count: { $sum: 1 }  
                }
            },
            {
                $addFields: {
                    delivery_month: {
                        $dateTrunc: {
                            date: "$_id", 
                            unit: "month"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$delivery_month",       
                    average_deliveries_per_day: {
                        $avg: "$delivery_count"   
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    delivery_month: {
                        $dateToString: {          
                            format: "%B %Y",     
                            date: "$_id"
                        }
                    },
                    average_deliveries_per_day: {
                        $round: ["$average_deliveries_per_day", 2] 
                    }
                }
            },
            {
                $sort: {
                    _id: 1 
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