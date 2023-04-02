import { z } from "zod";
import { OrderSchema } from "./zodSchemas";
export * from "./api";

export const CreateOrderSchema = OrderSchema.extend({
  comps: z.array(
    z.object({
      compID: z.string(),
      number_tickets: z.number().default(1),
      price_per_ticket: z.number(),
    })
  ),
}).omit({
  status: true,
  id: true,
});

export const Formater = (value: number | bigint) =>
  new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  }).format(value);
