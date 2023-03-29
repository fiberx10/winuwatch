import React, { useState } from "react";
import styles from "@/styles/Checkout.module.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";
// import { useForm, type SubmitHandler } from "react-hook-form";
import { api, type RouterInputs, Formater } from "@/utils";
import { useCart } from "./Store";

// import { CreateOrderSchema } from "@/utils/Schema";
//import { zodResolver } from '@hookform/resolvers/zod';

// const IsLegal = (Birthdate?: Date) => {
//   const LegalAge = 18;
//   const now = new Date();
//   const date = Birthdate || new Date();
//   return (
//     new Date(
//       now.getFullYear() - LegalAge,
//       now.getMonth(),
//       now.getDate()
//     ).getTime() >= date.getTime()
//   );
// };
import "@/styles/Checkout.module.css";
import Image from "next/image";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";

type CreatePayemtnTYpe = RouterInputs["Payment"]["create"];

const CheckoutComp = () => {
  //
  const router = useRouter();

  const Hook = api.Stripe.createCheckoutSession.useMutation();
  const { competitions, cardDetails, reset, addComp, removeComp, updateComp } =
    useCart();
  const [OrderData, setORderData] = useState<CreatePayemtnTYpe | undefined>();
  const { mutateAsync: createOrder } = api.Payment.create.useMutation();

  const { data: items } = api.Competition.getAll.useQuery({
    ids: competitions.map((comp) => comp.compID),
  });
  const [payment, setPayment] = useState<"STRIPE" | "PAYPAL">("STRIPE");
  const IsLegal = (Birthdate?: Date) => {
    const LegalAge = 18;
    const now = new Date();
    const date = Birthdate || new Date();
    return (
      new Date(
        now.getFullYear() - LegalAge,
        now.getMonth(),
        now.getDate()
      ).getTime() >= date.getTime()
    );
  };
  const [error, setError] = useState<string | undefined>();
  const { totalCost, Number_of_item } = cardDetails();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from submitting normally
    console.log("Form submitted:", formState);
    if (OrderData) {
      const { success, error } = await createOrder(OrderData);
      if (!success) setError(error);
    }
  };
  const VAT = 0.2;

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   getValues,
  // } = useForm<CreatePayemtnTYpe>({
  //   defaultValues: {
  //     date: new Date(),
  //     paymentMethod: "STRIPE",
  //     checkedEmail: false,
  //     checkedSMS: false,
  //     watchids: competitions.map((comp) => comp.compID) || [],
  //   },
  // });
  const [formState, setFormState] = useState<{
    [key: string]: string | number | Date;
  }>({ payment: "PAYPAL" });

  const initialValues: CreatePayemtnTYpe = {
    first_name: "Test",
    last_name: "",
    country: "",
    address: "",
    town: "",
    zip: "",
    phone: "",
    email: "",
    paymentMethod: "STRIPE",
    totalPrice: totalCost,
    watchids: [""],
    date: undefined,
    checkedEmail: false,
    checkedPhone: false,
    checkedSMS: false,
  };
  return (
    <div className={styles.CheckoutMain}>
      {items && (
        <div className={styles.formMain}>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              console.log("Form submitted:", values);
              if (OrderData) {
                const { success, error } = await createOrder(OrderData);
                if (!success) setError(error);
              }
              actions.setSubmitting(false);
            }}
          >
            <Form>
              <div className={styles.CheckoutLeft}>
                <div className={styles.leftFormItem}>
                  <h1>Billing Information</h1>
                  <div className={styles.CheckoutForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="firstName">First Name</label>
                        <Field
                          required
                          id="first_name"
                          type="text"
                          name="first_name"
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="lastName">Last Name</label>
                        <Field
                          required
                          id="last_name"
                          type={"text"}
                          name="last_name"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="Country">Country/Region</label>
                        <Field
                          required
                          id="country"
                          type="text"
                          name="country"
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="lastName">Address</label>
                        <Field
                          required
                          id="address"
                          type="text"
                          name="address"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="Town">Town/City</label>
                        <Field required id="town" type="text" name="town" />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="lastName">ZIP</label>
                        <Field
                          required
                          id="zip"
                          name="zip"
                          type="number"
                          min={0}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="Phone">Phone</label>
                        <Field required id="phone" type="text" name="phone" />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="Email">Email</label>
                        <Field required id="email" name="email" type="Email" />
                      </div>
                    </div>
                    <div className={styles.FinalRow}>
                      <div className={styles.formField}>
                        <label htmlFor="Date">Date of birth</label>
                        <Field
                          max="2005-01-01"
                          required
                          type={"date"}
                          name="date"
                        />
                        {/* <Field
                        
                        required
                        id="Date"
                        name="Date"
                        type={"date"}
                      /> */}
                        {/* <p
                        style={{
                          color: "red",
                          display:
                            (formState.Date as string) < "2005/01/01"
                              ? "none"
                              : "flex",
                        }}
                      >
                        Age must be higher than 18years
                      </p> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.leftFormItem}>
                  <h1>Payment Method</h1>
                  <div className={styles.PaymentMethod}>
                    <div className={styles.method}>
                      <Field
                        defaultChecked
                        onClick={() => setPayment("STRIPE")}
                        type="radio"
                        name="paymentMethod"
                        value="STRIPE"
                      />
                      <p
                        style={{
                          color:
                            formState.payment === "STRIPE"
                              ? "#987358"
                              : "rgba(30, 30, 30, 0.6)",
                        }}
                      >
                        Credit card
                      </p>
                    </div>
                    <div className={styles.method}>
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="PAYPAL"
                        onClick={() => setPayment("PAYPAL")}
                      />
                      <p
                        style={{
                          color:
                            (formState.payment as string) === "PAYPAL"
                              ? "#987358"
                              : "rgba(30, 30, 30, 0.6)",
                        }}
                      >
                        PayPal
                      </p>
                    </div>
                  </div>
                  <div className={styles.SignMeUp}>
                    <label>
                      <Field name="checkedSMS" type="checkbox" />
                      <p>
                        I hereby declare that I have thoroughly read, completely
                        understood, and unconditionally accepted The{" "}
                        <u>Terms & Conditions</u>, including the{" "}
                        <u>Return Policy, FAQ, Acceptable Use Policy,</u> and{" "}
                        <u>privacy policy.</u>
                      </p>
                    </label>
                    <label>
                      <Field name="checkedEmail" type="checkbox" />
                      <p>I agree To Receive Email Updates And News</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.CheckoutRight}>
                <h1> Order Summary</h1>
                <div className={styles.RightCon}>
                  <div className={styles.OrdersFlex}>
                    {competitions.map((order, i) => {
                      const ComptetionData = items.find(
                        (compData) => compData.id === order.compID
                      );

                      return (
                        <div className={styles.orderItem} key={i}>
                          <Image
                            width={106}
                            height={105}
                            className={styles.orderImg}
                            src="/images/tester.png"
                            alt="watching"
                          />
                          <div className={styles.orderTit}>
                            <h3>
                              {ComptetionData?.Watches.brand}{" "}
                              {ComptetionData?.Watches.model}
                            </h3>
                            <span>
                              {competitions.map((comp, i) => {
                                return (
                                  <p key={i}>
                                    $
                                    {(
                                      comp.number_tickets *
                                      comp.price_per_ticket
                                    ).toFixed(2)}
                                  </p>
                                );
                              })}
                            </span>
                            <h3>
                              Remaining Tickets:{" "}
                              {
                                //TODO:
                                competitions.map((comp) => {
                                  return (
                                    ComptetionData?.remaining_tickets &&
                                    ComptetionData?.remaining_tickets -
                                      comp.number_tickets
                                  );
                                })
                              }
                            </h3>
                          </div>
                          <div className={styles.Counter}>
                            <div
                              onClick={() =>
                                updateComp({
                                  compID: order.compID,
                                  number_tickets:
                                    order.number_tickets > 1
                                      ? order.number_tickets - 1
                                      : order.number_tickets,
                                  price_per_ticket: order.price_per_ticket,
                                })
                              }
                              className={styles.CounterSelec}
                            >
                              <Image
                                width={13}
                                height={1}
                                src="/images/Minus.png"
                                alt="minus"
                              />
                            </div>
                            <div className={styles.counterValue}>
                              {
                                //TODO:
                                competitions.map((comp) => {
                                  return comp.number_tickets;
                                })
                              }
                            </div>
                            <div
                              onClick={() =>
                                updateComp({
                                  compID: order.compID,
                                  number_tickets:
                                    order.number_tickets <
                                    ComptetionData?.remaining_tickets
                                      ? order.number_tickets + 1
                                      : order.number_tickets,
                                  price_per_ticket: order.price_per_ticket,
                                })
                              }
                              className={styles.CounterSelec}
                            >
                              <Image
                                width={11}
                                height={11}
                                src="/images/plus.png"
                                alt="plus"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.orderSumBot}>
                    <div className={styles.orderSum}>
                      <p>{`Total`}</p>
                      <span>{Formater(totalCost)}</span>
                    </div>
                    {payment === "PAYPAL" ? (
                      <PayPalScriptProvider
                        options={{
                          "client-id": `${
                            process.env.NEXT_PUBLIC_PAYPAL_ID as string
                          }`,
                        }}
                      >
                        <PayPalButtons
                          forceReRender={[totalCost]}
                          createOrder={(data, actions) => {
                            return actions.order
                              .create({
                                purchase_units: [
                                  {
                                    amount: {
                                      currency_code: "USD",
                                      value: totalCost.toString(),
                                    },
                                  },
                                ],
                              })
                              .then((orderId) => {
                                // Your code here after create the order
                                return orderId;
                              });
                          }}
                          /*
                        onApprove={function (data, actions) {
                          
                          return actions?.order?
                            .capture()
                            .then(function (details) {
                              details.status === "COMPLETED" &&
                                router.push(`/CheckoutPage/${details.id}`);
                              // Your code here after capture the order
                              alert(
                                // "data.orderID:" +
                                //   data.orderID +
                                //   "  " +
                                //   "data.billingToken:" +
                                //   data.billingToken +
                                //   "  " +
                                //   "data.paymentID:" +
                                //   data.paymentID +
                                details.id
                                // "  " +
                                // "data.payerID:" +
                                // data.payerID +
                                // "  " +
                                // "details.payer.name:" +
                                // details.payer.name.given_name +
                                // "  " +
                                // "details.status:" +
                                // details.status
                              );
                            });
                          }}
                          */
                          style={{ layout: "horizontal" }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const { url } = await Hook.mutateAsync({
                            email: "test@email.com",
                            address: "hay ahahha",
                            comps: competitions.map((comp) => ({
                              compID: comp.compID,
                              quantity: comp.number_tickets,
                            })),
                          });
                          if (url) {
                            router.push(url);
                          }
                        }}
                      >
                        Confirm Order
                      </button>
                    )}

                    <button type="submit">Submit</button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CheckoutComp;
