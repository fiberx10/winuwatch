import { BackendLink } from "@/components/Backend";
import CompetitionComponent from "@/components/CompetitionComponent";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Competition({ data }) {
  const { query } = useRouter();
  let images_db = "image1.png, image2.png";
  let images = images_db.split(", ");

  return (
    <div>
      <Head>
        <title>Win u Watch - {data.Watch.name}</title>
        <meta name="description" content="Win u Watch Competition" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <CompetitionComponent data={data} />
      <Footer />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const fetchData = await fetch(`${BackendLink}/details/${ctx.query.id}`).then(
    (res) => res.json()
  );
  return {
    props: {
      data: fetchData,
    },
  };
}
