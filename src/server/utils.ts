import stripe from "stripe";
import { env } from "@/env.mjs";


import nodemailer from "nodemailer";

export const Transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@winuwatch.uk",
    pass: "Password1!",
  },
});




export const Stripe = new stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});