import { type NextPage } from "next";

import "react-alice-carousel/lib/alice-carousel.css";

import Head from "next/head";
import Header from "@/components/Header";
import TheCompetition from "@/components/TheCompetition";
import HowToPlay from "@/components/HowToPlay";
import Certificate from "@/components/Certificate";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

import { api } from "@/utils/api";
import { EmblaCarousel } from "@/components/EmblaCarousel";

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
