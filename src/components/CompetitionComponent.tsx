import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/CompetitionPage.module.css";
import { useCart } from "./Store";
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
  const [image, setImage] = useState<string>(
    String(data.Watches.images_url[0])
  );
  const { addComp } = useCart();
  return (
    <div className={styles.CompetitionMain}>
      <div className={styles.images}>
        <Image
          width={450}
          height={440}
          style={{ objectFit: "cover" }}
          alt="watchImage"
          src={image || "/images/watch1.jpeg"}
        />
        <div>
          {
            // new array of image besides the first one
            data.Watches.images_url.slice(1).map((item, i) => (
              <Image
                onMouseEnter={() => setImage(item)}
                onMouseLeave={() =>
                  setImage(String(data.Watches.images_url[0]))
                }
                width={150}
                height={130}
                alt="watchImage"
                src={item}
                key={i}
              />
            ))
          }
        </div>
      </div>
      <div className={styles.CompRight}>
        <div className={styles.CompTit}>
          <h1>
            Win the {data.Watches.brand} - {data.Watches.model}
          </h1>
          <p>market value £19,000</p>
        </div>
        <div className={styles.CompTicketSelec}>
          <h3>How many tickets would you like?</h3>
          <div className={styles.tickets}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25].map((item, i) => (
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
                      item > data.remaining_tickets ? "not-allowed" : "pointer",
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
            ))}
          </div>
        </div>
        <div className={styles.donations}>
          <p>A part of the money is donated to the following associations</p>
          <div>
            <Image
              width={130}
              height={50}
              alt="donation"
              src="/images/cancerRes.png"
            />
            <Image
              width={130}
              height={50}
              style={{ objectFit: "contain" }}
              alt="donation"
              src="/images/woodlandLogo.png"
            />
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
        <button
          onClick={() => {
            addComp({
              compID: data.id,
              number_tickets: counter,
              price_per_ticket: data.price,
            });
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default CompetitionComponent;
