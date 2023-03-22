import { z } from "zod";

export const PaypalID = z.string().parse(process.env.NEXT_PUBLIC_PAYPAL_ID);

export const BackendLink = z
  .string()
  .parse(process.env.NEXT_PUBLIC_BACKEND_URL);
