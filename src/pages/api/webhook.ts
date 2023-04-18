import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import rawBody from "raw-body";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import Email from "@/components/emails";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const Transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const body = await rawBody(request);
    const signature = request.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_ENDPOINT_SECRET
      );
    } catch (error) {
      return (
        console.error(`⚠️ Webhook signature verification failed.`, error),
        response.status(400).send(`Webhook Error`)
      );
    }
    const { id } = event.data.object as Stripe.PaymentIntent;
    switch (event.type) {
      /*case "checkout.session.payment_failed" || "checkout.session.cancelled" :
				console.log("id: ",id);
				break;
				*/
      case "checkout.session.completed":
        if (
          await prisma.order.update({
            where: {
              paymentId: id,
            },
            data: {
              status: "CONFIRMED",
            },
          })
        ) {
          return response.json({});
        }
        console.error("error: checkout.session.completed\t", id);
        break;

        /*
						await prisma.order.updateMany({
						  where: {
							//@ts-ignore
							intentId: paymentIntentSucceeded.id as string,
						  },
						  //@ts-ignore
						  data: {
							//@ts-ignore
							status: "CONFIRMED",
						  },
						});
						const dataUp = await prisma.order.findMany({
						  where: {
							//@ts-ignore
							intentId: paymentIntentSucceeded.id as string,
						  },
						  include: {
							Ticket: true,
							Competition: {
							  include: {
								Watches: {
								  include: {
									images_url: true,
								  },
								},
							  },
							},
						  },
						});
				
						await Transporter.sendMail({
						  from: "noreply@winuwatch.uk",
						  to: dataUp.email,
						  subject: `Order Confirmation - Winuwatch #${dataUp?.id || "000000"}`,
						  html: Email(dataUp),
						});*/
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    //console.log(event.data);
    return response.json({});
  }
};
