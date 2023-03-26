import { faker } from "@faker-js/faker";
import { PrismaClient, CompetitionStatus } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

/*
(async () => {
  for (let i = 0; i < 1; i++) {
    const total_tickets = faker.datatype.number({
      min: 100,
      max: 1000,
    });
    const Price = faker.datatype.number({
      min: 10000,
      max: 100000,
    });
    const COmp = await prisma.competition.create({
      data: {
        name: "win the Rolex OP41 Green Dial - FREE Comp",
        max_watch_number: faker.datatype.number(100),
        max_space_in_final_draw: faker.datatype.number(100),
        winner_announcement_date: faker.date.future(),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        run_up_prize: faker.lorem.words(3),
        drawing_date: faker.date.future(),
        remaining_tickets: faker.datatype.number({
          min: 1,
          max: total_tickets,
        }),
        total_tickets,
        ticket_price: Price / total_tickets,
        location: faker.address.city(),
        price: Price,
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
            movement: "Self Winding Automatic",
            Bracelet_material: "Stainless Steel",
            year_of_manifacture: new Date(faker.date.past()).getFullYear(),
            caliber_grear: 3135,
            number_of_stones: faker.datatype.number({
              min: 1,
              max: 30,
            }),
            glass: "Sapphire Glass",
            bezel_material: "Stainless Steel",
            has_box: faker.datatype.boolean(),
            has_certificate: faker.datatype.boolean(),
            images_url: [
              "/images/03_13_9%202.jpg",
              "/images/03_13_9%207.jpg",
              "/images/03_13_9%206.jpg",
              "/images/03_13_9%205.jpg",
            ],
            condition: "Excellent",
          },
        },
      },
    });
    console.log(COmp.id);
  }
})();
*/

(async () => {
  await prisma.question.createMany({
    data: [
      {
        question: "What is a chronograph watch?",
        answers: [
          "A watch that can measure time intervals with a stopwatch function",
          "A watch that tells time using only a digital display",
          "A watch that measures atmospheric pressure",
          "A watch that measures altitude",
        ],
        correctAnswer:
          "A watch that can measure time intervals with a stopwatch function",
      },
      {
        question: "What is a mechanical watch?",
        answers: [
          "A watch that is powered by a mainspring",
          "A watch that is powered by a battery",
          "A watch that is powered by solar energy",
          "A watch that is powered by kinetic energy",
        ],
        correctAnswer: "A watch that is powered by a mainspring",
      },
      {
        question: "What is a quartz watch?",
        answers: [
          "A watch that is powered by a battery and regulated by a quartz crystal oscillator",
          "A watch that is powered by a wind-up mechanism",
          "A watch that is powered by body heat",
          "A watch that is powered by light",
        ],
        correctAnswer:
          "A watch that is powered by a battery and regulated by a quartz crystal oscillator",
      },
      {
        question: "What is a dive watch?",
        answers: [
          "A watch designed for underwater diving",
          "A watch designed for mountain climbing",
          "A watch designed for skydiving",
          "A watch designed for space exploration",
        ],
        correctAnswer: "A watch designed for underwater diving",
      },
      {
        question: "What is a GMT watch?",
        answers: [
          "A watch that can display two or more time zones simultaneously",
          "A watch that can only display one time zone",
          "A watch that displays the date",
          "A watch that displays the day of the week",
        ],
        correctAnswer:
          "A watch that can display two or more time zones simultaneously",
      },
      {
        question: "What is a moon phase watch?",
        answers: [
          "A watch that tracks the phases of the moon",
          "A watch that displays the date",
          "A watch that displays the time in 24-hour format",
          "A watch that displays the current weather conditions",
        ],
        correctAnswer: "A watch that tracks the phases of the moon",
      },
      {
        question: "What is a perpetual calendar watch?",
        answers: [
          "A watch that can display the correct date for any year without requiring manual adjustment",
          "A watch that can only display the current year",
          "A watch that displays the time in multiple time zones",
          "A watch that measures heart rate",
        ],
        correctAnswer:
          "A watch that can display the correct date for any year without requiring manual adjustment",
      },
      {
        question: "What is a skeleton watch?",
        answers: [
          "A watch with a transparent dial and/or caseback that allows the movement to be seen",
          "A watch with a solid dial and caseback",
          "A watch with a built-in compass",
          "A watch with a built-in GPS",
        ],
        correctAnswer:
          "A watch with a transparent dial and/or caseback that allows the movement to be seen",
      },
    ],
  });
})();
