import React from "react";
import amazon from "@/images/amazon.png";
import pinging from "@/images/pinging.png";
import feros from "@/images/feros.png";
import BINBOWS from "@/images/BINBOWS.png";
import styles from "@/styles/Charity.module.css";
import Image from "next/image";
import charityHand from "@/images/charityHand.png";

const Charit = () => {
  const data = [
    {
      img: amazon,
      name: "AMAZON.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: pinging,
      name: "PINGING.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: feros,
      name: "FEROS CORP",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: BINBOWS,
      name: "BINBOWS",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: amazon,
      name: "AMAZON.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: pinging,
      name: "PINGING.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: feros,
      name: "FEROS CORP",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: BINBOWS,
      name: "BINBOWS",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: amazon,
      name: "AMAZON.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: pinging,
      name: "PINGING.INC",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: feros,
      name: "FEROS CORP",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: BINBOWS,
      name: "BINBOWS",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
  ];
  return (
    <div className={styles.CharityMain}>
      <div className={styles.CharityHeader}>
        <div className={styles.CharityH1}>
          <Image alt="charityHand" src={charityHand} />
          <h1>Total Raised For Charity</h1>
        </div>
        <h3>£594,828</h3>
      </div>
      <div className={styles.CharityGrid}>
        {data.map((charity, i) => {
          return (
            <div className={styles.charity} key={i}>
              <div className={styles.charityTop}>
                <div
                  style={{
                    backgroundColor:
                      charity.name === "AMAZON.INC"
                        ? "rgba(252, 155, 0, 0.1)"
                        : charity.name === "PINGING.INC"
                        ? "rgba(218, 85, 47, 0.1)"
                        : charity.name === "FEROS CORP"
                        ? "rgba(249, 72, 119, 0.1)"
                        : "rgba(72, 192, 235, 0.12)",
                  }}
                  className={styles.CharityImgCon}
                >
                  <Image alt="charity" src={charity.img} />
                </div>
                <div>
                  <h4>DONATIONS</h4>
                  <p>${charity.amount}</p>
                </div>
              </div>
              <div className={styles.CharityBot}>
                <h3
                  style={{
                    color:
                      charity.name === "AMAZON.INC"
                        ? "#FC9B00"
                        : charity.name === "PINGING.INC"
                        ? "#DA552F"
                        : charity.name === "FEROS CORP"
                        ? "#F94877"
                        : "#48C0EB",
                  }}
                >
                  {charity.name}
                </h3>
                <p>{charity.desc}</p>
              </div>
              <button>READ MORE</button>
            </div>
          );
        })}
      </div>
      <button className={styles.charityViewMore}>VIEW MORE</button>
    </div>
  );
};

export default Charit;
