import { faker } from "@faker-js/faker";
import { PrismaClient, CompetitionStatus } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

(async () => {
  for (let i = 0; i < 10; i++) {
    const COmp = await prisma.competition.create({
      data: {
        name: faker.lorem.words(3),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        remaining_tickets: faker.datatype.number(100),
        total_tickets: faker.datatype.number(100),
        drawing_date: faker.date.future(),
        ticket_price: faker.datatype.number(100),
        location: faker.address.city(),
        second_reward: faker.lorem.words(3),
        price: faker.datatype.number(100),
        status: faker.helpers.arrayElement([
          CompetitionStatus.ACTIVE,
          CompetitionStatus.NOT_ACTIVE,
          CompetitionStatus.COMPLETED,
        ]),
        Watches: {
          create: {
            name: faker.lorem.words(3),
            condition: faker.lorem.words(3),
            years: faker.datatype.number(100),
            movement: faker.lorem.words(3),
            case_size: faker.datatype.number(100),
            dail: faker.lorem.words(3),
            case_material: faker.lorem.words(3),
            bracelet_material: faker.lorem.words(3),
            box: faker.datatype.boolean(),
            papers: faker.datatype.boolean(),
            imageURL: [faker.image.imageUrl(), faker.image.imageUrl()],
          },
        },
      },
    });
    console.log(COmp.id);
  }
})();
