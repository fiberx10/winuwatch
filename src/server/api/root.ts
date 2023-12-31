import { createTRPCRouter } from "@/server/api/trpc";
import {
  WatchesRouter,
  CompetitionRouter,
  QuestionRouter,
  OrderRouter,
  TicketsRouter,
  WinnersRouter,
  AuthRouter,
  AffiliationRouter,
  ChartsRouter,
  RunUpPrizeRouter,
} from "@/server/api/routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  Competition: CompetitionRouter,
  Watches: WatchesRouter,
  Order: OrderRouter,
  Question: QuestionRouter,
  Tickets: TicketsRouter,
  DashAuth: AuthRouter,
  Winners: WinnersRouter,
  Affiliation: AffiliationRouter,
  Charts: ChartsRouter,
  RunUpPrize: RunUpPrizeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
