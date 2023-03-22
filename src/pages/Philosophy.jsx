import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Philosophy from "@/components/Philosophy";
import Head from "next/head";

export default function Philosopht() {
  return (
    <div>
      <Head>
        <title>Win u Watch - Philosophy</title>
        <meta name="description" content="Win u Watch Our Philosophy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Philosophy />
      <Footer />
    </div>
  );
}
