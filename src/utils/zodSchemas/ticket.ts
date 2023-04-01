import * as z from "zod";

export const TicketSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  competitionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
