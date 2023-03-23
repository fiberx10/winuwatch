import React from "react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const Timer = ({ date }: { date: string }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // please change format of date from "DD/MM/YY" to "YYYY/MM/DD"
  useEffect(() => {
    const getTime = () => {
      const time = Date.parse(date) - Date.now();

      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    };
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [date]);
  return (
    <div className={styles.timer}>
      <div className={styles.timerItem}>
        <p>{days}</p>
        <h6>Days</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{hours}</p>
        <h6>Hours</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{minutes}</p>
        <h6>Minutes</h6>
      </div>
      <div className={styles.timerItem}>
        <p>{seconds}</p>
        <h6>Seconds</h6>
      </div>
    </div>
  );
};

export default Timer;
