import CompetitionComponent from "@/components/CompetitionComponent";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { z } from "zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  try {
    const compID = z.string().parse(context.params?.id);
    return {
      props: {
        compID,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

export default function Competition({
  compID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading, error } = api.Competition.byID.useQuery(compID);
  //TODO: competition data is either a watch or an error, need to handle both cases
  return (
    <div>
      <Head>
        <title>
          Win u Watch -{" "}
          {data !== null && data && data.Watches !== null && data.Watches.brand}
        </title>
        <meta name="description" content="Win u Watch Competition" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {CompetitionComponent({ data })}
      <Footer />
    </div>
  );
}
