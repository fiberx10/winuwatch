import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useTranslations } from "next-intl";


const HowToPlay = () => {
  const  t = useTranslations("home");
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background3 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "-124px" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  return (
    <div id="Howtoplay" className={styles.howtoContainer}>
      <h1 className={styles.background3}>{
        t("howtoplay")
      }</h1>
      <div className={styles.howtoText}>
        <div className={styles.howtoTxt1}>
          <h2>{
              t("chooseyourtickets")
            }</h2>
          <p>
            {
              t("chooseyourticketsdesc")
            }
          </p>
        </div>
        <div className={styles.howtoTxt2}>
          <h2>{
              t("playthegame")
}</h2>
          <p>
            {
              t("playthegamedesc")
            }
          </p>
        </div>
        <div className={styles.howtoLine}>
          <Image
            className={styles.howLine}
            height={559}
            width={1}
            src="/images/Line.png"
            alt="line"
          />
          <Image
            width={10}
            height={10}
            className={styles.dot1}
            src="/images/Dot.svg"
            alt="dot"
          />
          <Image
            width={10}
            height={10}
            className={styles.dot2}
            src="/images/Dot.svg"
            alt="dot"
          />
          <Image
            width={10}
            height={10}
            className={styles.dot3}
            src="/images/Dot.svg"
            alt="dot"
          />
          <Image
            width={10}
            height={10}
            className={styles.dot4}
            src="/images/Dot.svg"
            alt="dot"
          />
        </div>
        <div className={styles.howtoTxt3}>
          <h2>{
              t("buytickets")
            }</h2>
          <p>
          
           {t("buyticketsdesc")}
          </p>
        </div>
        <div className={styles.howtoTxt4}>
          <h2>{
              t("winawatch")
            }</h2>
          <p>
            {
              t("winawatchdesc")
            }
          </p>
        </div>
        <button
          onClick={() =>
            typeof window !== "undefined" &&
            window.scrollTo({
              top:
                theComp !== null && theComp instanceof HTMLElement
                  ? theComp.offsetTop
                  : 400,
              behavior: "smooth",
            })
          }
        >
          {
            t("enter")
          }
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;
