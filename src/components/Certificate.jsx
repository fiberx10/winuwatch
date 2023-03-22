import React from "react";
import styles from "../styles/Home.module.css";
//import certificate from "../images/certificate.png";
import Image from "next/image";

const Certificate = () => {
  return (
    <div className={styles.certifContainer}>
      <h1>we use TPAL electronic random draw computerized system</h1>
      <div className={styles.certifBox}>
        <Image 
          src="/images/certificate.png"
         alt="certificate" />
      </div>
      <h2>
        randomdraw certificate system randomdraw certificate system randomdraw
        certificate system
      </h2>
    </div>
  );
};

export default Certificate;
