import { type NextPage } from "next";

import "react-alice-carousel/lib/alice-carousel.css";

import Head from "next/head";
import Header from "@/components/Header";
import TheCompetition from "@/components/TheCompetition";
import HowToPlay from "@/components/HowToPlay";
import Certificate from "@/components/Certificate";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import OurWinner from "@/components/OurWinner";
import UpComing from "@/components/UpComing";
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
  const upComingWatchesCarou = [
    {
      img: "/images/upWatch9.webp",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch10.webp",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch3.webp",
      brand: "Rolex",
      title: "COSMOGRAPH DAYTONA",
      text: "Oyster, 40 mm, acier Oystersteel",
    },
    {
      img: "/images/upWatch4.webp",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch5.webp",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch6.png",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch11.png",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch8.png",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch1.png",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch2.png",
      brand: "Rolex",
      title: "SKY DWELLER",
      text: "Oyster, 42 mm, or Everose",
    },
  ];
  return (
    <>
      <Head>
        <title>Win u Watch - Home</title>
        <meta name="description" content="Win u Watch HomePage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <TheCompetition />
      {/*
              <OurWinner/>

      */}
      <HowToPlay />
      <Certificate />
      <Reviews />
      <UpComing slides={upComingWatchesCarou} />
      <Footer />
    </>
  );
};

export default Home;
