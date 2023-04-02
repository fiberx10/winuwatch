import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus, OrderStatus } from "@prisma/client";
import { getBaseUrl, CreateOrderSchema } from "@/utils";
import { WatchesSchema, CompetitionSchema } from "@/utils/zodSchemas";
import { env } from "@/env.mjs";
import stripe from "stripe";

const Stripe = new stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
export const OrderRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.array(z.string()).optional()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: {
          id: input ? { in: input } : {},
        },
      })
  ),
  createStripe: publicProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { payment_intent, url } = await Stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: (
            await ctx.prisma.competition.findMany({
              where: {
                id: {
                  in: input.comps.map(({ compID }) => compID),
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
                      ?.quantity || 0,
                }
              : {}
          ),
          success_url: `${getBaseUrl()}/stripe?payment=success`,
          cancel_url: `${getBaseUrl()}/CheckoutPage`,
        });
        const { id } = await ctx.prisma.order.create({
          data: {
            ...input,
            status: OrderStatus.PENDING,
            paymentId:
              typeof payment_intent === "string" ? payment_intent : undefined,
            Ticket: {
              createMany: {
                data: input.comps.map((item) => ({
                  competitionId: item.compID,
                })),
              },
            },
          },
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
      return await ctx.prisma.order.create({
        data: {
          ...input,
          status: OrderStatus.CONFIRMED,
          Ticket: {
            createMany: {
              data: input.comps.map((item) => ({
                competitionId: item.compID,
              })),
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
      const { id, ...data } = input;
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
      return await ctx.prisma.competition.findMany({
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
      });
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
