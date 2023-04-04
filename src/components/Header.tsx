import NavBar from "./NavBar";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useEffect } from "react";

export default function Header() {
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
          loop
          playsInline
          muted={true}
        >
          <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className={styles.HeaderTit}>
        <h2 className={styles.background}>winuwatch</h2>
        <h1>win your dream watch</h1>
      </div>
      <div className={styles.HeaderDesc}>
        <p>
          Our team select the most beautiful watches, with a focus on elegance.
          With more than 260 partners around the world.
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
