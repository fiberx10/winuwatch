import { type NextPage } from "next";

import "react-alice-carousel/lib/alice-carousel.css";

import Head from "next/head";
import Header from "@/components/Header";
import TheCompetition from "@/components/TheCompetition";
import HowToPlay from "@/components/HowToPlay";
import Certificate from "@/components/Certificate";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
//import OurWinner from "@/components/OurWinner";
import UpComing from "@/components/UpComing";
//import { api } from "@/utils/api";

const Home: NextPage = () => {
  /*const {
    data: Watches,
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
      title: "SKY-DWELLER",
      text: "Oyster, 40 mm, acier Oystersteel",
    },
    {
      img: "/images/upWatch3.webp",
      brand: "Rolex",
      title: "GMT-MASTER II",
      text: "Oyster, 40 mm, acier Oystersteel et or Everose",
    },
    {
      img: "/images/upWatch10.webp",
      brand: "Rolex",
      title: "SKY-DWELLER",
      text: "Oyster, 42 mm, or Everose",
    },
    {
      img: "/images/m116500ln-0001-e1679051409805.webp",
      brand: "Rolex",
      title: "COSMOGRAPH DAYTONA",
      text: "Oyster, 40 mm, acier Oystersteel",
    },
    {
      img: "/images/m126603-0011-e1679254307486.webp",
      brand: "Rolex",
      title: "SEA-DWELLER",
      text: "Oyster, 43 mm, acier Oystersteel et or jaune",
    },
    {
      img: "/images/upWatch2.png",
      brand: "Rolex",
      title: "SUBMARINER DATE",
      text: '"Hulk" Submariner Date 116610LV',
    },
    {
      img: "/images/upWatch4.webp",
      brand: "Rolex",
      title: "SUBMARINER DATE",
      text: "Oyster, 41 mm, acier Oystersteel",
    },
    {
      img: "/images/NAUTILUS.png",
      brand: "Patek P.",
      title: "5712/1A NAUTILUS",
      text: "Self-winding",
    },
    {
      img: "/images/upWatch6.png",
      brand: "Patek P.",
      title: "5167A AQUANAUT",
      text: "Self-winding",
    },
    {
      img: "/images/5167A_001_-_Copy-removebg-preview-e1679300837646.png",
      brand: "Patek P.",
      title: "5968G AQUANAUT",
      text: "Self-winding",
    },
    {
      img: "/images/upWatch1.png",
      brand: "Audemars Piguet",
      title: "ROYAL OAK",
      text: "Perpetual calendar ultra-thin",
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
