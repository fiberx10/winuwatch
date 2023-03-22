/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Timer from "./Timer";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { BackendLink } from "./Backend";

const TheCompetition = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      await fetch(`${BackendLink}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }
    fetchData();
  }, []);

  return (
    <div id="theComp" style={{ marginBottom: "250px" }} className={styles.Comp}>
      <h1>The Competition</h1>
      <div className={styles.compWatches}>
        {data.length > 0 ? (
          data.map((watch) => {
            return (
              <div className={styles.watches} key={watch.id}>
                <div className={styles.watchCon}>
                  <div className={styles.watchContent}>
                    <Link href={`/Competition/${watch.id}`}>Start now</Link>
                    <h3>{watch.Watch.name}</h3>
                    <p>Only {watch.remaining_tickets} tickets left!</p>
                  </div>
                </div>
                <Timer date={watch.end_date} />
              </div>
            );
          })
        ) : data.length === 0 ? (
          <h1>No Competition Available</h1>
        ) : (
          <>
            <div className={styles.watches}>
              <Skeleton
                variant="rectangular"
                width={491}
                height={489}
                className={styles.watchConSkelet}
              ></Skeleton>
            </div>
            <div className={styles.watches}>
              <Skeleton
                variant="rectangular"
                width={491}
                height={489}
                className={styles.watchConSkelet}
              ></Skeleton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TheCompetition;
