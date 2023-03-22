import { type NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import TheCompetition from "@/components/TheCompetition";
import Winners from "@/components/Winners";
import HowToPlay from "@/components/HowToPlay";
import Certificate from "@/components/Certificate";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import "react-alice-carousel/lib/alice-carousel.css";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  const {
    data: Watches,
    isLoading: isWatchesLoading,
    error: WatchesError,
  } = api.Watches.getAll.useQuery();
  /*const { mutateAsync } = api.Payment.create.useMutation();

  const handle = async () => {
    return await mutateAsync({
      name: "Test",
    });
  };*/
  return (
    <>
      <Head>
        <title>Win u Watch - Home</title>
        <meta name="description" content="Win u Watch HomePage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <TheCompetition />
      {/* <Winners /> */}
      <HowToPlay />
      <Certificate />
      <Reviews />
      <Footer />
    </>
  );
};

export default Home;
