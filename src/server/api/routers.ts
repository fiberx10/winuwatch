/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Competition, CompetitionStatus, order_status, PaymentMethod} from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  getBaseUrl,
  CreateOrderSchema,
  CreateOrderFromCartSchema,
  CreateOrderStripeSchema,
  Comps,
} from "@/utils";
import { Transporter, Stripe } from "../utils";
import { WatchesSchema, CompetitionSchema } from "@/utils/zodSchemas";
import type { PrismaClient } from "@prisma/client";
import Email, { GetData } from "@/components/emails";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";
import WinningEmail, { GetWinnerData } from "@/components/emails/WinningEmail";
import RemainingEmail from "@/components/emails/RemainingEmail";
import NewsLetter from "@/components/newsLetter1";
import FreeTickets from "@/components/emails/FreeTickets";
import RunerUp from "@/components/emails/RunerUp";
import RunerUp2 from "@/components/emails/RunerUp2";
import newsLetter1 from "@/components/newsLetter1";
import EmailF from "@/components/emailsFree";

const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const discountCodeGenerator = async (prisma: PrismaClient): Promise<string> => {
  const possible =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  let attempts = 0;
  while (attempts < 10) {
    // limit the number of attempts to 10
    const coupon = Array.from(
      { length: 8 },
      () => possible[Math.floor(Math.random() * possible.length)]
    ).join("");
    const [affExists, rupExists] = await Promise.all([
      prisma.affiliation.count({
        where: {
          discountCode: coupon,
        },
      }),
      prisma.runUpPrize.count({
        where: {
          couponCode: coupon,
        },
      }),
    ]);
    if (affExists + rupExists === 0) {
      return coupon;
    }
    attempts++;
  }
  throw new Error(
    "Failed to generate a unique discount code after 10 attempts"
  );
};

export const WinnersRouter = createTRPCRouter({
  getCSV: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const competition = await ctx.prisma.competition.findUnique({
      where: {
        id: input,
      },
      include: {
        Ticket: {
          include: {
            Order: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error("Competition not found");
    }
    return competition.Ticket.filter(
      (ticket) => ticket.Order.status === order_status.CONFIRMED
    ).map((ticket) => ({
      ticketID: ticket.id,
      Order_ID: ticket.Order.id,
      first_name: ticket.Order.first_name,
      last_name: ticket.Order.last_name,
    }));
  }),
  pickOneRandom: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //based on the competition id, pick a random winner and return the ticket data and order data

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          competitionId: input,
        },
        include: {
          Order: true,
          Competition: {
            include: {
              Watches: {
                include: {
                  images_url: true,
                },
              },
            },
          },
        },
      });
      const random = Math.floor(Math.random() * tickets.length); // This algo neeeds to change
      return tickets[random] ?? tickets[0];
    }),
  getWinner: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const winner = await ctx.prisma.ticket.findUnique({
        where: {
          id: input,
        },
        include: {
          Order: true,
          Competition: true,
        },
      });
      return winner;
    }),
  sendNewsLetters: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //based on the ticket ID we should be able to close the competition and send the winner an email
      const orders = await ctx.prisma.ticket.findMany({
        where: {
          Order: {
            checkedEmail: true,
          },
          competitionId: input,
        },
        include: {
          Order: true,
          Competition: {
            include: {
              Watches: {
                include: {
                  images_url: true,
                },
              },
            },
          },
        },
      });
      if (!orders) {
        throw new Error("Competition not found");
      }
      // change to getWinnerdata

      orders
        .filter(
          (order, index) =>
            index ===
            orders.findIndex((o) => order.Order.email === o.Order.email)
        )
        .map(async (order) => {
          console.log("sent");
          const data = { data: order };
          await Transporter.sendMail({
            from: "noreply@winuwatch.uk",
            to: order.Order.email,
            subject: `NewsLetter Email - Winuwatch ${
              order.Competition.name || "000000"
            }`,
            html: newsLetter1(data),
          });
        });
      return void 0; //TODO : Send email
    }),
  confirmWinner: publicProcedure
    .input(
      z
        .object({
          compId: z.string(),
          winner: z.string(),
          orderId: z.string(),
          ticketId: z.string(),
        })
        .required()
    )
    .mutation(async ({ ctx, input }) => {
      //based on the ticket ID we should be able to close the competition and send the winner an email
      const ticket = await ctx.prisma.competition.update({
        where: {
          id: input.compId,
        },
        data: {
          winner: input.winner,
        },
      });
      if (!ticket) {
        throw new Error("Competition not found");
      }
      // change to getWinnerdata
      const data = await GetWinnerData(input.ticketId, ctx.prisma);
      if (!data?.data?.Order) {
        throw new Error("Order not found");
      }

      await Transporter.sendMail({
        from: "noreply@winuwatch.uk",
        cc: "admin@winuwatch.uk",
        to: data?.data?.Order.email,
        subject: `Congratulations - Winuwatch #${
          data?.data?.orderId || "000000"
        }`,
        html: WinningEmail(data),
      });
      /*
      const { Order, Competition } = ticket;
      const { Watches } = Competition;
      const { email } = Order;
      */
      return void 0; //TODO : Send email
    }),
  sendConfirmation: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await GetWinnerData(input, ctx.prisma);
      if (!data?.data?.Order) {
        throw new Error("Order not found");
      }
      await Transporter.sendMail({
        from: "noreply@winuwatch.uk",
        cc: "admin@winuwatch.uk",
        to: data?.data?.Order.email,
        subject: `Congratulations - Winuwatch #${
          data?.data?.orderId || "000000"
        }`,
        html: WinningEmail(data),
      });
      return void 0;
    }),
  getWinnerReminders: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const competition = await ctx.prisma.ticket.findMany({
        where: {
          competitionId: input,
          Order: {
            status: order_status.CONFIRMED,
          },
        },
        include: {
          Order: true,
          Competition: {
            include: {
              Watches: {
                include: {
                  images_url: true,
                },
              },
            },
          },
        },
      });

      if (!competition) {
        throw new Error("Competition not found");
      }
      competition
        .filter(
          (order, index) =>
            index ===
            competition.findIndex((o) => order.Order.email === o.Order.email)
        )
        .map(async (order) => {
          console.log("sent");

          const data = { data: order };
          await Transporter.sendMail({
            cc: "admin@winuwatch.uk",
            from: "noreply@winuwatch.uk",
            to: order.Order.email,
            subject: `Reminder Email - Winuwatch #${order.orderId || "000000"}`,
            html: RemainingEmail(data),
          });
        });
      return void 0;
    }),
});

