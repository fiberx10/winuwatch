// stripe provider :
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { env } from "@/env.mjs";

// stripe public key
const stripePromis = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// provider
export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Elements stripe={stripePromis}>{children}</Elements>;
}
