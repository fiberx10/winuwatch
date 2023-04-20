import React from "react";
import styles from "../styles/Home.module.css";
import Certif from "@/components/certif";
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
          src="/images/customCertif.svg"
          width={100}
          height={100}
        />
      </div>
      <h2>{t("certifdesc")}</h2>
    </div>
  );
};

export default Certificate;
