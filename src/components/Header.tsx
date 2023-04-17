/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import NavBar from "./NavBar";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("home");
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background ?? "undefined"}`
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
    <div className={styles.HomeHeader}>
      <NavBar />
      <div className={styles.vid}>
        <div className={styles.headerback}></div>

        <video width="100%" height="100%" autoPlay playsInline muted loop>
          <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.webm"
            type="video/webm"
          />
          <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.mp4"
            type="video/mp4"
          />
          <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.mov"
            type="video/quicktime"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles.HeaderTit}>
        <h2 className={styles.background}>winuwatch</h2>
        <h1>{t("title")}</h1>
      </div>
      <div className={styles.HeaderDesc}>
        <p>{t("subtitle")}</p>
        <Link href={"/#theComp"}>
          <svg
            width="19"
            height="10"
            viewBox="0 0 23 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 2L11.5 12L21 2" stroke="white" strokeWidth="3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
