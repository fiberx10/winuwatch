import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import styles from "@/styles/Confirmation.module.css";
import {z} from "zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
export const getServerSideProps = (context: GetServerSidePropsContext) => { 
  const { id } = context.query; 
  return {
    props: {
      id : z.string().parse(id)
    },
  };
};

export default function Confirmation({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query } = useRouter();
  const { data } = api.Order.getOrder.useQuery(id);

  return (
    <div>
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.confirmwrapper}>
      </div>
      <div className={styles.confirmwrapper}>
        <div className={styles.confirm_text}>
          <h1>Thank you {data ? data[0]?.first_name : null} for your order!</h1>
          <p>
            Your order has been confirmed . <br /> You will receive an email
            confirmation shortly.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
