import NavBar from "./NavBar";
import styles from "@/styles/Home.module.css";

import Image from "next/image";

export default function Header() {
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  return (
    <div className={styles.HomeHeader}>
      <NavBar />
      <div className={styles.HeaderTit}>
        <Image
          width={872}
          height={99}
          alt="WinUWatch"
          src="/images/winuwatch.png"
        />
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
