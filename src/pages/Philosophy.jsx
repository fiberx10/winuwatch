import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import styles from "@/styles/Philosophy.module.css";
import { Fade } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Philosopht() {
  const t = useTranslations("philosophy");
  return (
    <div>
      <Head>
        <title>Win u Watch - Philosophy</title>
        <meta name="description" content="Win u Watch Our Philosophy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className={styles.philoMain}>
        <div className={styles.Philo}>
          <Fade in={true}>
            <div className={styles.philoHeader}>
              <h1>{t("philoheader")}</h1>
              <p>{t("philoheaderdesc")}</p>
            </div>
          </Fade>
          <div className={styles.philoBotTxt}>
            <h1>{t("philotext")}</h1>
            <p>{t("philotextdesc")}</p>
          </div>
        </div>
        <div className={styles.philoImg}></div>
      </div>
      <Footer />
    </div>
  );
}


// @ts-ignore
export async function getStaticProps({locale}) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  };
}
