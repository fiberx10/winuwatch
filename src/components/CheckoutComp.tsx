/* eslint-disable @typescript-eslint/no-unsafe-argument  */
/* eslint-disable @typescript-eslint/no-floating-promises */
/*  eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import styles from "@/styles/Checkout.module.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api, type RouterInputs, Formater } from "@/utils";
import { useCart } from "./Store";

// import { CreateOrderSchema } from "@/utils/Schema";
//import { zodResolver } from '@hookform/resolvers/zod';

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
import "@/styles/Checkout.module.css";

type CreatePayemtnTYpe = RouterInputs["Payment"]["create"];

const CheckoutComp = () => {
  //
  const router = useRouter();

  const Hook = api.Stripe.createCheckoutSession.useMutation();
  const { competitions, cardDetails, reset, addComp, removeComp, updateComp } =
    useCart();

  const { data: items } = api.Competition.getAll.useQuery({
    ids: competitions.map((comp) => comp.compID),
  });

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

  const { totalCost, Number_of_item } = cardDetails();
  const [error, setError] = useState<string | undefined>();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState((prevState) => ({
      ...prevState,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };
  const handleDateChange = (date: Date, name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from submitting normally
    console.log("Form submitted:", formState);
  };

  return (
    <div className={styles.CheckoutMain}>
      {items && (
        <div className={styles.formMain}>
          <form onSubmit={handleSubmit}>
            <div className={styles.CheckoutLeft}>
              <div className={styles.leftFormItem}>
                <h1>Billing Information</h1>
                <div className={styles.CheckoutForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        onChange={handleChange}
                        required
                        id="firstName"
                        type="text"
                        name="firstName"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        required
                        onChange={handleChange}
                        id="lastName"
                        type={"text"}
                        name="lastName"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Country">Country/Region</label>
                      <input
                        required
                        onChange={handleChange}
                        id="Country"
                        type="text"
                        name="Country"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Address</label>
                      <input
                        required
                        id="Address"
                        onChange={handleChange}
                        type="text"
                        name="Address"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Town">Town/City</label>
                      <input
                        onChange={handleChange}
                        required
                        id="Town"
                        type="text"
                        name="Town"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">ZIP</label>
                      <input
                        required
                        onChange={handleChange}
                        id="Zip"
                        name="Zip"
                        type="number"
                        min={0}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Phone">Phone</label>
                      <input
                        onChange={handleChange}
                        required
                        id="Phone"
                        type="number"
                        name="Phone"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="Email">Email</label>
                      <input
                        onChange={handleChange}
                        required
                        id="Email"
                        name="Email"
                        type="Email"
                      />
                    </div>
                  </div>
                  <div className={styles.FinalRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Date">Date of birth</label>
                      <input
                        // onChange={(date: Date) =>
                        //   handleDateChange(date, "date")
                        // }
                        max="2005-01-01"
                        required
                        type={"date"}
                        name="date"
                      />
                      {/* <input
                        onChange={handleChange}
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
                    <input type="radio" name="payment" value="Stripe" />
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
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="payment"
                      value="PAYPAL"
                      defaultChecked
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
                    <input type="checkbox" />
                    <p>
                      I have read the <u>Terms & Conditions</u> and{" "}
                      <u>privacy policy</u>
                    </p>
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.CheckoutRight}>
              <h1> Order Summary</h1>
              <div className={styles.RightCon}>
                <div className={styles.OrdersFlex}>
                  {/*checkData &&
                    checkData.map((order, i) => {
                      itemsForFetch &&
                        itemsForFetch.map((ite) => {
                          return (
                            ite.compID === order.id &&
                            total.push(
                              ite.number_tickets * Number(order.ticket_price)
                            )
                          );
                        });
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
                            <h3>{order.Watch.name}</h3>
                            <span>
                              $
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    ite.number_tickets *
                                      Number(order.ticket_price)
                                  );
                                })}
                              .00
                            </span>
                            <h3>
                              Remaining Tickets:{" "}
                              {
                                //TODO:
                              }
                            </h3>
                          </div>
                          <div className={styles.Counter}>
                            <div
                              onClick={() => {}}
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
                              }
                              0
                            </div>
                            <div
                              // onClick={() =>
                              //   counter < item.remaining_tickets &&
                              //   setCounter(counter + 1)
                              // }
                              onClick={() => {}}
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
                            */}
                </div>
                <div className={styles.orderSumBot}>
                  <div className={styles.orderSum}>
                    <h2>Sub Total</h2>
                    <span>{Formater(totalCost)}</span>
                  </div>
                  <div className={styles.orderSum}>
                    <p>{`Total + (20%) VAT`}</p>
                    <span>{Formater(totalCost * 1.02)}</span>
                  </div>
                  {formState.payment &&
                  (formState.payment as string) === "PAYPAL" ? (
                    <PayPalScriptProvider
                      options={{
                        "client-id": `${env.NEXT_PUBLIC_PAYPAL_ID}`,
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
                                    value: (totalCost * 1.02).toString(),
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
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutComp;
