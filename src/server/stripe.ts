// This file will contain the trpc handler for the payment request.
import { prisma } from "@/server/db";
import { z } from "zod";
import { env } from "../env.mjs";

const {STRIPE_SECRET_KEY} = env;

export const stripeHandler =  () => {
    
}
