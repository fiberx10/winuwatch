import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import rawBody from "raw-body";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// eslint-disable-next-line import/no-anonymous-default-export
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
    console.log("id : ", id);

    switch (event.type) {
      //PAYMENT FAILED OR CANCELLED
      // case "payment_intent.payment_failed":
      //   const checkoutSessionFailed = event.data.object as {
      //     id: string;
      //     payment_intent: string;
      //   };
      //   console.log("checkoutsessionFailed: ", checkoutSessionFailed);

      //   if (
      //     await prisma.order.updateMany({
      //       where: {
      //         paymentId: checkoutSessionFailed.id,
      //       },
      //       data: {
      //         status: "CANCELLED",
      //       },
      //     })
      //   ) {
      //     return response.json({});
      //   }
      //   break;
      // PAYMENT SUCCEEDED
      case "payment_intent.succeeded":
        const checkoutSessionPayCompleted = event.data.object as {
          id: string;
          payment_intent: string;
        };
        console.log("checkoutsessionCompleted: ", checkoutSessionPayCompleted);

        if (
          await prisma.order.updateMany({
            where: {
              paymentId: checkoutSessionPayCompleted.id,
            },
            data: {
              intentId: checkoutSessionPayCompleted.payment_intent,
              status: "CONFIRMED",
            },
          })
        ) {
          return response.json({});
        }
        break;
      // CHECKOUT IS COMPLETE
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object as {
          id: string;
          payment_intent: string;
        };
        console.log("checkoutsessionCompleted: ", checkoutSessionCompleted);

        if (
          await prisma.order.updateMany({
            where: {
              paymentId: checkoutSessionCompleted.id,
            },
            data: {
              intentId: checkoutSessionCompleted.payment_intent,
              status: "CONFIRMED",
            },
          })
        ) {
          return response.json({});
        }
        break;
      //CHECKOUT IS CANCELLED
      case "payment_intent.canceled":
        const checkoutSessionCancelled = event.data.object as {
          id: string;
          payment_intent: string;
        };
        console.log("checkoutsessionCancelled: ", checkoutSessionCancelled);

        if (
          await prisma.order.updateMany({
            where: {
              paymentId: checkoutSessionCancelled.id,
            },
            data: {
              status: "CANCELLED",
            },
          })
        ) {
          return response.json({});
        }
        break;

      //REFUNDED
      // case "charge.refunded":
      //   const chargeREFUNDED = event.data.object as {
      //     id: string;
      //     payment_intent: string;
      //   };
      //   console.log("checkoutsessionCancelled: ", chargeREFUNDED);

      //   if (
      //     await prisma.order.updateMany({
      //       where: {
      //         paymentId: chargeREFUNDED.id,
      //       },
      //       data: {
      //         status: "REFUNDED",
      //       },
      //     })
      //   ) {
      //     return response.json({});
      //   }
      //   break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    //console.log(event.data);
    return response.json({});
  }
};
