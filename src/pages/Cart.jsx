import CartComp from "@/components/CartComp";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";

export default function Cart() {
  return (
    <div>
      <Head>
        <title>Win u Watch - Cart</title>
        <meta name="description" content="Win u Watch Cart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <CartComp />
      <Footer />
    </div>
  );
}
