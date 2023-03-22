import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const CompetitionRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.competition.findMany();
  }),
  byID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.competition.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});

export const WatchesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.watches.findMany();
  }),
  byID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.watches.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  add : publicProcedure
    .input(z.object({ 
      name: z.string(),
      price: z.number(),
      ImageURL : z.array(z.string())
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.create({
        data: {
          name: input.name,
          price: input.price,
          imageURL : input.ImageURL
        },
      });
    }
  ),
});


export const PaymentRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),
  /*
  create : publicProcedure
    .input(z.object({
      name : z.string(),

    }))
    .mutation(({ ctx, input }) => {
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
})