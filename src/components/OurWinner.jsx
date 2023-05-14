import React from "react";
import styles from "../styles/Home.module.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Formater } from "@/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

const OurWinner = () => {
  const data = [
    {
      img: "/images/winner/batman_winner.jfif",
      name: "Johan",
      country: "France",
    },
    {
      img: "/images/winner/winner_2.png",
      name: `Be the winner`,
      country: "France",
    },
    {
      img: "/images/winner/winner_3.png",
      name: "Be the winner",
      country: "France",
    },
    {
      img: "/images/winner/winner_4.png",
      name: "Be the winner",
      country: "France",
    },
  ];
  const t = useTranslations("winners");
  return (
    <div className={styles.WinnCon}>
      <h1
        style={{
          textAlign: "center",
          padding: "0",
        }}
      >
        {t("title")}
      </h1>

      <div className={styles.winnerCarou}>
        <p className={styles.activeDesc}>
          {t("desc1")} <span>{Formater(17000)}</span> {t("desc2")}
        </p>
        <div className={styles.splide}>
          <Splide
            options={{
              type: "loop",
              isNavigation: false,
              drag: false,
              cloneStatus: false,
              arrows: false,
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
                <SplideSlide
                  style={{
                    opacity: i === 0 ? 1 : 0,
                  }}
                  key={i}
                >
                  <div
                    style={{
                      transition: "all 1s ease",
                      opacity: i === 0 ? 1 : 0,
                    }}
                    className={styles.carouItem}
                  >
                    <div className="carouImgCon">
                      <Image
                        className={styles.active}
                        src={item.img}
                        alt="rec"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div
                      style={{
                        transition: "all 1s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      className="activeName"
                    >
                      {/* <p>{t("nameOfWinner")}</p> */}
                      <h2>{item.name}</h2>
                      <span style={{ textAlign: "center" }}>
                        {item.country.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ opacity: 0 }}>
                      {/* <p>{t("nameOfWinner")}</p> */}
                      <h2>{item.name}</h2>
                      <span style={{ textAlign: "center" }}>
                        {item.country.toUpperCase()}
                      </span>
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
          {t("desc1")} <span>£8,028,750</span> {t("desc2")}
        </p>
        <Splide
          options={{
            rewind: false,
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
            autoplay: false,
            arrows: false,
            pagination: false,
            drag: false,
          }}
          aria-label="My Favorite Images"
        >
          {data.map((item, i) => {
            return (
              <SplideSlide
                style={{
                  opacity: i === 0 ? 1 : 0,
                }}
                key={i}
              >
                <div
                  style={{
                    transition: "all 1s ease",
                    opacity: i === 0 ? 1 : 0,
                  }}
                  className={styles.carouItem}
                >
                  <Image
                    className={styles.active}
                    src={item.img}
                    alt="rec"
                    width={200}
                    height={200}
                  />

                  <div
                    style={{ transition: "all 1s ease" }}
                    className="activeName"
                  >
                    {/* <p>{t("nameOfWinner")}</p> */}
                    <h2>{item.name}</h2>
                    <span>{item.country.toUpperCase()}</span>
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

export default OurWinner;
