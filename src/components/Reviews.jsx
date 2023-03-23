import { Rating } from "@mui/material";
import React from "react";
import AliceCarousel from "react-alice-carousel";
import styles from "../styles/Home.module.css";

const Reviews = () => {
  const data = [
    {
      name: "trustpilot",
      score: 4.8,
      numberOfRev: 1393,
      review: "Review...",
      fullRev: "Full review",
      fullname: "NAME",
      time: "TIME",
    },
    {
      name: "trustpilot",
      score: 4.8,
      numberOfRev: 1393,
      review: "Review...",
      fullRev: "Full review",
      fullname: "NAME",
      time: "TIME",
    },
    {
      name: "trustpilot",
      score: 4.8,
      numberOfRev: 1393,
      review: "Review...",
      fullRev: "Full review",
      fullname: "NAME",
      time: "TIME",
    },
    {
      name: "trustpilot",
      score: 4.8,
      numberOfRev: 1393,
      review: "Review...",
      fullRev: "Full review",
      fullname: "NAME",
      time: "TIME",
    },
  ];
  return (
    <div className={styles.ReviewsContainer}>
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
                    <h1>{rev.name}</h1>
                    <div className={styles.RevTopTxt}>
                      <p>/ TrustScore {rev.score}</p>
                      <p>
                        <u>/ {rev.numberOfRev} reviews</u>
                      </p>
                    </div>
                  </div>
                  <div className={styles.Rating}>
                    <Rating defaultValue={rev.score} precision={0.5} readOnly />
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
      </div>
    </div>
  );
};

export default Reviews;
