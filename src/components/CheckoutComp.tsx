import { useState } from "react";
import styles from "@/styles/Checkout.module.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { api, Formater, CreateOrderSchema } from "@/utils";
import { useCart } from "./Store";
import { countryList } from "./countries";
import "@/styles/Checkout.module.css";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import type { Moment } from "moment";
const CheckoutComp = () => {
  const router = useRouter();

  const { mutateAsync: stripeCheckout } =
    api.Stripe.createCheckoutSession.useMutation();
  const { competitions, cardDetails } = useCart();
  const { mutateAsync: createOrder } = api.Payment.create.useMutation();

  const { data: items } = api.Competition.getAll.useQuery({
    ids: competitions.map((comp) => comp.compID),
  });
  const IsLegal = (Birthdate?: Date) => {
    const LegalAge = 18;
    const now = new Date();
    return (
      new Date(
        now.getFullYear() - LegalAge,
        now.getMonth(),
        now.getDate()
      ).getTime() >= (Birthdate || new Date()).getTime()
    );
  };
  const [error, setError] = useState<string | undefined>();
  const { totalCost } = cardDetails();

  return (
    <div className={styles.CheckoutMain}>
      {items && (
        <div className={styles.formMain}>
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              country: "",
              address: "",
              town: "",
              zip: undefined,
              phone: undefined,
              email: "",
              paymentMethod: "STRIPE",
              totalPrice: totalCost,
              comp: competitions,
              date: undefined,
              checkedEmail: false,
              checkedTerms: false,
            }}
            onSubmit={async (values, actions) => {
              //if a value in the object values is undefined, it will not be sent to the server
              const res = CreateOrderSchema.safeParse(values);

              if (res.success) {
                console.log("Form submitted:", res.data);
                if (!IsLegal(values.date)) {
                  setError("You must be 18 years old to purchase a ticket");
                } else {
                  const Prooo = await Promise.all([
                    await createOrder(res.data),
                    await stripeCheckout({
                      email: values.email,
                      address: values.address,
                      comps: values.comp.map((comp) => ({
                        compID: comp.compID,
                        quantity: comp.number_tickets,
                      })),
                    }),
                  ]);
                  const [success, error] = Prooo;

                  if (!success) setError(error.payment_status);
                  else {
                    setError(undefined);
                    Prooo[1].url && (await router.push(Prooo[1].url));
                  }
                }
              }
              actions.setSubmitting(false);
            }}
          >
            {({ values, setValues, setFieldValue }) => (
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
                            className={styles.countryList}
                            as="select"
                            required
                            id="country"
                            name="country"
                          >
                            {countryList.map((country, i) => (
                              <option key={i} value={country}>
                                {country}
                              </option>
                            ))}
                          </Field>
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
                          <Field
                            required
                            id="email"
                            name="email"
                            type="Email"
                          />
                        </div>
                      </div>
                      <div className={styles.FinalRow}>
                        <div className={styles.formField}>
                          <label htmlFor="Date">Date of birth</label>
                          <Datetime
                            utc={true}
                            input={true}
                            inputProps={{
                              name: "date",
                              placeholder: "Enter Date",
                              required: true,
                              max: "2005-01-01",
                            }}
                            onChange={(value: string | Moment) =>
                              setFieldValue("date", value)
                            }
                          />

                          {error ===
                          "You must be 18 years old to purchase a ticket" ? (
                            <p style={{ color: "red" }}>{error}</p>
                          ) : (
                            ""
                          )}
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
                          type="radio"
                          name="paymentMethod"
                          value="STRIPE"
                        />
                        <p
                          style={{
                            color:
                              values.paymentMethod === "STRIPE"
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
                          disabled
                        />
                        <p
                          style={{
                            color:
                              values.paymentMethod === "PAYPAL"
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
                        <Field required name="checkedSMS" type="checkbox" />
                        <p>
                          I hereby declare that I have thoroughly read,
                          completely understood, and unconditionally accepted
                          The <u>Terms & Conditions</u>, including the{" "}
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
                      {values.comp.map((order, i) => {
                        const ComptetionData = items.find(
                          (compData) => compData.id === order.compID
                        );

                        if (!ComptetionData) return null;
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
                                {ComptetionData.Watches.brand}{" "}
                                {ComptetionData.Watches.model}
                              </h3>
                              <span>
                                {values.comp.map((comp, i) => {
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
                                {values.comp.map((comp) => {
                                  return (
                                    ComptetionData.remaining_tickets &&
                                    ComptetionData.remaining_tickets -
                                      comp.number_tickets
                                  );
                                })}
                              </h3>
                            </div>
                            <div className={styles.Counter}>
                              <div
                                onClick={() => {
                                  setValues({
                                    ...values,
                                    comp: values.comp.map((comp) => {
                                      if (comp.compID === order.compID) {
                                        return {
                                          ...comp,
                                          number_tickets:
                                            comp.number_tickets > 1
                                              ? comp.number_tickets - 1
                                              : comp.number_tickets,
                                        };
                                      }
                                      return comp;
                                    }),
                                  });
                                }}
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
                                {values.comp.map((comp) => comp.number_tickets)}
                              </div>
                              <div
                                onClick={() => {
                                  console.log(
                                    values.comp.reduce(
                                      (a, b) =>
                                        a +
                                        b.number_tickets * b.price_per_ticket,
                                      0
                                    )
                                  );

                                  setValues({
                                    ...values,
                                    comp: values.comp.map((comp) => {
                                      if (comp.compID === order.compID) {
                                        return {
                                          ...comp,
                                          number_tickets:
                                            comp.number_tickets <
                                            ComptetionData.remaining_tickets
                                              ? comp.number_tickets + 1
                                              : comp.number_tickets,
                                        };
                                      }
                                      return comp;
                                    }),
                                  });
                                }}
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
                        <span>
                          {Formater(
                            values.comp.reduce(
                              (a, b) =>
                                a + b.number_tickets * b.price_per_ticket,
                              0
                            )
                          )}
                        </span>
                      </div>
                      {values.paymentMethod === "PAYPAL" ? (
                        <PayPalScriptProvider
                          options={{
                            "client-id": `${
                              process.env.NEXT_PUBLIC_PAYPAL_ID as string
                            }`,
                          }}
                        >
                          <PayPalButtons
                            onClick={async () => {
                              console.log("Form submitted:", values);

                              const res = CreateOrderSchema.safeParse(values);

                              if (res.success) {
                                if (!IsLegal(values.date)) {
                                  setError(
                                    "You must be 18 years old to purchase a ticket"
                                  );
                                } else {
                                  await createOrder(res.data);
                                }
                              }
                            }}
                            forceReRender={[
                              values.comp.reduce(
                                (a, b) =>
                                  a + b.number_tickets * b.price_per_ticket,
                                0
                              ),
                            ]}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: values.comp.map((value) => ({
                                  amount: {
                                    currency_code: "USD",
                                    value: (
                                      value.number_tickets *
                                      value.price_per_ticket
                                    )
                                      .toPrecision(2)
                                      .toString(),
                                  },
                                })),
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
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CheckoutComp;
