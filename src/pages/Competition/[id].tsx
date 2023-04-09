import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { z } from "zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import styles from "@/styles/CompetitionPage.module.css";
import { useCart } from "@/components/Store";
import ToggleButton from "@mui/material/ToggleButton";
import { Formater } from "@/utils";
import { useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import { Tooltip } from "@mui/material";
import Timer from "@/components/Timer";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  try {
    const compID = z.string().parse(context.params?.id);
    return {
      props: {
        compID,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

export default function Competition({
  compID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading } = api.Competition.byID.useQuery(compID);
  const [counter, setCounter] = useState(1);
  const [filter, setFilter] = useState(5);
  const { addComp, updateComp, competitions } = useCart();
  const [image, setImage] = useState<string | undefined>(undefined);
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>
          Win u Watch
          {data !== null && data && data.Watches !== null
            ? " - " + data.Watches.brand
            : ""}
        </title>
        <meta name="description" content="Win u Watch Competition" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {isLoading ? (
        <div
          style={{
            height: "80vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        data !== null &&
        data &&
        data.Watches !== null &&
        data.Watches && (
          <div className={styles.compWrapper}>
            <div className={styles.CompetitionMain}>
              <div className={styles.images}>
                {data.Watches.images_url[0]?.url && (
                  <Image
                    width={450}
                    height={440}
                    style={{ objectFit: "cover" }}
                    alt="watchImage"
                    className={styles.MainImage}
                    src={image ? image : data.Watches.images_url[0]?.url}
                  />
                )}

                <div className={styles.innerImages}>
                  {
                    // new array of image besides the first one
                    data.Watches.images_url
                      .filter((_, i) => i !== 0 && i < 4)
                      .slice(0, 3)
                      .map((item, i) => (
                        <Image
                          onMouseEnter={() => setImage(item.url)}
                          onMouseLeave={() => setImage(undefined)}
                          width={150}
                          height={130}
                          alt="watchImage"
                          src={item.url}
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
                  {data.remaining_tickets === 0 ? (
                    <>
                      <h3>Drawing Date for this competition in :</h3>
                      <Timer displayFlex={true} date={data.drawing_date} />
                    </>
                  ) : (
                    <h3>How many tickets would you like?</h3>
                  )}
                  <div className={styles.tickets}>
                    {data.remaining_tickets === 0 ? (
                      <p>No Tickets Left!</p>
                    ) : (
                      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25]
                        .filter((_, index) => index < filter)
                        .map((item, i) => (
                          <Tooltip
                            key={i}
                            title={
                              item > data.remaining_tickets
                                ? "No more tickets left!"
                                : ""
                            }
                          >
                            <ToggleButton
                              onClick={() => setCounter(item)}
                              disabled={
                                item > data.remaining_tickets ? true : false
                              }
                              sx={{
                                cursor:
                                  item > data.remaining_tickets
                                    ? "help"
                                    : "pointer",
                                width: "55px",
                                height: "55px",
                                backgroundColor:
                                  counter === item
                                    ? "rgb(146, 124, 102, 0.5)"
                                    : "initial",
                                color:
                                  counter === item
                                    ? "white !important"
                                    : "initial",
                                border:
                                  counter === item
                                    ? "2px solid rgb(146, 124, 102) !important"
                                    : "initial",
                              }}
                              value={item}
                              aria-label="left aligned"
                            >
                              <span
                                style={{
                                  fontSize:
                                    item === 5
                                      ? "18px"
                                      : item === 10
                                      ? "18px"
                                      : item === 15
                                      ? "18px"
                                      : item === 25
                                      ? "18px"
                                      : "24px",
                                  height:
                                    item === 5
                                      ? "23px"
                                      : item === 10
                                      ? "23px"
                                      : item === 15
                                      ? "23px"
                                      : item === 25
                                      ? "23px"
                                      : "initial",
                                }}
                              >
                                {item}
                              </span>
                              <p
                                style={{ fontSize: "10px" }}
                                className={styles.sold}
                              >
                                {item === 5
                                  ? "10% off"
                                  : item === 10
                                  ? "15% off"
                                  : item === 15
                                  ? "20% off"
                                  : item === 25
                                  ? "20% off"
                                  : ""}
                              </p>
                            </ToggleButton>
                          </Tooltip>
                        ))
                    )}
                    <button
                      style={{
                        display:
                          filter === 15
                            ? "none"
                            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25]
                                .length > data.remaining_tickets
                            ? "none"
                            : "flex",
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
                      A part of the money is donated to the following
                      associations
                    </p>
                    <div className={styles.compSponsors}>
                      {/* <Image
                        width={130}
                        height={50}
                        alt="donation"
                        src="/images/cancerRes.png"
                      /> */}
                      <Image
                        width={130}
                        height={50}
                        style={{ objectFit: "contain" }}
                        alt="donation"
                        src="/images/woodlandLogo.png"
                      />
                    </div>
                  </div>
                  {data.remaining_tickets === 0 ? (
                    ""
                  ) : (
                    <div className={styles.addtoCart}>
                      <div className={styles.prices}>
                        <p>
                          Tickets: {counter} x {Formater(data.ticket_price)}
                        </p>
                        <span>
                          {counter === 5
                            ? Formater(
                                counter * data.ticket_price -
                                  (counter * data.ticket_price * 10) / 100
                              )
                            : counter === 10
                            ? Formater(
                                counter * data.ticket_price -
                                  (counter * data.ticket_price * 15) / 100
                              )
                            : counter === 15
                            ? Formater(
                                counter * data.ticket_price -
                                  (counter * data.ticket_price * 20) / 100
                              )
                            : counter === 25
                            ? Formater(
                                counter * data.ticket_price -
                                  (counter * data.ticket_price * 20) / 100
                              )
                            : Formater(counter * data.ticket_price)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          competitions.length > 0
                            ? competitions.filter(
                                (comp) =>
                                  comp.compID === data.id &&
                                  updateComp({
                                    compID: data.id,
                                    number_tickets:
                                      counter + comp.number_tickets,
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
                  )}
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
                    {data.Watches.has_certificate &&
                      ", new digital warranty card "}
                    {data.Watches.has_box && "& fully boxed"}.
                  </p>
                  {data.max_space_in_final_draw && (
                    <p>
                      Maximum spaces in the final draw:{" "}
                      {data.max_space_in_final_draw}
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
                      Winner announcement: {data.drawing_date.toString()} in
                      direct live on instagram @winuwatch
                    </p>
                  )}

                  <p>
                    Runner-Up prizes: 4 players will win £25 credit into our
                    next competition.
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
                      "Bracelet material",
                    ].map((item, i) => {
                      return (
                        data.Watches && (
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
                                : item === "Bracelet material"
                                ? data.Watches.Bracelet_material
                                : ""}
                            </p>
                          </span>
                        )
                      );
                    })}
                  </div>
                  <div className={styles.left}>
                    {[
                      "Year of manufacture",
                      "Caliber/Gear",
                      "Number of stones",
                      "Glass",
                      "Bezel material",
                    ].map((item, i) => {
                      return (
                        data.Watches &&
                        data.Watches !== null && (
                          <span key={i}>
                            <b>{item}</b>
                            <p>
                              {item === "Year of manufacture"
                                ? data.Watches.year_of_manifacture
                                : item === "Caliber/Gear"
                                ? data.Watches.caliber_grear
                                : item === "Number of stones"
                                ? data.Watches.number_of_stones
                                : item === "Glass"
                                ? data.Watches.glass
                                : item === "Bezel material"
                                ? data.Watches.bezel_material
                                : ""}
                            </p>
                          </span>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <Footer />
    </div>
  );
}
