import { Rating } from "@mui/material";
import React, { useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import styles from "../styles/Home.module.css";

const Reviews = () => {
  const data = [
    {
      name: "trustpilot",
      score: 5,
      numberOfRev: 12,
      review: "I had the best experience online.",
      fullRev:
        "I had the best experience online. The website is very intuitive and functional. I wish to win and to expand my watches collection, good luck to me !",
      fullname: "Chanel Cohen",
      time: "23.3.2023",
    },
    {
      name: "trustpilot",
      score: 4.8,
      numberOfRev: 9,
      review: "Very good idea and a beautiful website",
      fullRev:
        "Very good idea and a beautiful website. thank you for giving us the chance to participate in the competition( with only one ticket! ) ",
      fullname: "Jessica Meyer",
      time: "17.3.2023",
    },
    {
      name: "trustpilot",
      score: 4.9,
      numberOfRev: 1,
      review: "Wow I like the idea it sound amazing …",
      fullRev:
        "Wow I like the idea it sound amazing waiting for the opening of the website",
      fullname: "Xampy",
      time: "17.3.2023",
    },
    {
      name: "trustpilot",
      score: 5,
      numberOfRev: 1,
      review: "Excellente présentation !",
      fullRev:
        "Excellente présentation ! Impatient que le site ouvre en Europe Idee génial !!!",
      fullname: "Koskas",
      time: "14.3.2023",
    },
  ];
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background4 ?? "undefined"}`
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
    <div id="trustpilot" className={styles.ReviewsContainer}>
      <div className={styles.AliceContainer}>
        <AliceCarousel
          infinite={true}
          autoPlay={true}
          autoPlayInterval={3000}
          mouseTracking
          //   renderDotsItem={() => <div className={styles.carouLine}></div>}
          items={data.map((rev, i) => {
            return (
              <div className={styles.Rev} key={i}>
                <div className={styles.RevTop}>
                  <div>
                    <div style={{ opacity: 0, marginBottom: "25px" }}>
                      {rev.name}
                    </div>
                    <div className={styles.RevTopTxt}>
                      <p>/ TrustScore {rev.score}</p>
                      <p>
                        <u>/ {rev.numberOfRev} reviews</u>
                      </p>
                      <div className={styles.Rating}>
                        /
                        <Rating
                          defaultValue={rev.score}
                          precision={0.5}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.RevBot}>
                  <h2>{rev.review}</h2>
                  <p>{rev.fullRev}</p>
                  <span>
                    {rev.fullname}, {rev.time}
                  </span>
                </div>
              </div>
            );
          })}
        />
        <h1 className={styles.background4}>TRUSTPILOT</h1>
      </div>
    </div>
  );
};

export default Reviews;
