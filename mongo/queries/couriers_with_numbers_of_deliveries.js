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
                    as: "employee"                      
                }
            },
            {
                $unwind: "$employee"
            },
            {
                $group: {
                    _id: {
                        employee_id: "$employee._id",    
                        name: "$employee.name",   
                    },
                    deliveries_count: { $sum: 1 }       
                }
            },
            {
                $project: {
                    _id: 0,
                    employee_id: "$_id.employee_id",    
                    name: "$_id.name",         
                    deliveries_count: 1                 
                }
            },
            {
                $sort: {
                    deliveries_count: -1
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