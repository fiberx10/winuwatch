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
const LOCAL = "en-UK";
export const Formater = (value: number | bigint) =>
  new Intl.NumberFormat(LOCAL, {
    style: "currency",
    currency: "GBP",
  }).format(value);

export const DateFormater = (value: Date) =>
  new Intl.DateTimeFormat(LOCAL, {
    dateStyle: "full",
    timeStyle: "long",
  }).format(value);