export const TicketsRouter = createTRPCRouter({
  getTicket: publicProcedure.input(z.string().optional()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.ticket.findUniqueOrThrow({
        where: {
          id: input,
        },
        include: {
          Competition: true,
          Order: true,
        },
      })
  ),
});

export const AuthRouter = createTRPCRouter({
  auth: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      const user = { username: "admin", password: "1234" };
      return (
        input.username === user.username && input.password === user.password
      );
    }),
});

export const OrderRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.string()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: {
          Ticket: {
            some: {
              Competition: {
                id: input,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Ticket: {
            where: {
              competitionId: input,
            },
          },
        },
      })
  ),
  getOrder: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await GetData(input, ctx.prisma);
    if (!data.order) {
      throw new Error("Order not found");
    }

    await Transporter.sendMail({
      from: "noreply@winuwatch.uk",
      cc: "admin@winuwatch.uk",
      to: data.order.email,
      subject: `Order Confirmation - Winuwatch #${data.order?.id || "000000"}`,
      html: Email(data),
    });
    return data.order;
  }),
  getOrderCheck: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input,
        },
      });
      //const data = await GetData(input, ctx.prisma);
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),
  getOrderName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.order.findUnique({
        where: {
          id: input,
        },
      });
      return {
        fullname: String(data?.first_name) + " " + String(data?.last_name),
      };
    }),
  SendFreeTickets_fixed : publicProcedure
    .input(
      z.object({
        compId: z.string(),
        orderId: z.string(),
        numTickts: z.number(),
      })
    ).mutation(async ({ ctx, input }) => {
      const [NextComp, OgOrder]  = await ctx.prisma.$transaction([
            ctx.prisma.competition.findFirstOrThrow({
            where: {
              id: input.compId,
            },
            include: {
              Ticket: {
                where: {
                  competitionId: input.compId,
                  orderId: input.orderId,
                },
              },
              Watches: {
                include: {
                  images_url: true,
                },
              },
            },
          }),
          ctx.prisma.order.findFirstOrThrow({
            where: {
              id: input.orderId,
            },
          }),
        ]);
        const {id, ...rest} = OgOrder;
      const FreeticketOrder = await ctx.prisma.order.create({
        data: {
          ...rest,
          paymentMethod : PaymentMethod.MARKETING, //this needs to be chnaged
          status: order_status.CONFIRMED,
          totalPrice : 0,
          Ticket: {
            create: Array.from({ length: input.numTickts }).map(() => ({
              Competition: {
                connect: {
                  id: input.compId,
                },
              },
            })),
          }
        },
        include: {
          Ticket: true,
        },
      });
      await Transporter.sendMail({
        from: "noreply@winuwatch.uk",
        cc: "admin@winuwatch.uk",
        to: OgOrder?.email,
        subject: `Here are your free tickets - Winuwatch`,
        html: EmailF({
          order: FreeticketOrder,
          numTickts: input.numTickts,
          comp: NextComp,
          }),
        })
      return FreeticketOrder;
    }),
  getComps: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.competition.findMany({
        orderBy: {
          end_date: "desc",
        },
      })
  ),
  AddTicketsAfterConfirmation: publicProcedure
    .input(z.object({ id: z.string(), comps: Comps }))
    .query(async ({ ctx, input }) => {
      try {
        if (input.comps.length > 0) {
          await ctx.prisma.order.update({
            where: {
              id: input.id,
            },
            data: {
              Ticket: {
                createMany: {
                  data: input.comps
                    .map(({ compID, number_tickets }) =>
                      new Array(number_tickets).fill(0).map((_) => ({
                        competitionId: compID,
                      }))
                    )
                    .flat(),
                },
              },
            },
          });

          const data = await GetData(input.id, ctx.prisma);
          if (!data.order) {
            throw new Error("Order not found");
          }
          // we are getting all the affiliations that the user has, and all the orders that he won in the competitions he passed in the order
          const [clientAffiliations, orders] = await Promise.all([
            ctx.prisma.affiliation.findMany({
              where: {
                ownerEmail: data.order.email,
                uses: {
                  gt: 4,
                },
              },
            }),
            ctx.prisma.order.findMany({
              where: {
                email: data.order.email,
                status: "CONFIRMED",
                paymentMethod: "AFFILIATION",
                totalPrice: 0,
              },
              include: {
                Ticket: {
                  where: {
                    competitionId: {
                      in: input.comps.map(({ compID }) => compID),
                    },
                  },
                },
              },
            }),
          ]);

          if (
            !!clientAffiliations.length &&
            orders.length < input.comps.length &&
            !!data.order?.email
          ) {
            // if the user has affiliations and he won less than the comps he passed in the order
            // we need to add the affiliations to the order
            const compsNotWon = input.comps.filter(
              ({ compID }) =>
                !orders.some(({ Ticket }) =>
                  Ticket.some(({ competitionId }) => competitionId === compID)
                )
            );

            compsNotWon.map(async ({ compID }) => {
              // create order with number of tickets = Math.floor(uses / 5)
              if (
                clientAffiliations.some((comp) => comp.compToWin === compID)
              ) {
                const number_tickets = Math.floor(
                  (clientAffiliations.find((comp) => comp.compToWin === compID)
                    ?.uses || 0) / 5
                );
                await ctx.prisma.$transaction(async (tx) => {
                  const addedOrder = await tx.order.create({
                    data: {
                      first_name: data.order?.first_name,
                      last_name: data.order?.last_name,
                      phone: data.order?.phone || "",
                      email: data.order?.email || "",
                      address: data.order?.address,
                      country: data.order?.country,
                      zip: data.order?.zip,
                      town: data.order?.town,
                      paymentMethod: "AFFILIATION",
                      status: "CONFIRMED",
                      totalPrice: 0,
                      Ticket: {
                        createMany: {
                          data: new Array(number_tickets).fill(0).map((_) => ({
                            competitionId: compID,
                          })),
                        },
                      },
                    },
                  });

                  await tx.competition.update({
                    where: {
                      id: compID,
                    },
                    data: {
                      remaining_tickets: {
                        decrement: number_tickets,
                      },
                    },
                  });
                  // TODO: Send email
                  await Transporter.sendMail({
                    from: "noreply@winuwatch.uk",
                    cc: "admin@winuwatch.uk",
                    to: addedOrder.email,
                    subject: `Here is your free tickets - Winuwatch`,
                    html: Email({
                      order: addedOrder,
                      comps: await tx.competition
                        .findMany({
                          include: {
                            Ticket: {
                              where: {
                                orderId: addedOrder.id,
                              },
                            },
                            Watches: {
                              include: {
                                images_url: true,
                              },
                            },
                          },
                        })
                        .then((e) =>
                          e
                            .filter(({ Ticket }) => Ticket.length > 0)
                            .map((comp) => ({
                              ...comp,
                              affiliationCode: "",
                              affiliationRate: 0,
                            }))
                        ),
                    }),
                  });
                });
              }
            });
          }

          //! What I've added
          if (!!data.order?.affiliationId) {
            await ctx.prisma.$transaction(async (tx) => {
              const updatedAffiliation = await tx.affiliation.update({
                where: {
                  id: data?.order?.affiliationId || undefined,
                },
                data: {
                  uses: {
                    increment: 1,
                  },
                },
              });

              if (updatedAffiliation && updatedAffiliation.uses % 5 === 0) {
                // get next competition
                const nextCompetition = await tx.competition.findFirst({
                  where: {
                    id: {
                      not: updatedAffiliation.competitionId,
                    },
                    status: "ACTIVE",
                    start_date: {
                      gt: await tx.competition
                        .findUnique({
                          where: {
                            id: updatedAffiliation.competitionId,
                          },
                        })
                        .then((comp) => comp?.start_date),
                    },
                  },
                  orderBy: {
                    start_date: "asc",
                  },
                  include: {
                    Watches: {
                      include: {
                        images_url: true,
                      },
                    },
                  },
                });

                console.log("next comp is ===>", nextCompetition);

                // get owner previous orders on the next competition if exists, if not, for the current competition
                const prevWonOrder = await tx.order.findFirst({
                  where: {
                    email: updatedAffiliation.ownerEmail,
                    status: "CONFIRMED",
                    paymentMethod: "AFFILIATION",
                    totalPrice: 0,
                    Ticket: {
                      some: {
                        competitionId: !nextCompetition
                          ? updatedAffiliation.competitionId
                          : nextCompetition?.id,
                      },
                    },
                  },
                });
                console.log("prev won order is ===>", prevWonOrder);

                const orderOnNextComp = updatedAffiliation.compToWin
                  ? await tx.order.findFirst({
                      where: {
                        email: updatedAffiliation.ownerEmail,
                        status: "CONFIRMED",
                        paymentMethod: {
                          not: "AFFILIATION",
                        },
                        totalPrice: {
                          not: 0,
                        },
                        Ticket: {
                          some: {
                            competitionId: updatedAffiliation.compToWin,
                          },
                        },
                      },
                    })
                  : null;
                if (!!prevWonOrder) {
                  // if the owner has previous orders on the next competition, we need to add another ticket to the order

                  await tx.ticket
                    .create({
                      data: {
                        competitionId: !nextCompetition
                          ? updatedAffiliation.competitionId
                          : nextCompetition?.id,
                        orderId: prevWonOrder.id,
                      },
                    })
                    .then((res) => console.log("ticket added", res));

                  await tx.competition
                    .update({
                      where: {
                        id: !!nextCompetition
                          ? nextCompetition.id
                          : updatedAffiliation.competitionId,
                      },
                      data: {
                        remaining_tickets: {
                          decrement: 1,
                        },
                      },
                    })
                    .then((res) => console.log("comp updated", res));

                  await tx.affiliation
                    .update({
                      where: {
                        id: updatedAffiliation.id,
                      },
                      data: {
                        compToWin: !!nextCompetition
                          ? nextCompetition.id
                          : updatedAffiliation.competitionId,
                      },
                    })
                    .then((res) => console.log("affiliation updated", res));

                  await Transporter.sendMail({
                    from: "noreply@winuwatch.uk",
                    cc: "admin@winuwatch.uk",

                    to: updatedAffiliation.ownerEmail,
                    subject: `Claim your free ticket - Winuwatch`,
                    html: Email({
                      order: prevWonOrder,
                      comps: await tx.competition
                        .findMany({
                          include: {
                            Ticket: {
                              where: {
                                orderId: prevWonOrder.id,
                              },
                            },
                            Watches: {
                              include: {
                                images_url: true,
                              },
                            },
                          },
                        })
                        .then((e) =>
                          e
                            .filter(({ Ticket }) => Ticket.length > 0)
                            .map((comp) => ({
                              ...comp,
                              affiliationCode: "",
                              affiliationRate: 0,
                            }))
                        ),
                    }),
                  });
                } else if (
                  !!updatedAffiliation.compToWin &&
                  !!orderOnNextComp
                ) {
                  // if he already ordered on the next competition, we need to send him an email to claim his ticket
                  const number_tickets = Math.floor(
                    updatedAffiliation.uses / 5
                  );
                  const newOrder = await tx.order.create({
                    data: {
                      first_name: orderOnNextComp.first_name,
                      last_name: orderOnNextComp.last_name,
                      email: updatedAffiliation.ownerEmail,
                      phone: orderOnNextComp.phone,
                      address: orderOnNextComp.address,
                      country: orderOnNextComp.country,
                      town: orderOnNextComp.town,
                      zip: orderOnNextComp.zip,
                      status: "CONFIRMED",
                      paymentMethod: "AFFILIATION",
                      totalPrice: 0,
                      Ticket: {
                        createMany: {
                          data: new Array(number_tickets).fill(0).map((_) => ({
                            competitionId: updatedAffiliation.compToWin || "",
                          })),
                        },
                      },
                    },
                  });
                  await tx.competition.update({
                    where: {
                      id: updatedAffiliation.competitionId,
                    },
                    data: {
                      remaining_tickets: {
                        decrement: 1,
                      },
                    },
                  });
                  await Transporter.sendMail({
                    from: "noreply@winuwatch.uk",
                    cc: "admin@winuwatch.uk",
                    to: newOrder.email,
                    subject: `Here is your free tickets - Winuwatch`,
                    html: Email({
                      order: newOrder,
                      comps: await tx.competition
                        .findMany({
                          include: {
                            Ticket: {
                              where: {
                                orderId: newOrder.id,
                              },
                            },
                            Watches: {
                              include: {
                                images_url: true,
                              },
                            },
                          },
                        })
                        .then((e) =>
                          e
                            .filter(({ Ticket }) => Ticket.length > 0)
                            .map((comp) => ({
                              ...comp,
                              affiliationCode: "",
                              affiliationRate: 0,
                            }))
                        ),
                    }),
                  });
                } else {
                  // TODO: Send email
                  await tx.affiliation.update({
                    where: {
                      id: updatedAffiliation.id,
                    },
                    data: {
                      compToWin: !nextCompetition
                        ? updatedAffiliation.competitionId
                        : nextCompetition?.id,
                    },
                  });
                  await Transporter.sendMail({
                    from: "noreply@winuwatch.uk",
                    cc: "admin@winuwatch.uk",
                    to: updatedAffiliation.ownerEmail,
                    subject: `Claim your free ticket - Winuwatch`,
                    html: FreeTickets({
                      tickets: Math.floor(updatedAffiliation.uses / 5),
                      nextComp: nextCompetition,
                    }),
                    // `You won ${Math.floor(
                    //   updatedAffiliation.uses / 5
                    // )} free ${
                    //   Math.floor(updatedAffiliation.uses / 5) === 1
                    //     ? "ticket"
                    //     : "tickets"
                    // }, buy a ticket on next compition ${
                    //   nextCompetition?.name || ""
                    // } with ID ${nextCompetition?.id || ""} to claim it!`,
                  });
                }
              }
            });
          } else if (!!data.order?.runUpPrizeId) {
            await ctx.prisma.runUpPrize.update({
              where: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                id: data.order?.runUpPrizeId,
              },
              data: {
                uses: {
                  increment: 1,
                },
              },
            });
          }
          //! send new discount code to user that made the order
          const affiliationExist = await ctx.prisma.affiliation.findMany({
            where: {
              ownerEmail: data.order.email,
              competitionId: {
                in: data.comps.map((e) => e.id),
              },
            },
          });

          const affiliationExistIds = new Set(
            affiliationExist.map((e) => e.competitionId)
          );

          for (const comp of data.comps) {
            if (!affiliationExistIds.has(comp.id)) {
              const newAffiliation = await ctx.prisma.affiliation.create({
                data: {
                  ownerEmail: data.order.email,
                  discountCode: await discountCodeGenerator(ctx.prisma),
                  competitionId: comp.id,
                },
              });
              comp.affiliationCode = newAffiliation.discountCode;
            } else {
              for (const affiliation of affiliationExist) {
                if (comp.id === affiliation.competitionId) {
                  comp.affiliationCode = affiliation.discountCode;
                  break;
                }
              }
            }
            if (data.order?.affiliationId) {
              const affiliation = await ctx.prisma.affiliation.findUnique({
                where: {
                  id: data.order?.affiliationId,
                },
              });
              if (affiliation && affiliation.competitionId === comp.id) {
                comp.affiliationRate = affiliation.discountAmount
                  ? affiliation.discountAmount / comp.ticket_price
                  : affiliation.discountRate;
              } else {
                comp.affiliationRate = 0;
              }
            } else {
              comp.affiliationRate = 0;
            }
          }

          console.log("COMPS ====>", data.comps);

          await Transporter.sendMail({
            from: "noreply@winuwatch.uk",
            cc: "admin@winuwatch.uk",

            to: data.order.email,
            subject: `Order Confirmation - Winuwatch #${
              data.order?.id || "000000"
            }`,
            html: Email(data),
          });
          return data.order;
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  getNextComp: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const nextCompetition = await ctx.prisma.competition.findFirst({
        where: {
          id: {
            not: input,
          },
          status: "ACTIVE",
        },
        orderBy: {
          end_date: "asc",
        },
        include: {
          Watches: {
            include: {
              images_url: true,
            },
          },
        },
      });
      return nextCompetition;
    }),
  sendEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await GetData(input, ctx.prisma);
      if (!data.order) {
        throw new Error("Order not found");
      }
      await Transporter.sendMail({
        from: "noreply@winuwatch.uk",
        cc: "admin@winuwatch.uk",

        to: data.order.email,
        subject: `Order Confirmation - Winuwatch #${
          data.order?.id || "000000"
        }`,
        html: Email(data),
      });
      return true;
    }),

  updatePaypalOrder: publicProcedure
    .input(CreateOrderStripeSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        locale,
        comps,
        affiliationId = null,
        runUpPrizeId = null,
        ...data
      } = input;
      await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          ...data,
          affiliationId: affiliationId,
          runUpPrizeId: runUpPrizeId,
          status: order_status.PENDING,
        },
      });
      return true;
    }),

  createStripe: publicProcedure
    .input(CreateOrderStripeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          locale,
          comps,
          affiliationId = null,
          runUpPrizeId = null,
          ...data
        } = input;
        const [Order, StripeOrder] = await Promise.all([
          ctx.prisma.order.update({
            where: {
              id: input.id,
            },
            data: {
              ...data,
              affiliationId: affiliationId,
              runUpPrizeId: runUpPrizeId,
              status: order_status.PENDING,
            },
          }),
          await Stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: data.email,
            locale: locale === "il" ? "auto" : locale,
            line_items: (
              await ctx.prisma.competition.findMany({
                where: {
                  id: {
                    in: comps.map(({ compID }) => compID),
                  },
                },
                include: {
                  Watches: {
                    include: {
                      images_url: true,
                    },
                  },
                },
              })
            ).map((comp) =>
              comp.Watches
                ? {
                    price_data: {
                      currency: "gbp",
                      product_data: {
                        name: comp.Watches.model,
                        images: comp.Watches.images_url.map(({ url }) => url),
                      },
                      unit_amount: Math.floor(
                        100 *
                          (!runUpPrizeId
                            ? comp.ticket_price *
                              (1 -
                                (input.comps.find(
                                  ({ compID }) => compID === comp.id
                                )?.reduction || 0))
                            : comp.ticket_price -
                              (input.comps.find(
                                ({ compID }) => compID === comp.id
                              )?.reduction || 0))
                      ),
                    },
                    quantity:
                      input.comps.find((item) => item.compID === comp.id)
                        ?.number_tickets || 0,
                  }
                : {}
            ),
            success_url: `${getBaseUrl()}${
              locale && `/${locale}`
            }/Confirmation/${input.id}`,
            cancel_url: `${getBaseUrl()}${locale && `/${locale}`}/Cancel/${
              input.id
            }`,
          }),
        ]);

        await ctx.prisma.order.update({
          where: {
            id: Order.id,
          },
          data: {
            paymentId: StripeOrder.id,
          },
        });

        return {
          url: StripeOrder.url,
        };
      } catch (e) {
        console.error(e);
        return {
          error: "Error in creating the order",
          url: null,
        };
      }
    }),
  // validatePaypal: publicProcedure.input(z.object({paypal: z.object({}), id: z.string()})).mutation(async ({ctx,input}) => {
  // input.paypal.order.capture()
  // await ctx.prisma.order.update({
  //   where: {
  //     id: input.id,
  //   },
  //   data: {
  //     status: order_status.CONFIRMED,
  //   },
  // });

  // }),
  createOrder: publicProcedure
    .input(CreateOrderFromCartSchema.optional())
    .mutation(async ({ ctx, input }) => {
      const id = faker.datatype.uuid();
      const order = await ctx.prisma.order.create({
        data: {
          address: "",
          checkedEmail: false,
          country: "",
          date: new Date(),
          first_name: "",
          last_name: "",
          town: "",
          zip: "",
          phone: "",
          email: "",
          paymentMethod: "STRIPE",
          checkedTerms: false,
          totalPrice: 0,
          id,
          status: order_status.INCOMPLETE,
          Ticket: {
            createMany: {
              data: [],
            },
          },
        },
      });
      return order.id;
    }),
  create: publicProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { comps, ...data } = input;
      return await ctx.prisma.order.create({
        data: {
          ...data,
          status: order_status.CONFIRMED,
          Ticket: {
            createMany: {
              data: comps
                .map(({ compID, number_tickets }) =>
                  new Array(number_tickets).fill(0).map((_) => ({
                    competitionId: compID,
                  }))
                )
                .flat(),
            },
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      CreateOrderSchema.extend({
        status: z.nativeEnum(order_status),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.order.update({
        data: input,
        where: {
          id,
        },
      });
    }),
  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.nativeEnum(order_status) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  removeTickets: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ticket.deleteMany({
        where: {
          orderId: input,
        },
      });
    }),
  remove: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.ticket.deleteMany({
      where: {
        orderId: input,
      },
    });
    return await ctx.prisma.order.delete({
      where: {
        id: input,
      },
    });
  }),
});

