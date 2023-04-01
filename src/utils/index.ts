import { z } from "zod";
import {OrderSchema} from "./zodSchemas"
export * from "./api";

export const CreateOrderSchema =  OrderSchema.extend({
  comps: z.array(
    z.object({
      compID: z.string(),
      quantity: z.number().min(1),
    })
  ),
}).omit({
  status: true,
  id: true,
})

export const Formater = (value: number | bigint) =>
  new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  }).format(value);
