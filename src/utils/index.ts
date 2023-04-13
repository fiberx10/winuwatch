import { z } from "zod";
import { OrderSchema } from "./zodSchemas";
import { useRouter } from "next/router";
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
const DEFAULTLOCAL = "en-UK";
export const Formater = (value: number | bigint) =>
  new Intl.NumberFormat(DEFAULTLOCAL, {
    style: "currency",
    currency: "GBP",
  }).format(value);

export const DateFormater = (
  value: Date,
  local: string = useRouter().locale || DEFAULTLOCAL
  ) =>
  new Intl.DateTimeFormat(local, {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  })
    .format(value)
    .replace("BST", "LONDON TIME");

export const MAX_TICKETS = 25;
export const TICKETREDUC = [
  ...new Array(4).fill(0).map((_, i) => ({
    value: i + 1,
    reduction: 0.0,
  })),
  {
    value: 5,
    reduction: 0.1,
  },
  ...new Array(4).fill(0).map((_, i) => ({
    value: i + 6,
    reduction: 0.0,
  })),
  {
    value: 10,
    reduction: 0.15,
  },
  {
    value: 15,
    reduction: 0,
  },
  {
    value: 20,
    reduction: 0.2,
  },
  {
    value: 25,
    reduction: 0,
  },
];