export const CompetitionRouter = createTRPCRouter({
  getConfirmedAsCSV: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.order.findMany({
        where: {
          //status: order_status.CONFIRMED,
          Ticket: {
            some: {
              competitionId: input,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return data.map((order) => ({
        competitionId: input,
        email: order.email,
        firstName: order.first_name,
        lastName: order.last_name,
        phone: order.phone,
        status: order.status,
      }));
    }),
  getAll: publicProcedure
    .input(
      z
        .object({
          ids: z.array(z.string()).optional(),
          status: z.nativeEnum(CompetitionStatus).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const Data = await ctx.prisma.$transaction([
        ctx.prisma.competition.findMany({
          where: input
            ? {
                status: input.status,
                id: {
                  in: input.ids,
                },
              }
            : {},
          select: {
            id: true,
            _count: {
              select: {
                Ticket: true,
              },
            },
          },
        }),
        ctx.prisma.competition.findMany({
          where: input
            ? {
                status: input.status,
                id: {
                  in: input.ids,
                },
              }
            : {},
          include: {
            Watches: {
              include: {
                images_url: true,
              },
            },
          },
        }),
      ]);
      // Get the list of competitions to update
      const finishedComps = Data[1]
        .filter(
          (comp) =>
            comp.status !== CompetitionStatus.COMPLETED &&
            comp.total_tickets -
              (Data[0].find((item) => item.id === comp.id)?._count?.Ticket ||
                0) <=
              0 &&
            comp.end_date < new Date()
        )
        .map(({ id }) => id);

      // Update the status of the selected competitions to "COMPLETE"
      await ctx.prisma.competition.updateMany({
        where: { id: { in: finishedComps } },
        data: { status: CompetitionStatus.COMPLETED },
      });

      return Data[1].map((comp) => ({
        ...comp,
        remaining_tickets:
          comp.total_tickets -
          (Data[0].find((item) => item.id === comp.id)?._count?.Ticket || 0),
      }));
    }),
  //GetUniqueByID
  GetUniqueByID: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Data = await ctx.prisma.$transaction([
        ctx.prisma.competition.findUnique({
          where: {
            id: input,
          },
          select: {
            id: true,
            _count: {
              select: {
                Ticket: true,
              },
            },
          },
        }),
        ctx.prisma.competition.findUnique({
          where: {
            id: input,
          },
          include: {
            Watches: {
              include: {
                images_url: true,
              },
            },
          },
        }),
      ]);
      return Data[1] && Data[0]
        ? {
            ...Data[1],
            remaining_tickets: Data[1]?.total_tickets - Data[0]?._count?.Ticket,
          }
        : undefined;
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return (await ctx.prisma.competition.delete({
      where: {
        id: input,
      },
    }))
      ? {
          success: true,
        }
      : {
          success: false,
          error: "Competition not found",
        };
  }),
  byID: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const Data = await ctx.prisma.$transaction([
      ctx.prisma.competition.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          _count: {
            select: {
              Ticket: true,
            },
          },
        },
      }),
      ctx.prisma.competition.findUnique({
        where: {
          id: input,
        },
        include: {
          Watches: {
            include: {
              images_url: true,
            },
          },
        },
      }),
    ]);
    return Data[1]
      ? {
          ...Data[1],
          remaining_tickets:
            Data[1].total_tickets - (Data[0]?._count?.Ticket || 0),
        }
      : undefined;
  }),
  updateOne: publicProcedure
    .input(
      CompetitionSchema.extend({
        watchesId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.competition.update({
        data,
        where: {
          id,
        },
      });
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(CompetitionStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      return await ctx.prisma.competition.updateMany({
        where: {
          id,
        },
        data: {
          status: status,
        },
      });
    }),

  add: publicProcedure
    .input(CompetitionSchema.omit({ id: true }).required())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.competition.create({
        data: {
          ...input,
        },
      });
    }),
});

