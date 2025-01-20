import seedUsers from "./seeding/addUsers.js";
import seedMeals from "./seeding/addMeals.js";
import { MongoClient } from "mongodb";

const uri = "mongodb://admin:password@localhost:27017";
const dbName = "CATERING";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("✅ Connected to MongoDB!");

    await seedUsers(db);
    await seedMeals(db);
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
