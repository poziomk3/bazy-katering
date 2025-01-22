import seedUsers from "./seeding/addUsers.js";
import seedMeals from "./seeding/addMeals.js";
import seedSubscriptions from "./seeding/addSubscriptions.js";
import { MongoClient } from "mongodb";

const uri = "mongodb://admin:password@localhost:27017";

// const uri = "mongodb://localhost:27017/";
const dbName = "CATERING";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("✅ Connected to MongoDB!");

    await seedUsers(db);
    await seedMeals(db);

    const users = await db.collection("users").find().toArray();
    const meals = await db.collection("meals").find().toArray();
    const employees = users.filter((user) => user.position);

    await seedSubscriptions(db, users, meals, employees);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await client.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  }
}

(async () => {
  await seedDatabase();
})();
