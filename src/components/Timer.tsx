import React from "react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useTranslations } from "next-intl";

const Timer = ({ date, displayFlex }: { date: Date; displayFlex: boolean }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const t = useTranslations("home");

  useEffect(() => {
    const getTime = () => {
      //Calculate the time difference between now and the date
      const time = date.getTime() - new Date().getTime();
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    };
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div
      style={{
        flexDirection: displayFlex ? "row" : "column",
        gap: displayFlex ? "1rem" : "0",
      }}
      className={styles.timer}
    >
      <div className={styles.timerItem}>
        <p>{days}</p>
        <h6>{t("days")}</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{hours}</p>
        <h6>{t("hours")}</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{minutes}</p>
        <h6>{t("minutes")}</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{seconds}</p>
        <h6>{t("seconds")}</h6>
      </div>
    </div>
  );
};

export default Timer;
