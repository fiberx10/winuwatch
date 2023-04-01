import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus } from "@prisma/client";
import { CreateOrderSchema, getBaseUrl } from "@/utils";
import {} from "@/utils/zodSchemas";
import _stripe from "stripe";
import { env } from "@/env.mjs";

const stripe = new _stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});



export const OrderRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.array(z.string()).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.order.findMany({
        where: {
          id: input ? { in: input } : {},
        },
      });
    }),
});

export const StripeRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure

    .input(
      z.object({
        email: z.string().email(),
        address: z.string(),
        comps: z.array(
          z.object({
            compID: z.string(),
            quantity: z.number().min(1),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: (
          await ctx.prisma.competition.findMany({
            include: {
              Watches: {
                include: {
                  images_url: true,
                },
              },
            },
          })
        )
          .filter((comp) => input.comps.some((item) => item.compID === comp.id))
          .map((comp) => ({
            //customer_email : input.email,

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
              input.comps.find((item) => item.compID === comp.id)?.quantity ||
              0,
          })),
        success_url: `${getBaseUrl()}/stripe?payment=success`,
        cancel_url: `${getBaseUrl()}/CheckoutPage`,
      });

      // if the session was created successfully
      // insert the info in the database
      // await prisma...
    }),
});
const MutateCompSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  location: z.string().optional(),
  price: z.number().optional(),
  max_space_in_final_draw: z.number().optional(),
  max_watch_number: z.number().optional(),
  run_up_prize: z.string().optional(),
  watchesId: z.string().optional(),
  total_tickets: z.number().optional(),
  ticket_price: z.number().optional(),
  status: z.enum([
    CompetitionStatus.ACTIVE,
    CompetitionStatus.COMPLETED,
    CompetitionStatus.NOT_ACTIVE,
  ]),
  drawing_date: z.date().optional(),
  remaining_tickets: z.number().optional(),
});
export const CompetitionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()).optional(),
        status: z
          .enum([
            CompetitionStatus.ACTIVE,
            CompetitionStatus.NOT_ACTIVE,
            CompetitionStatus.COMPLETED,
          ])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return (
        await ctx.prisma.competition.findMany({
          where: {
            status: input.status,
            id: {
              in: input.ids,
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
      ).map((comp) => ({
        ...comp,
        Watches: {
          ...comp.Watches,
          images_url: comp.Watches.images_url.map((image) => image.url),
        },
      }));
    }),
  getEverything: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.competition.findMany({
      include: {
        Watches: true,
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
    const data = await ctx.prisma.competition.findUnique({
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
    });
    if (!data) {
      throw new Error("Competition not found");
    }
    return {
      ...data,
      Watches: {
        ...data.Watches,
        images_url: data.Watches.images_url.map((image) => image.url),
      },
    };
  }),
  updateOne: publicProcedure
    .input(MutateCompSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.competition.update({
        data: {
          ...data,
        },
        where: {
          id,
        },
      });
    }),

  add: publicProcedure
    .input(MutateCompSchema.omit({ id: true }).required())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.competition.create({
        data: {
          ...input,
        },
      });
    }),
});

const MutateWatchSchema = z.object({
  id: z.string(),
  brand: z.string().optional(),
  model: z.string().optional(),
  reference_number: z.string().optional(),
  movement: z.string().optional(),
  Bracelet_material: z.string().optional(),
  year_of_manifacture: z.number().optional(),
  caliber_grear: z.number().optional(),
  number_of_stones: z.number().optional(),
  glass: z.string().optional(),
  bezel_material: z.string().optional(),
  has_box: z.boolean().optional(),
  has_certificate: z.boolean().optional(),
  condition: z.string().optional(),
  images_url: z.array(z.string()).optional(),
});
export const WatchesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.watches.findMany({
      include: {
        images_url: true,
      },
    })).map((watch) => ({
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
    return await ctx.prisma.watches.delete({
      where: {
        id: input,
      },
    });
  }),
  add: publicProcedure
    .input(MutateWatchSchema.omit({
      id: true,
    }).required())
    .mutation(async ({ ctx, input }) => {
      const {images_url, ...data } = input;
      return await ctx.prisma.watches.create({
        data: {
          ...input,
          images_url: {
            create: input.images_url.map((url) => ({ url })),
          },
        },
      });
    }),

  update: publicProcedure
    .input(MutateWatchSchema)
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

export const PaymentRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),

  create: publicProcedure
    .input(CreateOrderSchema)
    .mutation(({ ctx, input }) => {
      const { comp, ...data } = input;

      //TODO: Create Order
      console.log(input);

      return {
        success: true,
        error: "no error",
      };

      /*return ctx.prisma.order.create({
      data: {
        name: input.name,
      },
    });
      return {
        status : "success",
        error : null
      }
    }
    ),*/
    }),
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
      answers: Question.answers.map(({ answer }) => answer) || [],
    };
  }),
});
