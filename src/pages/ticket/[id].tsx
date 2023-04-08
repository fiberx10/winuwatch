import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import styles from "@/styles/Ticket.module.css";
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

  console.log(JSON.stringify(data));

  return (
    <div>
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.confirmwrapper}>
        {data && (
          <div className={styles.wrapper}>
            <div className={styles.wrapper_left}>
              <div className={styles.comp_info}>
                <h6>{data.Competition.name}</h6>
                <h5>{data.Competition.drawing_date.toDateString()}</h5>
              </div>

              <div className={styles.ticket_info}>
                <h6>
                  Customer Name : {data.Order.first_name} {data.Order.last_name}
                </h6>
                <h6> Total Price : {data.Order.totalPrice} $ </h6>
              </div>
            </div>
            <div className={styles.wrapper_right}>
              <QRCode
                size={50}
                style={{ height: "auto", maxWidth: "40%", width: "40%" }}
                value={data.id}
                viewBox={`0 0 50 50`}
              />
              <h6>Ticket Number : {data.id}</h6>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
