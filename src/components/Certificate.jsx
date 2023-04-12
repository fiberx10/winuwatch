import React from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Certificate = () => {
  const t = useTranslations("home");
  return (
    <div className={styles.certifContainer}>
      <h1>{t("certiftitle")}</h1>
      <div className={styles.certifBox}>
        <Image
          width={238}
          height={363}
          src="/images/certificate.svg"
          alt="certificate"
        />
      </div>
      <h2>
        {t("certifdesc")}
        randomdraws certificate system randomdraws certificate system
        randomdraws certificate system
      </h2>
    </div>
  );
};

export default Certificate;
