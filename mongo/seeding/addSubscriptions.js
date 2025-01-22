import { faker } from "@faker-js/faker";
import { ObjectId } from "bson";

const dietTypes = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Flexitarian",
  "Ketogenic",
  "Paleo",
  "Mediterranean",
  "Low-Carb",
  "High-Protein",
  "DASH (Dietary Approaches to Stop Hypertension)",
  "Gluten-Free",
  "Lactose-Free",
  "Raw Food",
];

const generateSubscriptions = (users, meals, employees) => {
  const subscriptions = [];

  for (let i = 0; i < 20000; i++) {
    const customer = faker.helpers.arrayElement(
      users.filter((user) => !user.position)
    );
    const employee = faker.helpers.arrayElement(employees);
    const dietType = faker.helpers.arrayElement(dietTypes);

    const dailyPlans = Array.from({
      length: faker.number.int({ min: 5, max: 30 }),
    }).map(() => {
      const deliveriesCount = faker.number.int({ min: 1, max: 3 });
      const deliveries = Array.from({ length: deliveriesCount }).map(() => {
        const delivery = {
          employee_id: new ObjectId(employee._id),
          address: {
            flat_number: faker.number.int({ min: 1, max: 50 }),
            building_number: faker.helpers.arrayElement([
              "10",
              "15a",
              "32b",
              "48a",
            ]),
            city: faker.location.city(),
            post_code: faker.location.zipCode(),
            street: faker.location.street(),
          },
        };

        if (faker.datatype.boolean()) {
          delivery.mealCategory = faker.helpers.arrayElement([
            "Breakfast",
            "Lunch",
            "Dinner",
          ]);
        }

        return delivery;
      });

      return {
        date: faker.date.future().toISOString(),
        deliveries: deliveries,
        meals: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
          () => ({
            meal_id: new ObjectId(faker.helpers.arrayElement(meals)._id),
          })
        ),
      };
    });

    subscriptions.push({
      _id: new ObjectId(),
      customer: {
        customer_id: new ObjectId(customer._id),
        customer_name: customer.name,
      },
      diet_type: dietType,
      daily_plans: dailyPlans,
      state: faker.helpers.arrayElement(["active", "inactive", "paused"]),
    });
  }

  return subscriptions;
};

const seedSubscriptions = async (db, users, meals, employees) => {
  console.log("🌱 Seeding subscriptions...");
  await db.collection("subscriptions").deleteMany({});

  const subscriptions = generateSubscriptions(users, meals, employees);
  await db.collection("subscriptions").insertMany(subscriptions);

  console.log(`✅ ${subscriptions.length} subscriptions seeded successfully!`);
};

export default seedSubscriptions;
