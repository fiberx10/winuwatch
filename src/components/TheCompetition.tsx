import styles from "../styles/Home.module.css";
import Timer from "./Timer";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { api } from "@/utils/api";
import { useEffect } from "react";

const TheCompetition = () => {
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background2 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "center" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { data } = api.Competition.getAll.useQuery({
    status: "ACTIVE",
  });
  return (
    <div id="theComp" style={{ marginBottom: "200px" }} className={styles.Comp}>
      <p className={styles.CompP}>
        “An assured winner who will achieve his dream or simply that of his
        partner”
      </p>
      <h1 className={styles.background2}>The Competition</h1>
      <div className={styles.compWatches}>
        {data && data.length > 0 ? (
          data.map((watch) => {
            return (
              <div className={styles.watches} key={watch.id}>
                <div
                  style={{
                    background: watch.Watches.images_url[0]
                      ? `linear-gradient(
                      180deg,
                      rgba(255, 255, 255, 0) 0%,
                      rgba(255, 255, 255, 0) 36.25%,
                      #faf8f6 100%
                    ),
                    url(${watch.Watches.images_url[0]})`
                      : `linear-gradient(
                      180deg,
                      rgba(255, 255, 255, 0) 0%,
                      rgba(255, 255, 255, 0) 36.25%,
                      #faf8f6 100%
                    ),
                    url(../../public/images/tester.png)`,
                  }}
                  className={styles.watchCon}
                >
                  <div className={styles.watchContent}>
                    <Link href={`/Competition/${watch.id}`}>Start now</Link>
                    <h3>{watch.name}</h3>
                    <p>Only {watch.remaining_tickets} tickets left!</p>
                  </div>
                </div>
                <Timer date={watch.end_date} />
              </div>
            );
          })
        ) : data?.length === 0 ? (
          <h1>No Competition Available</h1>
        ) : (
          <div className={styles.watches}>
            <Skeleton
              variant="rectangular"
              width={491}
              height={489}
              className={styles.watchConSkelet}
            ></Skeleton>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheCompetition;
/*
import styles from "../styles/Home.module.css";
import Timer from "./Timer";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { api } from "@/utils/api";
import { useEffect } from "react";

const TheCompetition = () => {
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background2 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "center" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { data } = api.Competition.getAll.useQuery({
    status: "ACTIVE",
  });
  return (
    <div id="theComp" style={{ marginBottom: "200px" }} className={styles.Comp}>
      <p className={styles.CompP}>
        “An assured winner who will achieve his dream or simply that of his
        partner”
      </p>
      <h1 className={styles.background2}>The Competition</h1>
      <div className={styles.compWatches}>
        {data && data.length > 0 ? (
          data.map((watch) => {
            return (
              <div className={styles.watches} key={watch.id}>
                <div className={styles.watchCon}>
                  <div className={styles.watchContent}>
                    <Link href={`/Competition/${watch.id}`}>Start now</Link>
                    <h3>
                      {watch.Watches.brand} {watch.Watches.model}
                    </h3>
                    <h4>{watch.Watches.reference_number} </h4>
                    <p>Only {watch.remaining_tickets} tickets left!</p>
                  </div>
                </div>
                <Timer date={watch.end_date} />
              </div>
            );
          })
        ) : data?.length === 0 ? (
          <h1>No Competition Available</h1>
        ) : (
          <div className={styles.watches}>
            <Skeleton
              variant="rectangular"
              width={491}
              height={489}
              className={styles.watchConSkelet}
            ></Skeleton>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheCompetition;
*/
