import React from "react";
import styles from "../styles/Home.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Certificate = () => {
  const t = useTranslations("home");
  return (
    <div className={styles.certifContainer}>
      <h1>{t("certiftitle")}</h1>
      <div className={styles.certifBox}>
        <Image
          alt="certificate"
          src="/images/CertificateJPEG.jpg"
          width={434}
          height={534}
        />
      </div>
      <h2>{t("certifdesc")}</h2>
    </div>
  );
};

export default Certificate;
