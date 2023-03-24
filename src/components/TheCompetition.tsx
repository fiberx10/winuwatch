import styles from "../styles/Home.module.css";
import Timer from "./Timer";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { api } from "@/utils/api";

const TheCompetition = () => {
  const { data } = api.Competition.getAll.useQuery({
    status: "ACTIVE",
  });
  return (
    <div id="theComp" style={{ marginBottom: "250px" }} className={styles.Comp}>
      <p className={styles.CompP}>
        “Necessarily a winner who will realize his dream or simply that of his
        wife”
      </p>
      <h1>The Competition</h1>
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
