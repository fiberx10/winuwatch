import React from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const data = [
    { names: ["introducing", "how to play", "contact"] },
    { names: ["competitions", "winners", "account"] },
    { names: ["charity", "press", "faq"] },
    { names: ["return", "terms & conditions", "privacy"] },
  ];
  return (
    <div className={styles.Footer}>
      <div className={styles.FooterTop}>

        <Image
          width={144}
          height={76}
          src="/images/FooterLogo.png"
          alt="logo"
        />

        <div className={styles.menusGrid}>
          {data.map((menu, i) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
                key={i}
              >
                <Link href="/">{menu.names[0]}</Link>
                <Link href="/">{menu.names[1]}</Link>
                <Link href="/">{menu.names[2]}</Link>
              </div>
            );
          })}
        </div>
        <div className={styles.FooterTopRight}>
          <div className={styles.emails}>
            <p>For enquiries, please email</p>
            <a href="mailto:info@winuwatch.com">
              <u>info@winuwatch.com</u>
            </a>
          </div>
          <div className={styles.payment}>
            <p>100% Secure payment</p>
            <div className={styles.paymentIcons}>
              <div className={styles.visa}>

                <Image
                  width={27}
                  height={21}
                  src="/images/visa.svg"
                  alt="visa"
                />
              </div>
              <div className={styles.visaicons}>
                <Image
                  width={14}
                  height={14}
                  src="/images/viacirclight.png"
                  alt="visareclight"
                />
                <Image
                  width={14}
                  height={14}
                  src="/images/visacircdark.png"
                  alt="visarecdark"
                />

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.FooterBot}>
        <h3>Win U Watch © 2023</h3>
      </div>
    </div>
  );
};

export default Footer;
