import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus, OrderStatus } from "@prisma/client";
import { getBaseUrl, CreateOrderSchema } from "@/utils";
import { WatchesSchema, CompetitionSchema } from "@/utils/zodSchemas";
import { env } from "@/env.mjs";
import Email from "@/components/emails";
import stripe from "stripe";
import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@winuwatch.uk",
    pass: "Password1!",
  },
});
const Stripe = new stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const WinnersRouter = createTRPCRouter({
  getCSV: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const competition = await ctx.prisma.competition.findUnique({
      where: {
        id: input,
      },
      include: {
        Order: {
          include: {
            Ticket: true,
          },
        },
      },
    });
    if (!competition) {
      throw new Error("Competition not found");
    }
    const { Order } = competition;
    const csv = Order.map((order) => ({
      Full_Name: `${order.first_name} ${order.last_name}`,
      Order_ID: order.id,
      competionName: competition.name,
      competitionid: competition.id,
      Number_of_Tickets: order.Ticket.length,
      Ticket_ID: order.Ticket.map((ticket) => ticket.id).join(", "),
      Total_Price: order.totalPrice,
      Price_per_Ticket: order.totalPrice / order.Ticket.length,
    }));
    return csv;
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
  confirmWinner: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //based on the ticket ID we should be able to close the competition and send the winner an email
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input,
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
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      /*
      const { Order, Competition } = ticket;
      const { Watches } = Competition;
      const { email } = Order;
      */
      return void 0; //TODO : Send email
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

export const OrderRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.array(z.string()).optional()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: {
          Competition: {
            some: {
              id: {
                in: input,
              },
            },
          },
        },
        include: {
          Ticket: true,
        },
      })
  ),
  getOrder: publicProcedure.input(z.string()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: input
          ? {
              id: input,
            }
          : {},
        include: {
          Ticket: true,
        },
      })
  ),
  createStripe: publicProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { comps, ...data } = input;
        const { id } = await ctx.prisma.order.create({
          data: {
            ...data,
            status: OrderStatus.PENDING,
            Competition: {
              connect: {
                id: comps
                  .map(({ compID }) => compID)
                  .filter(
                    (value, index, self) => self.indexOf(value) === index
                  )[0], //TODO: FIx this later
              },
            },
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
        const { payment_intent, url } = await Stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: data.email,
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
                    //automatic_tax : true,
                    currency: "gbp",
                    product_data: {
                      name: comp.Watches.model + comp.Watches.movement,
                      //images: [`${getBaseUrl()+comp.Watches.images_url[0]}`],
                    },
                    unit_amount: Math.floor(comp.ticket_price * 100), // in cents
                  },
                  quantity:
                    input.comps.find((item) => item.compID === comp.id)
                      ?.number_tickets || 0,
                }
              : {}
          ),
          success_url: `${getBaseUrl()}/Confirmation/${id}`,
          cancel_url: `${getBaseUrl()}/CheckoutPage`,
        });

        const dataUp = await ctx.prisma.order.update({
          where: {
            id,
          },
          data: {
            paymentId:
              typeof payment_intent === "string" ? payment_intent : undefined,
          },
          include: {
            Ticket: true,
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
        await Transporter.sendMail({
          from: "noreply@winuwatch.uk",
          to: data.email,
          subject: `Order Confirmation - Winuwatch #${dataUp?.id || "000000"}`,
          html: Email(dataUp),
        });

        return {
          id,
          payment_intent,
          url,
        };
      } catch (e) {
        console.error(e);
        return {
          error: "Error in creating the order",
          url: null,
        };
      }
    }),
  create: publicProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { comps, ...data } = input;
      return await ctx.prisma.order.create({
        data: {
          ...data,
          status: OrderStatus.CONFIRMED,
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
        status: z.nativeEnum(OrderStatus),
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
      return Data[1].map((comp) => ({
        ...comp,
        remaining_tickets:
          comp.total_tickets -
          (Data[0].find((item) => item.id === comp.id)?._count?.Ticket || 0),
      }));
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
    return (
      (await ctx.prisma.competition.findUnique({
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
      })) ?? undefined
    );
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

function shuffleArray(array: (string | undefined)[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.filter((item): item is string => typeof item === "string");
}

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
      answers: shuffleArray(Question.answers.map(({ answer }) => answer)) || [],
    };
  }),
});
