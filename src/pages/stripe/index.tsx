import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils";

export default function Stripe() {
  const testData = {
    amount: 100,
    currency: "usd",
  };

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
  if (payment === "error") {
    return <h1>Payment error</h1>;
  }
  // create the checkout session from the api
  const { mutate: createCheckoutSession, isLoading } =
    api.Stripe.createCheckoutSession.useMutation({
      onSuccess: ({ url }) => {
        console.log(url);
        // redirect to the stripe checkout page url
        window.location.href = url;
      },
    });

  return (
    <>
      <h1>Stripe</h1>
      <br />
      <button
        type="submit"
        style={{
          width: "200px",
          padding: "12px 24px",
        }}
        onClick={() =>
          createCheckoutSession({
            amount: testData.amount,
            currency: testData.currency,
          })
        }>
        {isLoading ? "Loading..." : "Pay"}
      </button>
    </>
  );
}
