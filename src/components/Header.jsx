import NavBar from "./NavBar";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

import Image from "next/image";

export default function Header() {
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  const [muted] = useState(true);

  return (
    <div className={styles.HomeHeader}>
      <NavBar />
      <div className={styles.vid}>
        <div className={styles.headerback}></div>
        <video
          style={{
            objectFit: "cover",
          }}
          width="100%"
          height="100%"
          autoPlay
          loop
          playsInline
          muted={muted}
        >
          <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.webm"
            type="video/webm"
          />
        </video>
      </div>
      <div className={styles.HeaderTit}>
        <h2>winuwatch</h2>

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
