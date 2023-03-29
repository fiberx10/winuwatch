import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";

import Image from "next/image";

const HowToPlay = () => {
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
      <h1 className={styles.background3}>how to play</h1>
      <div className={styles.howtoText}>
        <div className={styles.howtoTxt1}>
          <h2>Choose your tickets</h2>
          <p>
            Choose how many tickets you want - up to 25 per person - and
            you&apos;re on the way to winning the luxury timepiece.
          </p>
        </div>
        <div className={styles.howtoTxt2}>
          <h2>Play the game online</h2>
          <p>
            Test your watch knowledge in our online game – built to sort the
            connoisseurs from the pretenders.
          </p>
        </div>
        <div className={styles.howtoLine}>
          <Image height={559} width={1} src="/images/Line.png" alt="line" />
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
          <h2>Buy your tickets</h2>
          <p>
            Pay securely to submit your entry. We use a third party Random
            Number Generator called <u>Randomdraws</u> to choose the winner.
          </p>
        </div>
        <div className={styles.howtoTxt4}>
          <h2>Win your dream watch!</h2>
          <p>
            And that&apos;s it! You could walk away with a new £20,000 watch –
            for as little as £25.
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
          enter competition
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;
