/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { env } from "@/env.mjs";
import { Formater, api } from "@/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const testData = {
  amount: 100,
  currency: "usd",
};

export default function Stripe() {
  const {
    query: { payment },
  } = useRouter();

  // if payment is success or cancel show the message
  if (payment === "success") {
    return <h1>Payment success</h1>;
  }
  if (payment === "cancel") {
    return <h1>Payment cancel</h1>;
  }

  // create the checkout session fron the api

  const handlePayClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe.js hasn't loaded yet");
      return;
    }

    const sessionId = await api.Stripe.createCheckoutSession({
      input: testData,
    });
    console.log(sessionId);

    const result = await stripe.redirectToCheckout({ sessionId: sessionId });
    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <h1>Stripe</h1>
      <form onSubmit={(e) => handlePayClick(e)}>
        <br />
        <button
          type="submit"
          style={{
            width: "200px",
            padding: "12px 24px",
          }}>
          Pay
        </button>
      </form>
    </Elements>
  );
}
