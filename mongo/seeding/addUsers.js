import { ObjectId } from "bson";
import { faker } from "@faker-js/faker";

const positions = ["Admin", "Courier", "Chef", "Manager"];

const generateUsers = (totalUsers, employeeRatio, onUserCreated = () => {}) => {
  const employeeCount = Math.floor(totalUsers * employeeRatio);
  const customerCount = totalUsers - employeeCount;

  const users = [];

  for (let i = 0; i < employeeCount; i++) {
    const user = {
      _id: new ObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      created_at: { $date: new Date().toISOString() },
      updated_at: { $date: new Date().toISOString() },
      position: faker.helpers.arrayElement(positions),
    };

    onUserCreated(user);
    users.push(user);
  }

  for (let i = 0; i < customerCount; i++) {
    const user = {
      _id: new ObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      created_at: { $date: new Date().toISOString() },
      updated_at: { $date: new Date().toISOString() },
    };

    onUserCreated(user);
    users.push(user);
  }

  users.sort(() => Math.random() - 0.5);
  return users;
};

const seedUsers = async (db) => {
  console.log("🌱 Seeding users...");
  await db.collection("users").deleteMany({});
  const users = generateUsers(100, 0.1, (user) =>
    console.log(
      "Here you can add function that creates record for given user (customer or employee)",
      JSON.stringify(user),
      "\n"
    )
  );
  await db.collection("users").insertMany(users);
  console.log("✅ Users seeding completed!");
};
export default seedUsers;
