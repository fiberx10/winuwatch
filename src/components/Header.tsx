import NavBar from "./NavBar";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";


export default function Header() {
  const t = useTranslations("home");
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
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

        <video
            width="100%"
            height="100%"
            autoPlay
            playsInline
            muted
            loop
         >
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
        <h1>{
          t("title")
}</h1>
      </div>
      <div className={styles.HeaderDesc}>
        <p>
         { t("subtitle")}
        </p>
        <Image
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
          width={19}
          height={10}
          alt="vector"
          src="/images/Vector.svg"
        />
      </div>
    </div>
  );
}