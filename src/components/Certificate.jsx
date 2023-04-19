import React from "react";
import styles from "../styles/Home.module.css";
import Certif from "@/components/certif";
import { useTranslations } from "next-intl";

const Certificate = () => {
  const t = useTranslations("home");
  return (
    <div className={styles.certifContainer}>
      <h1>{t("certiftitle")}</h1>
      <Certif />
      <h2>{t("certifdesc")}</h2>
    </div>
  );
};

export default Certificate;
