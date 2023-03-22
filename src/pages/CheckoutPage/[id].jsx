import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Id({ data }) {
  const { query } = useRouter();
  console.log(query);
  return (
    <div>
      <Head>
        <title>Order Complete</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <h1>Order {query.id} Completed</h1>
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
