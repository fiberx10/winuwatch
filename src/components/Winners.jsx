import React from "react";
import styles from "../styles/Home.module.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";

const Winners = () => {
  const data = [
    {
      img: "/images/rec1.png",
      name: "Mike Hero",
    },
    {
      img: "/images/rec2.png",
      name: "Watch title",
    },
    {
      img: "/images/rec3.png",
      name: "Watch title",
    },
    {
      img: "/images/rec4.png",
      name: "Watch title",
    },
  ];

  return (
    <div className={styles.WinnCon}>
      <h1>Our Winners</h1>

      <div className={styles.winnerCarou}>
        <p className={styles.activeDesc}>
          We&apos;ve given away <span>{Formater(17000)}</span> worth of timepieces -
          and counting
        </p>
        <div className={styles.splide}>
          <Splide
            options={{
              type: "loop",
              isNavigation: true,
              cloneStatus: false,
              arrows: true,
              pagination: false,
              perPage: 2,
              padding: "21rem",
              classes: {
                arrows: "splideArr",
              },
              breakpoints: {
                1281: {
                  perPage: 2,
                  padding: "10rem",
                },
                1345: {
                  perPage: 2,
                  padding: "20rem",
                },
              },
            }}
            aria-label="My Favorite Images"
          >
            {data.map((item, i) => {
              return (
                <SplideSlide key={i}>
                  <div
                    style={{
                      transition: "all 1s ease",
                    }}
                    className={styles.carouItem}
                  >
                    <div className="carouImgCon">
                      <Image src={item.img} alt="rec" />
                    </div>
                    <div
                      style={{ transition: "all 1s ease" }}
                      className="activeName"
                    >
                      <p>Name of the winner</p>
                      <h2>{item.name}</h2>
                      <span>COUNTRY</span>
                    </div>

                    <div style={{ opacity: 0 }}>
                      <p>Name of the winner</p>
                      <h2>{item.name}</h2>
                      <span>COUNTRY</span>
                    </div>
                  </div>
                </SplideSlide>
              );
            })}
          </Splide>
        </div>
      </div>
      <div className={styles.AliceCarou}>
        <p className={styles.activeDesc}>
          We&apos;ve given away <span>{Formater(17000)}</span> worth of timepieces -
          and counting
        </p>
        <Splide
          options={{
            rewind: true,
            type: "loop",
            mediaQuery: "max",
            breakpoints: {
              320: {
                padding: "0rem",
                perPage: 1,
              },
              375: {
                padding: "2rem",
              },
              393: {
                padding: "2rem",
              },

              425: {
                padding: "3rem",
                perPage: 1,
              },
              428: {
                padding: "4rem",
                perPage: 1,
              },
              500: {
                padding: "6rem",
                perPage: 1,
              },
              768: {
                padding: "0rem",
                perPage: 2,
              },
            },
            autoplay: true,
            arrows: false,
            pagination: false,
          }}
          aria-label="My Favorite Images"
        >
          {data.map((item, i) => {
            return (
              <SplideSlide key={i}>
                <div
                  style={{ transition: "all 1s ease" }}
                  className={styles.carouItem}
                >
                  <Image className={styles.active} src={item.img} alt="rec" />

                  <div
                    style={{ transition: "all 1s ease" }}
                    className="activeName"
                  >
                    <p>Name of the winner</p>
                    <h2>{item.name}</h2>
                    <span>COUNTRY</span>
                  </div>
                </div>
              </SplideSlide>
            );
          })}
        </Splide>
      </div>
    </div>
  );
};

export default Winners;
