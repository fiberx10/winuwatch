import React from "react";
import styles from "@/styles/Philosophy.module.css";
import { Fade } from "@mui/material";
import { useTranslations } from "next-intl";

const Philosophy = () => {
  const t = useTranslations("home");
  return (
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
  );
};

export default Philosophy;
