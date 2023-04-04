import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function Confirmation() {
  const { query } = useRouter();
  const { data } = api.Order.getOrder.useQuery(query.id);
  console.log(query);
  return (
    <div>
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
    <div>
        <h1>Order Complete</h1>
    </div>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      data: null,
    },
  };
}
