import Charit from "@/components/Charit";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";

export default function Charity() {
  return (
    <div>
      <Head>
        <title>Win u Watch - Charity</title>
        <meta name="description" content="Win u Watch Our Charity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Charit />
      <Footer />
    </div>
  );
}
