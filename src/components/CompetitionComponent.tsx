import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/CompetitionPage.module.css";
import { useCart } from "./Store";
import ToggleButton from "@mui/material/ToggleButton";
import { useRouter } from "next/router";
import type { RouterOutputs } from "@/utils/api";
import { Formater } from "@/utils";
const CompetitionComponent = ({
  data,
}: {
  data: RouterOutputs["Competition"]["byID"];
}) => {
  const [counter, setCounter] = useState(1);
  const [filter, setFilter] = useState(5);
  const [image, setImage] = useState(data.Watches.images_url[0]);
  const { addComp, updateComp, competitions } = useCart();
  const router = useRouter();

  return (
    <div className={styles.compWrapper}>
      <div className={styles.CompetitionMain}>
        <div className={styles.images}>
          <Image
            width={450}
            height={440}
            style={{ objectFit: "cover" }}
            alt="watchImage"
            className={styles.MainImage}
            src={image || "/images/watch1.jpeg"}
          />
          <div className={styles.innerImages}>
            {
              // new array of image besides the first one
              data.Watches.images_url
                .filter((_, i) => i !== 0)
                .map((item, i) => (
                  <Image
                    onMouseEnter={() => setImage(item)}
                    onMouseLeave={() => setImage(data.Watches.images_url[0])}
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
            <h1>{data.name}</h1>
            <p>market value {Formater(data.price)}</p>
          </div>
          <div className={styles.CompTicketSelec}>
            <h3>How many tickets would you like?</h3>
            <div className={styles.tickets}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25]
                .filter((_, index) => index < filter)
                .map((item, i) => (
                  <ToggleButton
                    key={i}
                    onClick={() => setCounter(item)}
                    sx={{
                      cursor:
                        item > data.remaining_tickets
                          ? "not-allowed"
                          : "pointer",
                      width: item >= 15 ? "68px" : "55px",
                      height: item >= 15 ? "68px" : "55px",
                      backgroundColor:
                        counter === item
                          ? "rgb(146, 124, 102, 0.5)"
                          : "initial",
                      color: counter === item ? "white !important" : "initial",
                      border:
                        counter === item
                          ? "2px solid rgb(146, 124, 102) !important"
                          : "initial",
                    }}
                    value={item}
                    aria-label="left aligned"
                  >
                    <span style={{ fontSize: item >= 15 ? "18px" : "24px" }}>
                      {item}
                    </span>
                    <p className={styles.sold}>{item >= 15 ? "20% off" : ""}</p>
                  </ToggleButton>
                ))}
              <button
                style={{
                  display: filter === 15 ? "none" : "flex",
                }}
                onClick={() => setFilter(15)}
                className={styles.showMore}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.CompBot}>
            <div className={styles.donations}>
              <p>
                A part of the money is donated to the following associations
              </p>
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
            <div className={styles.addtoCart}>
              <div className={styles.prices}>
                <p>
                  Tickets: {counter} x {Formater(data.ticket_price)}
                </p>
                <span>{Formater(counter * data.ticket_price)}</span>
              </div>
              <button
                onClick={() => {
                  competitions.length > 0
                    ? competitions.filter(
                        (comp) =>
                          comp.compID === data.id &&
                          updateComp({
                            compID: data.id,
                            number_tickets: counter + comp.number_tickets,
                            price_per_ticket: data.ticket_price,
                          })
                      )
                    : addComp({
                        compID: data.id,
                        number_tickets: counter,
                        price_per_ticket: data.ticket_price,
                      });
                  void router.push("/Cart");
                }}
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.compDesc}>
        <div className={styles.compDet}>
          <h1>Competition details</h1>
          <div className={styles.compDetails}>
            <p>
              Prize: {data.Watches.brand} {data.Watches.model}{" "}
              {data.Watches.reference_number} - Comes with full paperwork
              {data.Watches.has_certificate && ", new digital warranty card "}
              {data.Watches.has_box && "& fully boxed"}.
            </p>
            {data.max_space_in_final_draw && (
              <p>
                Maximum spaces in the final draw: {data.max_space_in_final_draw}
              </p>
            )}
            {data.max_watch_number && (
              <p>Maximum watch winners: {data.max_watch_number}</p>
            )}
            {data.end_date.toString() && (
              <p>End of competition: {data.end_date.toString()}</p>
            )}
            {data.end_date.toString() && (
              <p>
                Winner announcement: {data.end_date.toString()} in direct live
                on instagram @winuwatch
              </p>
            )}

            <p>
              Runner-Up prizes: 4 players will win £25 credit into our next
              competition.
            </p>
          </div>
        </div>
        <div className={styles.compDet}>
          <h1>Watch information</h1>
          <div className={styles.watchInfo}>
            <div className={styles.left}>
              {[
                "Brand",
                "Model",
                "Reference number",
                "Movement",
                "Case",
                "Bracelet material",
              ].map((item, i) => {
                return (
                  <span key={i}>
                    <b>{item}</b>
                    <p
                      style={{
                        textDecoration:
                          item === "Brand" ||
                          item === "Model" ||
                          item === "Reference number"
                            ? "underline"
                            : "none",
                      }}
                    >
                      {item === "Brand"
                        ? data.Watches.brand
                        : item === "Model"
                        ? data.Watches.model
                        : item === "Reference number"
                        ? data.Watches.reference_number
                        : item === "Movement"
                        ? data.Watches.movement
                        : item === "Case"
                        ? data.Watches.Bracelet_material
                        : item === "Bracelet material"
                        ? data.Watches.Bracelet_material
                        : ""}
                    </p>
                  </span>
                );
              })}
            </div>
            <div className={styles.left}>
              {[
                "Year of manufacture",
                "Caliber/Gear",
                "Power reserve time",
                "Number of stones",
                "Glass",
                "Bezel material",
              ].map((item, i) => {
                return (
                  <span key={i}>
                    <b>{item}</b>
                    <p>
                      {item === "Year of manufacture"
                        ? data.Watches.year_of_manifacture
                        : item === "Caliber/Gear"
                        ? data.Watches.caliber_grear
                        : item === "Power reserve time"
                        ? "70 h"
                        : item === "Number of stones"
                        ? data.Watches.number_of_stones
                        : item === "Glass"
                        ? data.Watches.glass
                        : item === "Bezel material"
                        ? data.Watches.bezel_material
                        : ""}
                    </p>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionComponent;
