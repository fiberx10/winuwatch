import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/CompetitionPage.module.css";
import useStore from "./Store";
import { BackendLink } from "./Backend";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const CompetitionComponent = ({ data }) => {
  const [counter, setCounter] = useState(1);
  const [borderStyles, setBorderStyles] = useState(1);
  const increasePopulation = useStore((state) => state.increasePopulation);
  const Arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25];
  function SetItem() {
    const items = {
      compID: data.id,
      number_tickets: counter,
    };
    if (typeof window !== "undefined") {
      var a = [];
      // Parse the serialized data back into an aray of objects
      a = JSON.parse(localStorage.getItem("cartItems")) || [];
      // Push the new data (whether it be an object or anything else) onto the array

      if (
        a.map((u) => u.compID === items.compID)[0] === true ||
        a.map((u) => u.compID === items.compID)[1] === true
      ) {
        const newa = a.map((u) => (u.compID !== items.compID ? u : items));
        a = newa;
      } else {
        a.push(items);
      }

      // Alert the array value
      // Re-serialize the array back into a string and store it in localStorage
      localStorage.setItem("cartItems", JSON.stringify(a));
      increasePopulation(a.length);
    }
  }
  const myLoader = ({ src }) => {
    return `${BackendLink}/watch1.jpeg`;
  };
  console.log(borderStyles);
  return (
    <div className={styles.CompetitionMain}>
      <Image
        loader={myLoader}
        width={440}
        height={440}
        alt="watchImage"
        src={`${BackendLink}/watch1.jpeg`}
      />
      <div className={styles.CompRight}>
        <div className={styles.CompTit}>
          <h1>Win the {data.Watch.name}</h1>
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
                  onChange={(e) => setBorderStyles(e.target.value)}
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
            <Image src="/images/Minus.png" alt="minus" />
          </div>
          <div className={styles.counterValue}>{counter}</div>
          <div
            onClick={() =>
              counter < data.remaining_tickets && setCounter(counter + 1)
            }
            className={styles.CounterSelec}
          >
            <Image src="/images/plus.png" alt="plus" />
          </div>
        </div>
        <button onClick={SetItem}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default CompetitionComponent;
