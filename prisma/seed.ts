import { faker } from "@faker-js/faker";
import { PrismaClient, CompetitionStatus } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

(async () => {
  for (let i = 0; i < 1; i++) {
    const total_tickets = faker.datatype.number({
          min: 100,
          max: 1000,
        })
    const Price = faker.datatype.number({
      min : 10000,
      max : 100000
    })
    const COmp = await prisma.competition.create({
      data: {
        name: "win the Rolex OP41 Green Dial - FREE Comp",
        max_watch_number : faker.datatype.number(100),
        max_space_in_final_draw : faker.datatype.number(100),
        winner_announcement_date : faker.date.future(),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        run_up_prize : faker.lorem.words(3),
        drawing_date : faker.date.future(),
        remaining_tickets: faker.datatype.number({
          min: 1,
          max: total_tickets,
        }),
        total_tickets,
        ticket_price : Price/total_tickets,
        location: faker.address.city(),
        price : Price,
        status: faker.helpers.arrayElement([
          CompetitionStatus.ACTIVE,
          CompetitionStatus.NOT_ACTIVE,
          CompetitionStatus.COMPLETED,
        ]),
        Watches: {
          create: {
            brand: "Rolex",
            model: "OP41",
            reference_number: faker.datatype.number(100) + "OP41",
            movement : "Self Winding Automatic",
            Bracelet_material : "Stainless Steel",
            year_of_manifacture : new Date(faker.date.past()).getFullYear(),
            caliber_grear : 3135,
            number_of_stones : faker.datatype.number({
              min: 1,
              max: 30,
            }),
            glass : "Sapphire Glass",
            bezel_material : "Stainless Steel",
            has_box : faker.datatype.boolean(),
            has_certificate : faker.datatype.boolean(),
            images_url : [
                "/images/03_13_9%202.jpg",
                "/images/03_13_9%207.jpg",
                "/images/03_13_9%206.jpg",
                "/images/03_13_9%205.jpg",
            ],
            condition : "Excellent",
          },
        },
      },
    });
    console.log(COmp.id);
  }
})();
