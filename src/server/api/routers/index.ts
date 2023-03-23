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
  add : publicProcedure
    .input(z.object({
      name: z.string(),
        start_date : z.string(),
        end_date : z.string(),
        remaining_tickets : z.number(),
        drawing_date : z.string(),
        total_tickets : z.number(),
        ticket_price : z.number(),
        location : z.string(),
        second_reward : z.string(),
        status : z.string(),
        winner : z.string(),
        watchesId : z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.create({
        data: {
            drawing_date: input.drawing_date,
            end_date: input.end_date,
            location: input.location,
            name: input.name,
            remaining_tickets: input.remaining_tickets,
            second_reward: input.second_reward,
            start_date: input.start_date,
            status: input.status,
            ticket_price: input.ticket_price,
            total_tickets: input.total_tickets,
            watchesId: input.watchesId,
            winner: input.winner,
        },
      });
    }),
  update : publicProcedure
    .input(z.object({
        id : z.string(),
        name: z.string(),
        start_date : z.string(),
        end_date : z.string(),
        remaining_tickets : z.number(),
        drawing_date : z.string(),
        total_tickets : z.number(),
        ticket_price : z.number(),
        location : z.string(),
        second_reward : z.string(),
        status : z.string(),
        winner : z.string(),
        watchesId : z.string(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.prisma.watches.update({
            data : {
            name: input.name,
            start_date : input.start_date,
            end_date : input.end_date,
            remaining_tickets : input.remaining_tickets,
            drawing_date : input.drawing_date,
            total_tickets : input.total_tickets,
            ticket_price : input.ticket_price,
            location : input.location,
            second_reward : input.second_reward,
            status : input.status,
            winner : input.winner,
            watchesId : input.watchesId,
            },
            where : {
                id : input.id
            }
        })
    }),
  delete : publicProcedure
    .input(z.object({
        id : z.string(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.prisma.watches.delete({
            where : {
                id : input.id
            }
        })
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
      ImageURL : z.array(z.string()),
      owner_ref : z.string(),
      condition : z.string(),
      years : z.number(),
      movement : z.string(),
      case_size : z.string(),
      dail : z.string(),
      case_material : z.string(),
      bracelet_material : z.string(),
      water_proof : z.string(),
      box : z.string(),
      papers : z.string(),
      price : z.number(),

    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.create({
        data: {
          name: input.name,
          imageURL : input.ImageURL,
          owner_ref : input.owner_ref,
          years : input.years,
          movement : input.movement,
          case_size : input.case_size,
          dail : input.dail,
          case_material : input.case_material,
          bracelet_material : input.bracelet_material,
          water_proof : input.water_proof,
          box : input.box,
          papers : input.papers,
          price : input.price,
        },
      });
    }),
  update : publicProcedure
    .input(z.object({
        id : z.string(),
        name: z.string(),
        ImageURL : z.array(z.string()),
        owner_ref : z.string(),
        condition : z.string(),
        years : z.number(),
        movement : z.string(),
        case_size : z.string(),
        dail : z.string(),
        case_material : z.string(),
        bracelet_material : z.string(),
        water_proof : z.string(),
        box : z.string(),
        papers : z.string(),
        price : z.number(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.prisma.watches.update({
            data : {
            name: input.name,
            imageURL : input.ImageURL,
            owner_ref : input.owner_ref,
            years : input.years,
            movement : input.movement,
            case_size : input.case_size,
            dail : input.dail,
            case_material : input.case_material,
            bracelet_material : input.bracelet_material,
            water_proof : input.water_proof,
            box : input.box,
            papers : input.papers,
            price : input.price,
            }
        });
    }),
  delete : publicProcedure
    .input(z.object({
        id : z.string(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.prisma.watches.delete({
            where : {
                id : input.id
            }
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