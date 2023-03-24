import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export * from "./api";
export const CreateOrderSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  country: z.string(),
  address: z.string(),
  town: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  date: z.date().default(new Date()),
  paymentMethod: z.enum([PaymentMethod.PAYPAL, PaymentMethod.STRIPE]),
  totalPrice: z.number(),
  checkedEmail: z.boolean().default(false),
  checkedPhone: z.boolean().default(false),
  checkedSMS: z.boolean().default(false),
  watchids: z.array(z.string()),
});

export const Formater = (value: number | bigint) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
