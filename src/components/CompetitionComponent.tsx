import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/CompetitionPage.module.css";
import useCart from "./Store";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Competition, Watches } from "@prisma/client";

const CompetitionComponent = ({
  data,
}: {
  data: Competition & {
    Watches: Watches;
  };
}) => {
  const [counter, setCounter] = useState(1);
  const [borderStyles, setBorderStyles] = useState(1);
  const Arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25];
  const {updateOrder, addComp, removeComp} = useCart()
  return (
    <div className={styles.CompetitionMain}>
      <Image

        width={440}
        height={440}
        alt="watchImage"
        src={data.Watches.imageURL[0] || "/images/watch1.jpeg"}
      />
      <div className={styles.CompRight}>
        <div className={styles.CompTit}>
          <h1>Win the {data.Watches.name}</h1>
          <p>market value £19,000</p>
        </div>
        <div className={styles.CompTicketSelec}>
          <h3>How many tickets would you like?</h3>
          <div className={styles.tickets}>
            {Arr.map((item, i) => {
              return (
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  key={i}
                  //TODO: fix this
                  //onChange={(e) => setBorderStyles(e.target.value as number)}
                  aria-label="text alignment"
                >
                  <ToggleButton
                    sx={{
                      cursor:
                        item > data.remaining_tickets
                          ? "not-allowed"
                          : "pointer",
                      width: item >= 15 ? "68px" : "55px",
                      height: item >= 15 ? "68px" : "55px",
                    }}
                    value={item}
                    aria-label="left aligned"
                  >
                    <span style={{ fontSize: item >= 15 ? "18px" : "24px" }}>
                      {item}
                    </span>
                    <p className={styles.sold}>{item >= 15 ? "20% off" : ""}</p>
                  </ToggleButton>
                </ToggleButtonGroup>
              );
            })}
          </div>
        </div>
        <div className={styles.Counter}>
          <div
            onClick={() => counter > 1 && setCounter(counter - 1)}
            className={styles.CounterSelec}
          >
            <Image width={13} height={1} src="/images/Minus.png" alt="minus" />
          </div>
          <div className={styles.counterValue}>{counter}</div>
          <div
            onClick={() =>
              counter < data.remaining_tickets && setCounter(counter + 1)
            }
            className={styles.CounterSelec}
          >
            <Image width={11} height={11} src="/images/plus.png" alt="plus" />
          </div>
        </div>
        <button onClick={() => {
          addComp({
            compID : data.id,
            number_tickets : counter,
            price_per_ticket : data.price
          })
        }} >ADD TO CART</button>
      </div>
    </div>
  );
};

export default CompetitionComponent;
