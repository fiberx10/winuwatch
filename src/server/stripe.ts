// This file will contain the trpc handler for the payment request.
import { prisma } from "@/server/db";
import { z } from "zod";
import { env } from "../env.mjs";
import StripeClient from "stripe";
const {STRIPE_SECRET_KEY} = env;

const Stripe = new StripeClient(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
export const stripeHandler =  () => {

}
