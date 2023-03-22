import React from "react";
import styles from "@/styles/Philosophy.module.css";
import philo from "@/images/Philo.png";
import Image from "next/image";

const Philosophy = () => {
  return (
    <div className={styles.philoMain}>
      <div className={styles.Philo}>
        <div className={styles.philoHeader}>
          <h1>
            There is no genius, only “know-how” in our independent family
            business.
          </h1>
          <p>
            We are a family company where everyone works every day to find you
            the most sought after watch models that are available to you, we
            launched WIN U WATCH to allow anyone dreaming of owning a luxury
            watch, no longer remains a dream but a real chance.
          </p>
        </div>
        <div className={styles.philoBotTxt}>
          <h1>
            You should know that we are the number 1 site in the world in terms
            of probability of winning
          </h1>
          <p>
            we are the number 1 site in the world in terms of probability of
            winning because we publish a limited number of tickets aligned with
            the number of participants makes us the best probability of winning.
          </p>
        </div>
      </div>
      <div className={styles.philoImg}></div>
    </div>
  );
};

export default Philosophy;