export const WatchesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.watches.findMany({
        include: {
          images_url: true,
        },
      })
    ).map((watch) => ({
      ...watch,
      images_url: watch.images_url.map((image) => image.url),
    }));
  }),
  byID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.watches.findUnique({
        where: {
          id: input.id,
        },
        include: {
          images_url: true,
        },
      });
    }),
  remove: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    //TODO: Delete the images from firebase
    await ctx.prisma.imagesUrl.deleteMany({
      where: {
        WatchesId: input,
      },
    });
    return await ctx.prisma.watches.delete({
      where: {
        id: input,
      },
    });
  }),
  removeWatchIMG: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //TODO: Delete the images from firebase
      await ctx.prisma.imagesUrl.deleteMany({
        where: {
          url: input,
        },
      });
    }),
  addWatchIMG: publicProcedure
    .input(
      z.object({
        WatchesId: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.imagesUrl.create({
        data: {
          ...input,
        },
      });
    }),

  add: publicProcedure
    .input(
      WatchesSchema.omit({
        id: true,
      }).extend({
        images_url: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { images_url, ...data } = input;
      return await ctx.prisma.watches.create({
        data: {
          ...data,
          images_url: {
            create: images_url.map((url) => ({ url })),
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      WatchesSchema.extend({
        images_url: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, images_url, ...data } = input;
      return await ctx.prisma.watches.update({
        data: {
          ...data,
          images_url: {
            create: images_url?.map((url) => ({ url })),
          },
        },
        where: {
          id,
        },
      });
    }),

  /*
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        owner_ref: z.string().optional(),
        condition: z.string(),
        years: z.number(),
        movement: z.string(),
        case_size: z.number(),
        dail: z.string(),
        case_material: z.string(),
        bracelet_material: z.string(),
        water_proof: z.string(),
        box: z.boolean().default(false),
        papers: z.boolean().default(false),
        imageURL: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.create({
        data: input,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        owner_ref: z.string().optional(),
        condition: z.string().optional(),
        years: z.number().optional(),
        movement: z.string().optional(),
        case_size: z.number().optional(),
        dail: z.string().optional(),
        case_material: z.string().optional(),
        bracelet_material: z.string().optional(),
        water_proof: z.string().optional(),
        box: z.boolean().optional(),
        papers: z.boolean().optional(),
        imageURL: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.watches.update({
        data,
        where: { id },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.delete({
        where: {
          id: input.id,
        },
      });
    }),
    */
});

export const QuestionRouter = createTRPCRouter({
  getOneRandom: publicProcedure.query(async ({ ctx }) => {
    const Questions = await ctx.prisma.question.findMany({
      include: {
        answers: true,
      },
    });
    const randomIndex = Math.floor(Math.random() * Questions.length);
    const Question =
      randomIndex < Questions.length && randomIndex >= 0
        ? Questions[randomIndex]
        : Questions[0];
    if (!Question) {
      return null;
    }
    return {
      ...Question,
      answers:
        ((array: (string | undefined)[]) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array.filter(
            (item): item is string => typeof item === "string"
          );
        })(Question.answers.map(({ answer }) => answer)) || [],
    };
  }),
});

export const AffiliationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.affiliation.findMany({
        include: {
          competition: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }),
  add: publicProcedure
    .input(
      z.object({
        discountRate: z.number().gte(0).lte(100).default(0),
        discountAmount: z.number().gte(0).default(0),
        ownerEmail: z.string().email(),
        competitionId: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.discountRate == 0 && input.discountAmount == 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount rate or discount amount must be greater than 0",
          });
        }
        const hasAffiliation = await ctx.prisma.affiliation.findFirst({
          where: {
            competitionId: input.competitionId,
            ownerEmail: input.ownerEmail,
          },
        });
        if (hasAffiliation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Affiliation already exists",
          });
        }
        const competition = await ctx.prisma.competition.findUnique({
          where: {
            id: input.competitionId,
          },
          include: {
            Ticket: {
              include: {
                Order: true,
              },
            },
          },
        });
        if (
          competition?.Ticket[0]?.Order?.totalPrice &&
          input.discountAmount >= competition?.Ticket[0]?.Order?.totalPrice
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount amount must be less than total price",
          });
        }
        return await ctx.prisma.affiliation.create({
          data: {
            ...input,
            discountRate: input.discountRate / 100,
            discountAmount: input.discountAmount || 0,
            discountCode: await discountCodeGenerator(ctx.prisma),
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            cause: error,
          });
        }
      }
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        discountRate: z.number().gte(0).lte(100).optional(),
        discountAmount: z.number().gte(0).optional(),
        ownerEmail: z.string().email().optional(),
        competitionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        if (data.discountRate) {
          data.discountRate = data.discountRate / 100;
        }
        if (data.ownerEmail) {
          console.log(data);

          const hasAffiliation = await ctx.prisma.affiliation.findFirst({
            where: {
              competitionId: data.competitionId,
              ownerEmail: data.ownerEmail,
              id: {
                not: id,
              },
            },
          });
          console.log(hasAffiliation);

          if (hasAffiliation) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already has affiliation on this competition",
            });
          }
        }
        // if (data.discountAmount) {
        //   const competition = await ctx.prisma.competition.findUnique({
        //     where: {
        //       id: input.competitionId,
        //     },
        //     include: {
        //       Ticket: {
        //         include: {
        //           Order: true,
        //         },
        //       },
        //     },
        //   });
        //   if (
        //     competition?.Ticket[0]?.Order?.totalPrice &&
        //     input.discountAmount >= competition?.Ticket[0]?.Order?.totalPrice
        //   ) {
        //     throw new TRPCError({
        //       code: "BAD_REQUEST",
        //       message: "Discount amount must be less than total price",
        //     });
        //   }
        // }
        return await ctx.prisma.affiliation.update({
          data,
          where: { id },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            cause: error,
          });
        }
      }
    }),
  delete: publicProcedure
    .input(z.string().nonempty())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.affiliation.delete({
        where: {
          id: input,
        },
      });
    }),
  checkDiscount: publicProcedure
    .input(
      z.object({
        discountCode: z.string(),
        competitionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { discountCode, competitionIds } = input;

      if (!discountCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enter your discount code",
        });
      }

      const [affiliation, runUpPrize] = await Promise.all([
        ctx.prisma.affiliation.findFirst({
          where: {
            discountCode,
            competitionId: { in: competitionIds },
          },
        }),
        ctx.prisma.runUpPrize.findFirst({
          where: {
            couponCode: discountCode,
          },
          include: {
            ticket: {
              include: {
                Competition: true,
                Order: true,
              },
            },
          },
        }),
      ]);

      if (!affiliation && !runUpPrize) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid discount code",
        });
      }

      let nextCompetition: Competition | null = null;
      if (runUpPrize) {
        if (runUpPrize.uses === runUpPrize.maxUsage) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount code has reached its limit of usage",
          });
        }
        nextCompetition = await ctx.prisma.competition.findFirst({
          where: {
            start_date: {
              gt: runUpPrize.ticket.Competition.start_date,
            },
          },
        });
        console.log(nextCompetition);

        if (
          !nextCompetition ||
          !input.competitionIds.includes(nextCompetition.id)
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount code is not valid for this competition",
          });
        }
      }

      return affiliation
        ? {
            ...affiliation,
            isRunUpPrize: false,
          }
        : {
            id: runUpPrize?.id || "",
            competitionId: nextCompetition?.id || "",
            discountRate:
              Number(runUpPrize?.ticket.Competition.run_up_prize) || 0,
            discountAmount: 0,
            discountCode: runUpPrize?.couponCode || "",
            isRunUpPrize: true,
          };
    }),
});

