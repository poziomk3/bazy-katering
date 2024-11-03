import { faker } from "@faker-js/faker";

// export const test = async (prisma: any) => {
//   const courierIds = (
//     await prisma.employees.findMany({
//       where: { fk_position_id: 2 },
//       select: { fk_user_id: true },
//     })
//   ).map((employee: { fk_user_id: number }) => employee.fk_user_id);
//   console.log(courierIds);
// };

export const insertSubscriptions = async (
  prisma: any,
  numberOfSubscriptions: number
) => {
  const dailyPlanIds = (
    await prisma.daily_plans.findMany({ select: { id: true } })
  ).map((dailyPlan: { id: number }) => dailyPlan.id);

  const customerIds = (
    await prisma.customers.findMany({ select: { id: true } })
  ).map((customer: { id: number }) => customer.id);

  const courierIds = (
    await prisma.employees.findMany({
      where: { fk_position_id: 2 },
      select: { fk_user_id: true },
    })
  ).map((employee: { fk_user_id: number }) => employee.fk_user_id);

  const dietTypesIds = (
    await prisma.diet_types.findMany({ select: { id: true } })
  ).map((dietType: { id: number }) => dietType.id);

  const subscriptionStatesIds = (
    await prisma.subscription_states.findMany({ select: { id: true } })
  ).map((subscriptionState: { id: number }) => subscriptionState.id);

  for (let i = 0; i < numberOfSubscriptions; i++) {
    const randomCustomerId =
      customerIds[Math.floor(Math.random() * customerIds.length)];
    const randomDietTypeId =
      dietTypesIds[Math.floor(Math.random() * dietTypesIds.length)];
    const randomSubscriptionStateId =
      subscriptionStatesIds[
        Math.floor(Math.random() * subscriptionStatesIds.length)
      ];
    const numberOfDailyPlansOptions = [7, 14, 21, 30];

    const subscription = await prisma.subscriptions.create({
      data: {
        fk_customer_id: randomCustomerId,
        fk_diet_type_id: randomDietTypeId,
        fk_status_id: randomSubscriptionStateId,
      },
    });

    const numberOfDailyPlans =
      numberOfDailyPlansOptions[
        Math.floor(Math.random() * numberOfDailyPlansOptions.length)
      ];

    await Promise.all(
      Array.from({ length: numberOfDailyPlans }).map(async () => {
        const randomDailyPlanId =
          dailyPlanIds[Math.floor(Math.random() * dailyPlanIds.length)];
        await prisma.subscription_daily_plans.create({
          data: {
            fk_subscription_id: subscription.id,
            fk_daily_plan_id: randomDailyPlanId,
          },
        });
      })
    );
    const randomCourierId =
      courierIds[Math.floor(Math.random() * courierIds.length)];

    await prisma.deliveries.create({
      data: {
        date: faker.date.between({
          from: new Date(),
          to: new Date("2026-01-01"),
        }),
        fk_subscription_id: subscription.id,
        fk_employee_id: randomCourierId,
      },
    });
  }

  console.log(
    "Subscriptions, subscription_daily_plans, deliveries inserted successfully"
  );
};

export const insertSubscriptionStates = async (prisma: any) => {
  await prisma.subscription_states.createMany({
    data: [
      { name: "active" },
      { name: "inactive" },
      { name: "pending" },
      { name: "expired" },
      { name: "canceled" },
      { name: "paused" },
      { name: "trial" },
      { name: "renewal due" },
      { name: "payment failed" },
      { name: "suspended" },
      { name: "grace period" },
      { name: "refunded" },
      { name: "deactivated" },
      { name: "completed" },
    ],
  });
  console.log("subscription_states inserted successfully");
};
