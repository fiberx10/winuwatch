import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import styles from "@/styles/Confirmation.module.css";
import { z } from "zod";
import QRCode from "react-qr-code";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { id } = context.query;
  return {
    props: {
      id: z.string().parse(id),
    },
  };
};

export default function Confirmation({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = api.Tickets.getTicket.useQuery(id);

  return (
    <div>
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.confirmwrapper}></div>
      <div className={styles.confirmwrapper}>
        {data && (
          <div className={styles.confirm_text}>
            <h1>Ticket : {data.id}</h1>
            <QRCode
              size={50}
              style={{ height: "auto", maxWidth: "10%", width: "10%" }}
              value={data.id}
              viewBox={`0 0 50 50`}
            />
            <p>{JSON.stringify(data)}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
