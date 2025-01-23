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
                $match: {
                    state: "active" 
                }
            },
            {
                $unwind: "$daily_plans"
            },
            {
                $group: {
                    _id: {
                        subscription_id: "$_id",
                        client_name: "$user.name",
                        client_email: "$user.email",
                        subscription_state: "$state"
                    },
                    last_delivery_date: { $max: "$daily_plans.date" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    subscription_id: "$_id.subscription_id",  
                    client_name: "$_id.client_name",          
                    client_email: "$_id.client_email",        
                    subscription_state: "$_id.subscription_state", 
                    last_delivery_date: 1                    
                }
            }
        ];

        const results = await subscriptions.aggregate(pipeline).toArray();
        console.log(results);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

runQuery();