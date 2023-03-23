import React, { useEffect, useState } from "react";
import styles from "@/styles/Checkout.module.css";
import Image from "next/image";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { env } from "../env.mjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { api, RouterInputs } from "@/utils/api";
import { z } from "zod";
import useCart, { OrderStore } from "./Store";
//import { CreateOrderSchema} from "@/utils/Schema";
//import { zodResolver } from '@hookform/resolvers/zod';

const CheckoutComp = () => {
  const router = useRouter();
  const { order, cardDetails, reset, addComp, removeComp, updateComp } = useCart();
  const Total = cardDetails()?.totalCost;
  const [error, setError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RouterInputs["Payment"]["create"]>({
    defaultValues: {
      date: new Date(),
      paymentMethod: "STRIPE",
      checkedEmail: false,
      checkedSMS: false,
      watchids: order?.comps.map((comp) => comp.compID) || [],
    },
  });
  const onSubmit: SubmitHandler<RouterInputs["Payment"]["create"]> = async (
    data
  ) => {
    //check if the date is more than 16 years
    const LegalAge = 18;
    const now = new Date();
    if (
      data.date &&
      new Date(
        now.getFullYear() - LegalAge,
        now.getMonth(),
        now.getDate()
      ).getTime() >= data.date.getTime()
    ) {
      const { sucess, error: trpcError } = await api.Payment.create
        .useMutation()
        .mutateAsync({ ...data });
      if (sucess && !trpcError) {
        reset(); // here we reset the cart
        router.push("/payment"); // push soemwher
      } else {
        // handle error
        setError(trpcError);
        //do something with error
      }
    } else {
      setError("You must be 18 years or older to purchase ");
    }
  };
  const {
    data: items,
    isLoading,
  } = api.Competition.getAll.useQuery({
    ids : order?.comps.map((comp) => comp.compID) || [],
  });
   

  return (
    <div className={styles.CheckoutMain}>
      {items !== undefined && (
        <div className={styles.formMain}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.CheckoutLeft}>
              <div className={styles.leftFormItem}>
                <h1>Billing Information</h1>
                <div className={styles.CheckoutForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            firstName: e.target.value,
                          }))
                        }
                        id="firstName"
                        type={"text"}
                        name="firstName"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            lastName: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            country: e.target.value,
                          }))
                        }
                        id="Country"
                        type={"text"}
                        name="Country"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Address</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            address: e.target.value,
                          }))
                        }
                        id="Address"
                        type={"text"}
                        name="Address"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Town">Town/City</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            town: e.target.value,
                          }))
                        }
                        id="Town"
                        type={"text"}
                        name="Town"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">ZIP</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            zip: e.target.value,
                          }))
                        }
                        id="Zip"
                        name="Zip"
                        type={"number"}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Phone">Phone</label>
                      <input
                        required
                        onChange={(e) =>{}
                        }
                        id="Phone"
                        type={"number"}
                        name="Phone"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="Email">Email</label>
                      <input
                        required
                        onChange={(e) =>
                         {}
                        }
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
                        required
                        onChange={(e) => {e}}
                        id="Date"
                        name="Date"
                        type={"date"}
                      />
                      <p
                        style={{
                          color: "red",
                          display: formData.date <= minAge ? "none" : "flex",
                        }}
                      >
                        Age must be higher than 18years
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.leftFormItem}>
                <h1>Payment Method</h1>
                <div className={styles.PaymentMethod}>
                  <div className={styles.method}>
                    <input
                      type="radio"
                      name="payment"
                      value="Paypal"
                      defaultChecked
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          payMeth: e.target.value,
                        }))
                      }
                    />
                    <p
                      style={{
                        color:
                          formData.payMeth === "Paypal"
                            ? "#987358"
                            : "rgba(30, 30, 30, 0.6)",
                      }}
                    >
                      PayPal
                    </p>
                  </div>
                  <div className={styles.method}>
                    <input
                      type="radio"
                      name="payment"
                      value="Stripe"
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          payMeth: e.target.value,
                        }))
                      }
                    />
                    <p
                      style={{
                        color:
                          formData.payMeth === "Stripe"
                            ? "#987358"
                            : "rgba(30, 30, 30, 0.6)",
                      }}
                    >
                      Stripe
                    </p>
                  </div>
                </div>
                <div className={styles.SignMeUp}>
                  <label>
                    <input
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          checkedEmail: !formData.checkedEmail,
                        }))
                      }
                      type="checkbox"
                    />
                    <p>Sign me up to recieve email updates and news</p>
                  </label>
                  <label>
                    <input
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          checkedSMS: !formData.checkedSMS,
                        }))
                      }
                      type="checkbox"
                    />
                    <p>Sign me up to recieve SMS updates and news</p>
                  </label>
                </div>
                <p className={styles.paymDesc}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution It is a long established fact that a
                  reader will be distracted by the readable content of a page
                  when looking at its layout. The point of using Lorem Ipsum is
                  that it has a more-or-less normal distribution
                </p>
              </div>
            </div>
            <div className={styles.CheckoutRight}>
              <h1> Order Summary</h1>
              <div className={styles.RightCon}>
                <div className={styles.OrdersFlex}>
                  {checkData &&
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
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    order.remaining_tickets - ite.number_tickets
                                  );
                                })}
                            </h3>
                          </div>
                          <div className={styles.Counter}>
                            <div
                              onClick={() => decreCart(order)}
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
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    ite.number_tickets
                                  );
                                })}
                            </div>
                            <div
                              // onClick={() =>
                              //   counter < item.remaining_tickets &&
                              //   setCounter(counter + 1)
                              // }
                              onClick={() => increCart(order)}
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
                    <h2>Sub Total</h2>
                    <span>${total.reduce((a, b) => a + b, 0)}.00</span>
                  </div>
                  <div className={styles.orderSum}>
                    <h3>Total</h3>
                    <span>${total.reduce((a, b) => a + b, 0)}.00</span>
                  </div>
                  {formData.payMeth === "paypal" ? (
                    <PayPalScriptProvider
                      options={{
                        "client-id": `${env.NEXT_PUBLIC_PAYPAL_ID}`,
                      }}
                    >
                      <PayPalButtons
                        forceReRender={[Total]}
                        createOrder={(data, actions) => {
                          return actions.order
                            .create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: Total,
                                  },
                                },
                              ],
                            })
                            .then((orderId) => {
                              // Your code here after create the order
                              return orderId;
                            });
                        }}
                        onApprove={function (data, actions) {
                          return actions.order
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
                        style={{ layout: "horizontal" }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <button type="submit">Confirm Order</button>
                  )}
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
