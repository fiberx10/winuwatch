/* eslint-disable @next/next/no-html-link-for-pages */
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
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";
import PhoneInput from "react-phone-number-input";
import * as Yup from "yup";
import "react-phone-number-input/style.css";

const CheckoutComp = () => {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { mutateAsync: createOrder } = api.Order.createStripe.useMutation();
  const { competitions, cardDetails, reset } = useCart();

  const { data: items } = api.Competition.getAll.useQuery({
    ids: competitions.map((comp) => comp.compID),
  });
  const IsLegal = (Birthdate = new Date()) => {
    const LegalAge = 18;
    const now = new Date();
    return (
      new Date(
        now.getFullYear() - LegalAge,
        now.getMonth(),
        now.getDate()
      ).getTime() >= Birthdate.getTime()
    );
  };
  const [error, setError] = useState<string | undefined>();
  const [isNotConfirmed, setIsNotConfirmed] = useState<boolean>(false);
  const { totalCost } = cardDetails();

  const FormSchema = Yup.object().shape({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    town: Yup.string().required("Required"),
    zip: Yup.number().required("Required"),
    phone: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className={styles.CheckoutMain}>
      {items && (
        <div className={styles.formMain}>
          <Formik
            validationSchema={FormSchema}
            initialValues={{
              first_name: "",
              last_name: "",
              country: "",
              address: "",
              town: "",
              zip: "",
              phone: "",
              email: "",
              paymentMethod: "STRIPE",
              totalPrice: totalCost,
              comps: competitions,
              date: new Date(),
              checkedEmail: false,
              checkedTerms: false,
            }}
            onSubmit={async (values, actions) => {
              // disable the confirm button to prevent duplicate messages
              setIsNotConfirmed(true);
              //if a value in the object values is undefined, it will not be sent to the server
              console.log("Form submitted:", values);

              const { url, error } = await createOrder({
                ...values,
                paymentMethod: values.paymentMethod as "PAYPAL" | "STRIPE",
                date: new Date(values.date),
                zip: values.zip.toString(),
              });
              if (url) {
                // await resend.sendEmail({
                //   from: "test@winuwatch.uk",
                //   to: values.email,
                //   subject: "Order Confirmation",
                //   react: (
                //     <SlackConfirmEmail
                //       clientName={values.first_name}
                //       numerOfTickets={values.comps}
                //     />
                //   ),
                // })
                await router.push(url);
              }
              setError(error || t("error"));
              console.log(error);
              // const res = CreateOrderSchema.safeParse(values);

              // if (res.success) {
              //   console.log("Form submitted:", res.data);

              // }
              actions.setSubmitting(false);
            }}
          >
            {({ values, setValues, setFieldValue, errors, touched }) => (
              <Form>
                <div className={styles.CheckoutLeft}>
                  <div className={styles.leftFormItem}>
                    <h1>{t("billinginfo")}</h1>
                    <div className={styles.CheckoutForm}>
                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label htmlFor="firstName">{t("firstname")}</label>
                          <Field
                            required
                            id="first_name"
                            type="text"
                            name="first_name"
                          />
                          {errors.first_name && touched.first_name ? (
                            <div style={{ color: "red" }}>
                              {errors.first_name}
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.formField}>
                          <label htmlFor="lastName">{t("lastname")}</label>
                          <Field
                            required
                            id="last_name"
                            type={"text"}
                            name="last_name"
                          />
                          {errors.last_name && touched.last_name ? (
                            <div style={{ color: "red" }}>
                              {errors.last_name}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label htmlFor="Country">{t("country")}</label>
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
                          <label htmlFor="lastName">{t("address")}</label>
                          <Field
                            required
                            id="address"
                            type="text"
                            name="address"
                          />
                          {errors.address && touched.address ? (
                            <div style={{ color: "red" }}>{errors.address}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label htmlFor="Town">{t("city")}</label>
                          <Field required id="town" type="text" name="town" />
                          {errors.town && touched.town ? (
                            <div style={{ color: "red" }}>{errors.town}</div>
                          ) : null}
                        </div>
                        <div className={styles.formField}>
                          <label htmlFor="lastName">{t("zip")}</label>
                          <Field
                            required
                            id="zip"
                            name="zip"
                            type="number"
                            min={0}
                          />
                          {errors.zip && touched.zip ? (
                            <div style={{ color: "red" }}>{errors.zip}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label htmlFor="Phone">{t("phone")}</label>
                          <PhoneInput
                            placeholder="Enter phone number"
                            name="phone"
                            id="phone"
                            onChange={(value) => setFieldValue("phone", value)}
                          />

                          {errors.phone && touched.phone ? (
                            <div style={{ color: "red" }}>{errors.phone}</div>
                          ) : null}
                        </div>
                        <div className={styles.formField}>
                          <label htmlFor="Email">{t("email")}</label>
                          <Field
                            required
                            id="email"
                            name="email"
                            type="Email"
                          />
                          {errors.email && touched.email && (
                            <div style={{ color: "red" }}>{errors.email}</div>
                          )}
                        </div>
                      </div>
                      <div className={styles.FinalRow}>
                        <div className={styles.formField}>
                          <label htmlFor="Date">{t("dateofbirth")}</label>
                          <Datetime
                            utc={true}
                            input={true}
                            timeFormat={false}
                            initialValue={new Date("2000-01-01")}
                            isValidDate={(currentDate) =>
                              IsLegal(new Date(currentDate as Date))
                            }
                            inputProps={{
                              name: "date",
                              placeholder: "Enter Date",
                              required: true,
                              max: "2005-01-01",
                            }}
                            onChange={(value) => setFieldValue("date", value)}
                          />

                          {
                            //TODO: THis should be translated
                            error && <p style={{ color: "red" }}>{error}</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.leftFormItem}>
                    <h1>{t("paymethod")}</h1>
                    <div className={styles.PaymentMethod}>
                      <div className={styles.method}>
                        <Field
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
                          {t("creditcard")}
                        </p>
                      </div>
                      {/* <div className={styles.method}>
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
                      </div> */}
                    </div>
                    <div className={styles.SignMeUp}>
                      <label>
                        <Field required name="checkedTerms" type="checkbox" />
                        <p className={styles.termsTxt}>
                          {`${t("condition")} `}
                          <a href="/TermsAndConditions">{t("terms&conds")}</a>
                          {`, ${t("including")} `}
                          <a href="/Return_Policy">{t("return")}</a>
                          {", "}
                          <a href="/FAQ">{t("faq")}</a>
                          {", "}
                          <a href="/Acceptable_Use_Policy">
                            {t("acc_use_policy")}
                          </a>
                          {`, ${t("and")} `}
                          <a href="/Privacy_Policy">{t("privacy_police")}</a>.
                        </p>
                      </label>
                      <label>
                        <Field name="checkedEmail" type="checkbox" />
                        <p className={styles.emailTxt}>{t("terms")}</p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.CheckoutRight}>
                  <h1> {t("ordersum")} </h1>
                  <div className={styles.RightCon}>
                    <div className={styles.OrdersFlex}>
                      {values.comps.map((order, i) => {
                        const ComptetionData = items.find(
                          (compData) => compData.id === order.compID
                        );

                        if (!ComptetionData || ComptetionData.Watches === null)
                          return null;
                        return (
                          <div className={styles.orderItem} key={i}>
                            <Image
                              width={106}
                              height={105}
                              className={styles.orderImg}
                              src={
                                ComptetionData.Watches.images_url[0]
                                  ? ComptetionData.Watches.images_url[0].url
                                  : "/images/tester.png"
                              }
                              alt="watching"
                            />
                            <div className={styles.orderTit}>
                              <h3>
                                {ComptetionData?.Watches.brand}{" "}
                                {ComptetionData?.Watches.model}
                              </h3>
                              {order.reduction > 0 && (
                                <p
                                  style={{
                                    color: "#a8957e",
                                  }}
                                >
                                  {`${t("discount")}\t${Formater(
                                    order.reduction *
                                      (order.number_tickets *
                                        ComptetionData.ticket_price),
                                    router.locale
                                  )}`}
                                </p>
                              )}
                              <span>
                                {values.comps.map(
                                  ({ number_tickets, price_per_ticket }, i) => (
                                    <p key={i}>
                                      {Formater(
                                        number_tickets * price_per_ticket,
                                        router.locale
                                      )}
                                    </p>
                                  )
                                )}
                              </span>
                              <h3>
                                {t("remaingtickets")}:{" "}
                                {values.comps.map(
                                  (comp) =>
                                    ComptetionData.remaining_tickets &&
                                    ComptetionData.remaining_tickets -
                                      comp.number_tickets
                                )}
                              </h3>
                            </div>
                            {/* <div className={styles.Counter}>
                              <div
                                onClick={() => {
                                  const number_tickets =
                                    order.number_tickets > 1
                                      ? order.number_tickets - 1
                                      : order.number_tickets;
                                  updateComp({
                                    compID: order.compID,
                                    number_tickets,
                                    price_per_ticket: order.price_per_ticket,
                                  });
                                  setValues({
                                    ...values,
                                    comps: values.comps.map((comp) => {
                                      if (comp.compID === order.compID) {
                                        return {
                                          ...comp,
                                          number_tickets,
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
                                {values.comps.map(
                                  (comp) => comp.number_tickets
                                )}
                              </div>
                              <div
                                onClick={() => {
                                  const number_tickets =
                                    order.number_tickets >
                                      ComptetionData.remaining_tickets ||
                                    order.number_tickets >= 25
                                      ? order.number_tickets
                                      : order.number_tickets + 1;

                                  updateComp({
                                    compID: order.compID,
                                    number_tickets,
                                    price_per_ticket: order.price_per_ticket,
                                  });
                                  setValues({
                                    ...values,
                                    comps: values.comps.map((comp) => {
                                      if (comp.compID === order.compID) {
                                        return {
                                          ...comp,
                                          number_tickets,
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
                            </div> */}
                          </div>
                        );
                      })}
                    </div>
                    <p
                      style={{
                        textDecoration: "underline",
                        color: "#987358",
                        fontWeight: "300",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        reset();
                        setValues({
                          ...values,
                          comps: [],
                        });
                      }}
                    >
                      {t("clearcart")}
                    </p>
                    <div className={styles.orderSumBot}>
                      <div className={styles.orderSum}>
                        <p>{`TOTAL`}</p>
                        <span>
                          {Formater(
                            values.comps.reduce(
                              (acc, c) =>
                                acc +
                                c.number_tickets *
                                  c.price_per_ticket *
                                  (1 - c.reduction),
                              0
                            ),
                            router.locale
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
                              values.comps.reduce(
                                (a, b) =>
                                  a + b.number_tickets * b.price_per_ticket,
                                0
                              ),
                            ]}
                            /*
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
                            */
                            style={{ layout: "horizontal" }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <>
                          <button
                            disabled={isNotConfirmed}
                            type="submit"
                            onClick={() => {
                              if (!values.checkedTerms)
                                return alert(`${t("shouldacceptterms")}`);
                            }}
                          >
                            {t("confirmorder")}
                          </button>
                        </>
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
