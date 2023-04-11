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
import { GetStaticPropsContext } from "next";
import styles from "@/styles/CompetitionPage.module.css";
import { useCart } from "@/components/Store";
import ToggleButton from "@mui/material/ToggleButton";
import { Formater, DateFormater, MAX_TICKETS, TICKETREDUC } from "@/utils";
import { useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import Timer from "@/components/Timer";
import { useTranslations } from "next-intl";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const compID = z.string().parse(context.params?.id);
    return {
      props: {
        compID,
        messages: (await import(`../../../messages/${context?.locale}.json`))
          .default,
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
  const t = useTranslations("competition");
  const { data, isLoading } = api.Competition.byID.useQuery(compID);
  const [counter, setCounter] = useState({
    value: 1,
    reduction: 0,
  });
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
                    data.Watches.images_url.slice(1, 4).map(({ url }, i) => (
                      <Image
                        onMouseEnter={() => setImage(url)}
                        onMouseLeave={() => setImage(undefined)}
                        width={150}
                        height={130}
                        alt="watchImage"
                        src={url}
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
                  {data.remaining_tickets === 0 ||
                  data.end_date < new Date() ? (
                    <>
                      <h3>Drawing Date for this competition in :</h3>
                      <Timer displayFlex={true} date={data.drawing_date} />
                    </>
                  ) : (
                    <h3>How many tickets would you like?</h3>
                  )}
                  <div className={styles.tickets}>
                    {data.remaining_tickets === 0 ||
                    data.end_date < new Date() ? (
                      <p>No Tickets Left!</p>
                    ) : (
                      TICKETREDUC.filter(
                        ({ value }) =>
                          value <= data.remaining_tickets && value <= filter
                      ).map(({ value: item, reduction }, i) => (
                        <ToggleButton
                          key={i}
                          onClick={() => setCounter({ value: item, reduction })}
                          disabled={item > data.remaining_tickets}
                          sx={{
                            cursor:
                              item > data.remaining_tickets
                                ? "help"
                                : "pointer",
                            width: "55px",
                            height: "55px",
                            backgroundColor:
                              counter.value === item
                                ? "rgb(146, 124, 102, 0.5)"
                                : "initial",
                            color:
                              counter.value === item
                                ? "white !important"
                                : "initial",
                            border:
                              counter.value === item
                                ? "2px solid rgb(146, 124, 102) !important"
                                : "initial",
                          }}
                          value={item}
                          aria-label="left aligned"
                        >
                          <span
                            style={{
                              fontSize: reduction > 0 ? "18px" : "24px",
                              height: reduction > 0 ? "23px" : "initial",
                            }}
                          >
                            {item}
                          </span>
                          <p
                            style={{ fontSize: "10px" }}
                            className={styles.sold}
                          >
                            {reduction > 0 && `-${reduction * 100}%`}
                          </p>
                        </ToggleButton>
                      ))
                    )}
                    <button
                      style={{
                        display:
                          filter === MAX_TICKETS ||
                          data.remaining_tickets === 0 ||
                          data.end_date < new Date()
                            ? "none"
                            : "flex",
                      }}
                      onClick={() => setFilter(MAX_TICKETS)}
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
                  {data.remaining_tickets === 0 ||
                  data.end_date < new Date() ? (
                    ""
                  ) : (
                    <div className={styles.addtoCart}>
                      <div className={styles.prices}>
                        <p>
                          {` Tickets: ${counter.value} x ${Formater(
                            data.ticket_price
                          )}`}
                        </p>
                        {counter.reduction > 0 && (
                          <p>
                            {` Discount: ${Formater(
                              data.ticket_price *
                                counter.reduction *
                                counter.value
                            )}`}
                          </p>
                        )}
                        <span>
                          {Formater(
                            counter.value * data.ticket_price -
                              counter.value *
                                data.ticket_price *
                                counter.reduction
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          competitions.length > 0
                            ? competitions.filter(
                                (comp) =>
                                  comp.compID === data.id &&
                                  updateComp({
                                    reduction: counter.reduction,
                                    compID: data.id,
                                    number_tickets:
                                      counter.value + comp.number_tickets,
                                    price_per_ticket: data.ticket_price,
                                  })
                              )
                            : addComp({
                                reduction: counter.reduction,
                                compID: data.id,
                                number_tickets: counter.value,
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
                  {data.max_space_in_final_draw > 0 && (
                    <p>
                      Maximum spaces in the final draw:{" "}
                      {data.max_space_in_final_draw}
                    </p>
                  )}
                  {data.max_watch_number && (
                    <p>Maximum watch winners: {data.max_watch_number}</p>
                  )}
                  {data.end_date.toString() && (
                    <p>End of competition: {DateFormater(data.end_date)}</p>
                  )}
                  {data.end_date.toString() && (
                    <p>
                      Winner announcement: {DateFormater(data.drawing_date)} in
                      direct live on instagram @winuwatch
                    </p>
                  )}

                  <p>
                    Runner-Up prizes: 4 players will win {Formater(25)} credit
                    into our next competition.
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
                    ].map(
                      (item, i) =>
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
                    )}
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
