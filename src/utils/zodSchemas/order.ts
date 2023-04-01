import * as z from "zod"
import { OrderStatus, PaymentMethod } from "@prisma/client"

export const OrderSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  country: z.string(),
  address: z.string(),
  town: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  date: z.date(),
  status: z.nativeEnum(OrderStatus),
  paymentMethod: z.nativeEnum(PaymentMethod),
  checkedEmail: z.boolean(),
  checkedTerms: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalPrice: z.number(),
})
