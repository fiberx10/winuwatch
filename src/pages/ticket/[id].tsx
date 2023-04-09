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
            <h1>Your Ticket Code : {data.id.slice(0, 8)}</h1>

            <div className={styles.head}>
              <header>
                <p>Details</p>
                <p>Order {data.Order.id.slice(0, 8)} </p>
              </header>
              <div className={styles.comp_info}>
                <h6>{data.Competition.name}</h6>
              </div>
              <header>
                <p>Value of this ticket</p>
                <p> £ {data.Order.totalPrice} </p>
              </header>
            </div>

            <div className={styles.qrcode}>
              <QRCode
                size={50}
                style={{ height: "auto", maxWidth: "40%", width: "40%" }}
                value={data.id}
                viewBox={`0 0 50 50`}
              />
            </div>

            <footer>
              <h6>WITH THE CERTIGAME'S CERTIFICATION</h6>
              <h1>CERTIGAME</h1>
              <p>www.winuwatch.uk</p>
            </footer>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
