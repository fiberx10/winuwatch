import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const data = [
    { names: ["COMPETITIONS", "how to play", "contact"] },
    { names: ["PHILOSOPHY", "winners", "Charity"] },
    { names: ["Acceptable Use Policy", "faq"] },
    { names: ["Return Policy", "terms & conditions", "Privacy Policy"] },
  ];
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background5 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "-124px" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div
        style={{
          background:
            typeof window !== "undefined" && location.pathname !== "/Philosophy"
              ? "#cbb9ac"
              : "#a8957e",
        }}
        className={styles.FooterInsta}
      >
        <h1 className={styles.background5}>Follow us</h1>
        <p>
          Don&apos;t miss the live draw and the announcement of the next
          competitions on Instagram !
        </p>
        <Image
          width={250}
          height={52}
          alt="instaFollow"
          src="/images/InstaFooter.svg"
        />
      </div>
      <div className={styles.Footer}>
        <div className={styles.FooterTop}>
          <Image width={144} height={76} src="/images/newLogo.png" alt="logo" />

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
              <a href="mailto:info@winuwatch.uk">
                <u>info@winuwatch.uk</u>
              </a>
            </div>
            <div className={styles.payment}>
              <p>100% Secure payment</p>
              <div className={styles.paymentIcons}>
                <div className={styles.visa}>visa</div>
                <div className={styles.visaicons}>
                  <Image
                    width={14}
                    height={14}
                    src="/images/visacircdark.png"
                    alt="visarecdark"
                  />
                  <Image
                    width={14}
                    height={14}
                    src="/images/viacirclight.png"
                    alt="visareclight"
                    style={{ marginLeft: "-3px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.FooterBot}>
          <h3>Win U Watch © 2023</h3>
          <p>
            Lisam Watch Ltd is registered at 63-66 Hatton Gardens, London, EC1N
            8LE, UK
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
