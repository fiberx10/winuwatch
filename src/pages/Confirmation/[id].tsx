import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { api } from "@/utils/api";
import styles from "@/styles/Confirmation.module.css";
import { z } from "zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/Store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

export default function Confirmation({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { reset, competitions } = useCart();
  // const { mutate: updateOrder, data } = api.Order.getOrder.useMutation();
  const { data } = api.Order.AddTicketsAfterConfirmation.useQuery({
    id: id,
    comps: competitions,
  });
  const t = useTranslations("thanku");

  useEffect(() => {
    if (competitions.length > 0 && data) {
      reset();
    }
  }, [data]);

  const router = useRouter();
  return (
    <div
      style={{
        textAlign: router.locale === "iw" ? "right" : "left",
      }}
    >
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.confirmwrapper}></div>
      <div className={styles.confirmwrapper}>
        <div className={styles.confirm_text}>
          <h1>
            {`${t("thank")} ${data ? data.first_name : ""} ${t(
              "foryourorder"
            )}`}
          </h1>
          <p>
            {t("confirm")} <br /> {t("confemail")}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
