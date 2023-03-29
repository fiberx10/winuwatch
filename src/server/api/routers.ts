import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus } from "@prisma/client";
import { CreateOrderSchema, getBaseUrl } from "@/utils";

import _stripe from "stripe";
import { env } from "@/env.mjs";

const stripe = new _stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// zode input validation
const orderInput = z.object({
  // first_name: z.string(),
  // last_name: z.string(),
  // country: z.string(),
  // address: z.string(),
  // town: z.string(),
  // zip: z.string(),
  // phone: z.string(),
  // email: z.string(),
  // paymentMethod: z.enum(["PAYPAL", "STRIPE"]),
  totalPrice: z.number(),
  // watchids: z.array(z.string()),
  // date: z.date().optional(),
  // checkedEmail: z.boolean().optional(),
  // checkedPhone: z.boolean().optional(),
  // checkedSMS: z.boolean().optional(),
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
              Watches: true,
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
            Watches: true,
          },
        })
      ).map((comp) => ({
        ...comp.Watches,
        ...comp,
      }));
    }),
  getEverything: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.competition.findMany({
      include: {
        Watches: true,
      },
    });
  }),
  byID: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.competition.findUnique({
      where: {
        id: input,
      },
      include: {
        Watches: true,
      },
    });
  }),
  updateOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z
          .enum([
            CompetitionStatus.ACTIVE,
            CompetitionStatus.NOT_ACTIVE,
            CompetitionStatus.COMPLETED,
          ])
          .optional(),
      })
    )
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
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.watches.findMany()),
  byID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.watches.findUnique({
        where: {
          id: input.id,
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
    .input(MutateWatchSchema.omit({ id: true }).required())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.watches.create({
        data: {
          ...input,
        },
      });
    }),

  update: publicProcedure
    .input(MutateWatchSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.watches.update({
        data,
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
      const { watchids, ...data } = input;

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
    const Questions = await ctx.prisma.question.findMany();
    const randomIndex = Math.floor(Math.random() * Questions.length);
    if (randomIndex < Questions.length && randomIndex >= 0) {
      return Questions[randomIndex];
    }
    return Questions[0];
  }),
});
