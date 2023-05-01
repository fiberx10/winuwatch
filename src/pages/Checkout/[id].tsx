/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/restrict-template-expressions */
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { z } from "zod";
import { SetStateAction, useEffect, useState } from "react";
import styles from "@/styles/Checkout.module.css";
//import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { api, Formater, CreateOrderStripeSchema, i18n } from "@/utils";
import { useCart } from "@/components/Store";
import { countryList } from "@/components/countries";
import "@/styles/Checkout.module.css";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-number-input";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import Loader from "@/components/Loader";
import Loader2 from "@/components/Loader2";
import "moment/locale/fr";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Link from "next/link";

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

const Schema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  country: Yup.string()
    .required("Required")
    .notOneOf(["0"])
    .label("Field empty"),
  town: Yup.string().required("Required"),
  zip: Yup.string().required("Required"),
  phone: Yup.string(),
  address: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  checkedEmail: Yup.boolean().default(false).oneOf([true], "Required"),
  checkedTerms: Yup.boolean().default(false).oneOf([true], "Required"),
});
export default function CheckoutPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { competitions: competitionsFromStore, reset } = useCart();
  const [competitions, setCompetitions] = useState(competitionsFromStore);
  const [ComputedTotal, setComputedTotal] = useState(0);
  const t = useTranslations("checkout");
  const router = useRouter();
  const { mutateAsync: createOrder } = api.Order.createStripe.useMutation();

  const { data: items, isLoading } = api.Competition.getAll.useQuery({
    ids: competitions.map((comp) => comp.compID),
  });
  const { data: order } = api.Order.getOrderCheck.useQuery(id);
  const [error, setError] = useState<string | undefined>();
  const {
    mutateAsync: checkDiscount,
    error: affiliationError,
    data: affiliationData,
  } = api.Affiliation.checkDiscount.useMutation();
  const [affiliationCode, setAffiliationCode] = useState<string | undefined>();

  useEffect(() => {
    setComputedTotal(
      competitions.reduce(
        (total, { number_tickets, price_per_ticket, compID, reduction }) => {
          const discountRate =
            affiliationData && affiliationData.competitionId === compID
              ? affiliationData.discountRate
              : reduction;
          const totalPriceForCompetition =
            number_tickets * price_per_ticket * (1 - discountRate);

          return total + totalPriceForCompetition;
        },
        0
      )
    );
  }, [affiliationData?.discountRate]);
  useEffect(() => {
    void (async () => {
      if (competitions && competitions.length === 0) {
        return await router.push("/Cart");
      }
    })();
  }, [items]);
  useEffect(() => {
    void (async () => {
      if (
        order &&
        (order.status === "CONFIRMED" || order.status === "CANCELLED")
      ) {
        return await router.push("/");
      }
    })();
  }, [order]);

  return (
    <div
      style={{
        textAlign: router.locale === "il" ? "right" : "left",
      }}
    >
      <Head>
        <title>Win u Watch - Checkout</title>
        <meta name="description" content="Win u Watch Checkout" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.CheckoutMain}>
        {isLoading ? (
          <div
            style={{
              height: "80vh",
              width: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Loader />
          </div>
        ) : order &&
          (order.status === "CONFIRMED" || order.status === "CANCELLED") ? (
          <div>
            <h1
              style={{
                fontFamily: "Iskry, sans-serif",
                textTransform: "uppercase",
              }}
            >
              This Order is Complete
            </h1>
            <p>you are being redirected shorly...</p>
            <Loader />
          </div>
        ) : items?.length === 0 ? (
          <div>
            <h1
              style={{
                fontFamily: "Iskry, sans-serif",
                textTransform: "uppercase",
              }}
            >
              Your Cart is Empty
            </h1>
            <p>you are being redirected shorly...</p>
            <Loader />
          </div>
        ) : (
          items && (
            <div className={styles.formMain}>
              <Formik
                validationSchema={Schema}
                initialValues={{
                  ...order,
                  country: order?.country || "FRANCE",
                  paymentMethod: "STRIPE",
                  checkedEmail: true,
                  checkedTerms: false,
                  date: new Date(),
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  //if a value in the object values is undefined, it will not be sent to the server
                  try{
                    console.log("Form submitted:", values);
                  //we need to check if each value in values is not undefined
                  //if it is undefined, we need to set it to null
                  //const ValidatedValues = Schema.cast(values);
                  const ValidatedValues = Schema.cast(values); 
                  const { url, error } = await createOrder({
                    ...ValidatedValues,
                    id: id,
                    phone: ValidatedValues ? ValidatedValues.phone : "",
                    zip: ValidatedValues.zip.toString(),
                    totalPrice: ComputedTotal,
                    comps: affiliationData
                      ? competitions.map((comp) => ({
                          ...comp,
                          reduction:
                            affiliationData.competitionId === comp.compID
                              ? affiliationData.discountRate
                              : comp.reduction,
                        }))
                      : competitions,
                    paymentMethod: values.paymentMethod as "PAYPAL" | "STRIPE",
                    date: new Date(values.date),
                    affiliationId: affiliationData?.id,
                    locale: router.locale
                      ? (router.locale as (typeof i18n)[number])
                      : "en",
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
                    setSubmitting(false);
                    await router.push(url);
                  }
                  setError(error);
                  console.log(error);
                  // const res = CreateOrderSchema.safeParse(values);

                  // if (res.success) {
                  //   console.log("Form submitted:", res.data);

                  // }
                  setSubmitting(false);
                  } catch (e) {
                    setError(e as any);
                  }
                }}
              >
                {({
                  values,
                  isSubmitting,
                  setValues,
                  setFieldValue,
                  errors,
                  touched,
                }) => (
                  <Form>
                    <div className={styles.CheckoutLeft}>
                      <div className={styles.leftFormItem}>
                        <h1>{t("billinginfo")}</h1>
                        <div className={styles.CheckoutForm}>
                          <div className={styles.formRow}>
                            <div className={styles.formField}>
                              <label htmlFor="firstName">
                                {t("firstname")}
                              </label>
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
                                value={values.country}
                              >
                                <option value="0">Select a Country</option>
                                {countryList.map((country, i) => (
                                  <option key={i} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </Field>
                              {errors.country && touched.country ? (
                                <div style={{ color: "red" }}>
                                  {errors.country}
                                </div>
                              ) : null}
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
                                <div style={{ color: "red" }}>
                                  {errors.address}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className={styles.formRow}>
                            <div className={styles.formField}>
                              <label htmlFor="Town">{t("city")}</label>
                              <Field
                                required
                                id="town"
                                type="text"
                                name="town"
                              />
                              {errors.town && touched.town ? (
                                <div style={{ color: "red" }}>
                                  {errors.town}
                                </div>
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
                                onChange={(value) =>
                                  setFieldValue("phone", value)
                                }
                              />
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
                                <div style={{ color: "red" }}>
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={styles.FinalRow}>
                            <div className={styles.formField}>
                              <label htmlFor="Date">{t("dateofbirth")}</label>
                              <label
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                (DD/MM/YYYY)
                              </label>
                              <Datetime
                                utc={true}
                                input={true}
                                dateFormat={"DD/MM/YYYY"}
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
                                onChange={(value) => {
                                  const isValidDateString = (
                                    dateString: string
                                  ): boolean => {
                                    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
                                    const isValidFormat =
                                      dateRegex.test(dateString);

                                    if (!isValidFormat) {
                                      return false; // date string does not match format DD/MM/YYYY
                                    }

                                    const [day, month, year] = dateString
                                      .split("/")
                                      .map((str) => parseInt(str, 10));
                                    const date = new Date(
                                      year as number,
                                      (month as number) - 1,
                                      day
                                    );
                                    const minDate = new Date();
                                    minDate.setFullYear(
                                      minDate.getFullYear() - 18
                                    );

                                    const isValidDate =
                                      date.getFullYear() === year &&
                                      date.getMonth() ===
                                        (month as number) - 1 &&
                                      date.getDate() === day;
                                    const isOver18 = date <= minDate;

                                    return isValidDate && isOver18;
                                  };

                                  // if (

                                  if (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    typeof value === "string" &&
                                    !isValidDateString(value)
                                  ) {
                                    setError(
                                      "Date contains invalid characters"
                                    );
                                  } else {
                                    setError("");
                                  }
                                  setFieldValue("date", value);
                                }}
                              />

                              {
                                //TODO: THis should be translated
                                error && <p style={{ color: "red" }}>{error}</p>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Insert coupon */}
                      <div className={styles.leftFormItem}>
                        <h1>{/* {t("coupon")} */} Have a discount code ?</h1>
                        <div className={styles.CouponInput}>
                          <Field
                            type="text"
                            name="coupon"
                            placeholder={"Enter discount code"}
                            onChange={(e: {
                              target: {
                                value: SetStateAction<string | undefined>;
                              };
                            }) => {
                              setAffiliationCode(e.target.value);
                            }}
                          />
                          <a
                            onClick={(): void => {
                              void checkDiscount({
                                discountCode: affiliationCode || "",
                                competitionIds:
                                  competitions.map((comp) => comp.compID) || [],
                              });
                            }}
                          >
                            ADD
                          </a>
                        </div>
                        {!!affiliationError ? (
                          <p style={{ color: "red" }}>
                            {affiliationError.message}
                          </p>
                        ) : null}
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
                            <Field
                              required
                              name="checkedTerms"
                              type="checkbox"
                            />
                            <p className={styles.termsTxt}>
                              {`${t("condition")} `}
                              <Link href="/TermsAndConditions">
                                {t("terms&conds")}
                              </Link>
                              {`, ${t("including")} `}
                              <Link href="/Return_Policy">{t("return")}</Link>
                              {", "}
                              <Link href="/FAQ">{t("faq")}</Link>
                              {", "}
                              <Link href="/Acceptable_Use_Policy">
                                {t("acc_use_policy")}
                              </Link>
                              {`, ${t("and")} `}
                              <Link href="/Privacy_Policy">
                                {t("privacy_police")}
                              </Link>
                              .
                            </p>
                          </label>
                          <label>
                            <Field
                              checked={values.checkedEmail}
                              name="checkedEmail"
                              type="checkbox"
                            />
                            <p className={styles.emailTxt}>{t("terms")}</p>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className={styles.CheckoutRight}>
                      <h1> {t("ordersum")} </h1>
                      <div className={styles.RightCon}>
                        <div className={styles.OrdersFlex}>
                          {competitions.map((order, i) => {
                            const ComptetionData = items.find(
                              (compData) => compData.id === order.compID
                            );
                            return !ComptetionData ||
                              ComptetionData.Watches === null ? null : (
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

                                  <span>
                                    {competitions
                                      .filter(
                                        (comp) => comp.compID === order.compID
                                      )
                                      .map(
                                        (
                                          { number_tickets, price_per_ticket },
                                          i
                                        ) => (
                                          <p key={i}>
                                            {Formater(
                                              number_tickets * price_per_ticket,
                                              router.locale
                                            )}
                                          </p>
                                        )
                                      )}
                                  </span>
                                  {!affiliationData && order.reduction > 0 && (
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
                                  {affiliationData &&
                                  affiliationData.competitionId ===
                                    ComptetionData.id ? (
                                    <div>
                                      <div className={styles.coupon}>
                                        <p
                                          style={{ color: "#a8957e" }}
                                        >{`Coupon`}</p>
                                        <div className={styles.couponRate}>
                                          <p
                                            style={{
                                              color: "#a8957e",
                                              padding: "0 72px 0 0",
                                            }}
                                          >
                                            {Formater(
                                              affiliationData.discountRate *
                                                (order.number_tickets *
                                                  ComptetionData.ticket_price),
                                              router.locale
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                  {competitions[competitions.length - 1] ===
                                  competitions[i] ? (
                                    <div className={styles.OrdersFlexBotSum}>
                                      <div className={styles.orderSum}>
                                        <p>{`TOTAL`}</p>
                                        <div className={styles.totalOrder}>
                                          <span>
                                            {Formater(
                                              ComputedTotal,
                                              router.locale
                                            )}
                                          </span>
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
                                              setCompetitions([]);
                                            }}
                                          >
                                            {t("clearcart")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
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

                        <div className={styles.orderSumBot}>
                          <button
                            disabled={isSubmitting || error ? true : false}
                            style={{
                              backgroundColor: error
                                ? "rgba(30, 30, 30, 0.3)"
                                : isSubmitting
                                ? "#cbb9ac"
                                : "#cbb9ac",
                              cursor:
                                isSubmitting || error ? "default" : "pointer",
                            }}
                            type="submit"
                            onClick={() => {
                              if (!values.checkedTerms)
                                return alert(`${t("shouldacceptterms")}`);
                            }}
                          >
                            {isSubmitting ? <Loader2 /> : t("confirmorder")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  return {
    props: {
      id: z.string().parse(id),
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}