export const ChartsRouter = createTRPCRouter({
  getLastOrders: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.order.findMany({
          take: input || 10,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            status: {
              not: order_status.INCOMPLETE,
            },
          },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            totalPrice: true,
            status: true,
            paymentMethod: true,
            Ticket: {
              select: {
                Competition: {
                  select: {
                    name: true,
                    Watches: {
                      select: {
                        model: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        return data;
      } catch (e) {
        return [];
      }
    }),
  // get total per month for a year
  getperMonthforYear: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const date = input ? new Date(Number(input), 0, 2) : new Date();

      const data: Array<{
        yaer: number;
        month: number;
        confirmed_total: number;
        refunded_total: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                              YEAR(m.date) AS year,
                              MONTH(m.date) AS month,
                              IFNULL(SUM(CASE WHEN o.status = 'REFUNDED' THEN o.totalPrice END), 0) AS refunded_total,
                              IFNULL(SUM(CASE WHEN o.status = 'CONFIRMED' THEN o.totalPrice END), 0) AS confirmed_total
                              FROM 
                                (
                                  SELECT 
                                    MAKEDATE(YEAR(${date}), 1) + INTERVAL (MONTHS.month - 1) MONTH AS date
                                  FROM 
                                    (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 
                                    UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS MONTHS
                                ) AS m
                                LEFT JOIN \`order\` AS o 
                                  ON YEAR(o.createdAt) = YEAR(m.date) AND MONTH(o.createdAt) = MONTH(m.date) AND o.status IN ('REFUNDED', 'CONFIRMED') 
                                  AND o.createdAt >= DATE_SUB(${date}, INTERVAL 12 MONTH) AND o.createdAt <= ${date}
                              GROUP BY 
                                YEAR(m.date), MONTH(m.date)
                              ORDER BY 
                                year ASC, month ASC
                              `;
      const result = data.map((d) => ({
        ...d,
        month: Months[d.month - 1],
        confirmed_total: Number(d.confirmed_total).toFixed(2),
        refunded_total: Number(d.refunded_total).toFixed(2),
      }));
      return result;
    }),
  // get yearly earnings for current year and previous year
  yearlyEarnings: publicProcedure.query(async ({ ctx }) => {
    // get current year and previous year total earnings
    const input = new Date();

    const data:
      | Array<{ current_year: number; last_year: number }>
      | [{ current_year: number; last_year: number }] = await ctx.prisma
      .$queryRaw`SELECT
                    IFNULL(SUM(CASE WHEN YEAR(o.createdAt) = YEAR(${input}) THEN o.totalPrice END), 0) AS current_year,
                    IFNULL(SUM(CASE WHEN YEAR(o.createdAt) = (YEAR(${input}) - 1) THEN o.totalPrice END), 0) AS last_year
                  FROM 
                      \`order\` AS o
                  WHERE 
                    o.status = 'CONFIRMED' 
                    AND YEAR(o.createdAt) >= YEAR(${input}) - 1 
                    AND YEAR(o.createdAt) <= YEAR(${input})`;
    const result: { current_year: number; last_year: number } = {
      current_year: Number(data[0].current_year.toFixed(2)) || 0,
      last_year: Number(data[0].last_year.toFixed(2)) || 0,
    };
    return result;
  }),
  competEarnings: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.$queryRaw`
    SELECT
    c.id AS competitionId,
    c.name AS competitionName,
    COALESCE(SUM(ticket_price.price), 0) AS TotalOrderValue
  FROM
    \`competition\` AS c
  LEFT JOIN (
    SELECT
      t.competitionId,
      o.id AS orderId,
      (o.totalPrice / count_tickets.ticket_count) AS price
    FROM
      \`order\` AS o
    JOIN \`tickets\` AS t ON o.id = t.orderId
    JOIN (
      SELECT
        orderId,
        COUNT(*) as ticket_count
      FROM
        \`tickets\`
      GROUP BY
        orderId
    ) AS count_tickets ON o.id = count_tickets.orderId
    WHERE
      o.status = 'CONFIRMED'
  ) AS ticket_price ON c.id = ticket_price.competitionId
  GROUP BY
    c.id, c.name;
  `;
    return data as Array<{
      competitionId: string;
      competitionName: string;
      TotalOrderValue: number;
    }>;
  }),

  // get total tickets sold per day for a month
  ticketSoldPerDay: publicProcedure.query(async ({ ctx }) => {
    try {
      const date = new Date();
      const data: Array<{
        date: string;
        total_tickets: number;
        total_orders: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                                        DATE(t.createdAt) AS date,
                                        IFNULL(COUNT(t.id), 0) AS total_tickets
                                      FROM
                                        \`tickets\` AS t
                                      WHERE
                                        t.createdAt >= DATE_SUB(${date}, INTERVAL 30 DAY)
                                        AND t.createdAt <= ${date}
                                      GROUP BY
                                        DATE(t.createdAt)
                                      ORDER BY
                                        date ASC`;

      const ticketsThisMonth: Array<{ total_tickets: number }> = await ctx
        .prisma.$queryRaw`SELECT
                            IFNULL(COUNT(t.id), 0) AS total_tickets
                          FROM
                            \`tickets\` AS t
                          WHERE
                            t.createdAt >= DATE_SUB(${date}, INTERVAL 30 DAY)
                            AND t.createdAt <= ${date}`;
      const ticketsLastMonth: Array<{ total_tickets: number }> = await ctx
        .prisma.$queryRaw`SELECT 
                            IFNULL(COUNT(t.id), 0) AS total_tickets
                          FROM
                            \`tickets\` AS t
                          WHERE
                            t.createdAt >= DATE_SUB(${date}, INTERVAL 60 DAY)
                            AND t.createdAt <= DATE_SUB(${date}, INTERVAL 30 DAY)`;
      const result = data.map((d) => ({
        month: Months[date.getMonth()],
        day: new Date(d.date).getDate(),
        total_tickets: Number(d.total_tickets),
      }));
      return {
        totalTicketsThisMonth: Number(ticketsThisMonth[0]?.total_tickets) || 0,
        totalTicketsLastMonth: Number(ticketsLastMonth[0]?.total_tickets) || 0,
        data: result,
      };
    } catch (e) {
      console.log(e);
      return { data: [], totalTicketsThisMonth: 0, totalTicketsLastMonth: 0 };
    }
  }),
  clientsCountry: publicProcedure.query(async ({ ctx }) => {
    try {
      const data: Array<{
        country: string;
        total: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                                        IFNULL(u.country, 'Unknown') AS country,
                                        COUNT(u.id) AS total
                                      FROM 
                                        \`order\` AS u
                                      GROUP BY 
                                        u.country
                                      ORDER BY 
                                        total DESC
                                      LIMIT 10`;
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }),
});

export const RunUpPrizeRouter = createTRPCRouter({
  addRunUpPrizeWinner: publicProcedure
    .input(z.object({ ticketId: z.string(), compId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existTicket = await ctx.prisma.ticket.findUnique({
          where: {
            id: input.ticketId,
          },
          include: {
            Order: true,
            Competition: true,
          },
        });
        if (!existTicket) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Ticket not found",
          });
        }
        if (existTicket.competitionId !== input.compId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Ticket does not belong to this competition",
          });
        }
        const winnersCount = await ctx.prisma.runUpPrize.count({
          where: {
            ticketId: input.ticketId,
          },
        });
        if (winnersCount >= 4) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have reached the maximum number of winners",
          });
        }
        const addedPrize = await ctx.prisma.runUpPrize.create({
          data: {
            couponCode: await discountCodeGenerator(ctx.prisma),
            ticketId: input.ticketId,
          },
        });
        await Transporter.sendMail({
          from: "noreply@winuwatch.uk",
          cc: "admin@winuwatch.uk",
          to: existTicket.Order?.email,
          subject: `Run Up Prize Winner - Winuwatch #${
            existTicket.Order?.id || "000000"
          }`,
          html: RunerUp2({
            runUpPrize: existTicket,
            addedPrize: addedPrize,
          }),
          // `You have won a run up prize for Winuwatch #${
          //   existTicket.Order?.id
          // }. Your coupon code is <b>${
          //   addedPrize.couponCode
          // }</b>. Please use this coupon code for the next competition to get a discount of £${
          //   existTicket.Competition?.run_up_prize?.toString() || "0"
          // }.`,
        });
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Runner up ticket already registered",
            });
          }
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            cause: e,
          });
        }
      }
    }),
  resendEmail: publicProcedure
    .input(z.string().nonempty())
    .mutation(async ({ ctx, input }) => {
      try {
        const runUpPrize = await ctx.prisma.runUpPrize.findFirst({
          where: { id: input },
          include: {
            ticket: {
              include: {
                Order: true,
                Competition: true,
              },
            },
          },
        });
        if (!runUpPrize) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Run up prize not found",
          });
        }
        await Transporter.sendMail({
          from: "noreply@winuwatch.uk",
          cc: "admin@winuwatch.uk",
          to: runUpPrize.ticket.Order?.email,
          subject: `Run Up Prize Winner - Winuwatch #${
            runUpPrize.ticket.Order?.id || "000000"
          }`,
          html: RunerUp({
            runUpPrize: runUpPrize,
          }),
          //            `You have won a run up prize for Winuwatch #${
          //   runUpPrize.ticket.Order?.id
          // }. Your coupon code is <b>${
          //   runUpPrize.couponCode
          // }</b>. Please use this coupon code for the next competition to get a discount of £${
          //   runUpPrize.ticket.Competition?.run_up_prize?.toString() || "0"
          // }.`,
        });
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            cause: e,
          });
        }
      }
    }),
  getAll: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      if (!input) return [];
      return await ctx.prisma.runUpPrize.findMany({
        where: { ticket: { Competition: { id: input } } },
        include: {
          ticket: {
            include: {
              Order: true,
              Competition: true,
            },
          },
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        cause: e,
      });
    }
  }),
  updateRunUpPrizeWinner: publicProcedure
    .input(z.object({ id: z.string(), ticketId: z.string().nonempty() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.runUpPrize.update({
          where: { id: input.id },
          data: { ticketId: input.ticketId },
        });
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: e,
        });
      }
    }),
  deleteRunUpPrizeWinner: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.runUpPrize.delete({ where: { id: input } });
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: e,
        });
      }
    }),
});
