import { faker } from "@faker-js/faker";

export const insertDailyPlans = async (prisma: any, numberOfPlans: number) => {
  const mealIds = (await prisma.meals.findMany({ select: { id: true } })).map(
    (meal: { id: number }) => meal.id
  );

  for (let i = 0; i < numberOfPlans; i++) {
    const dailyPlan = await prisma.daily_plans.create({
      data: {
        date: faker.date.between({
          from: new Date(),
          to: new Date("2026-01-01"),
        }),
      },
    });

    const numberOfMeals = Math.floor(Math.random() * 3) + 3;

    await Promise.all(
      Array.from({ length: numberOfMeals }).map(async () => {
        const randomMealId =
          mealIds[Math.floor(Math.random() * mealIds.length)];
        await prisma.daily_plan_meals.create({
          data: {
            fk_daily_plan_id: dailyPlan.id,
            fk_meal_id: randomMealId,
          },
        });
      })
    );
  }

  console.log("Daily Plans and associated random meals inserted successfully.");
};
