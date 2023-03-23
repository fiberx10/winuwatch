import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus } from "@prisma/client";

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

  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        start_date: z.date(),
        end_date: z.date(),
        drawing_date : z.date(),
        remaining_tickets : z.number(),
        total_tickets : z.number(),
        ticket_price : z.number(),
        location : z.string(),
        second_reward : z.string(),
        price : z.number(),
        status : z.enum([CompetitionStatus.ACTIVE, CompetitionStatus.NOT_ACTIVE, CompetitionStatus.COMPLETED]),
        winner : z.string().optional(),
        watchesId : z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.competition.create({
        data: input,
      });
    }
  ),


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