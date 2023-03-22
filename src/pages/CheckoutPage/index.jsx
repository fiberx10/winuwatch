import CheckoutComp from "@/components/CheckoutComp";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";

export default function CheckoutPage() {
  return (
    <div>
      <Head>
        <title>Win u Watch - Checkout</title>
        <meta name="description" content="Win u Watch Checkout" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <CheckoutComp />
      <Footer />
    </div>
  );
}
