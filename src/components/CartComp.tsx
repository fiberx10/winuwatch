/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styles from "@/styles/Cart.module.css";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";
import { Formater, api } from "@/utils";
import { useState } from "react";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import Loader from "./Loader";
const CartComp = () => {
  const t = useTranslations("cart");
  const [open, setOpen] = useState(false);
  const [wrong, setWrong] = useState(false);
  const handleClose = () => setOpen(false);
  const { cardDetails, updateComp, removeComp, competitions } = useCart();

  const { data, isLoading } = api.Competition.getAll.useQuery({
    ids: competitions.map(({ compID }) => compID),
  });

  const router = useRouter();
  //console.log(question);

  const { totalCost } = cardDetails();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "background.paper",
    border: "1px solid #CBB9AC",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };
  //TODO: Loading
  const questionImgs = [
    {
      img: "/images/Rolex_Sky-Dweller.jpg",
      name: "Rolex Sky-Dweller",
    },
    {
      img: "/images/ROLEX_COSMOGRAPH_DAYTONA_40MM_-_PANDA.png",
      name: "ROLEX COSMOGRAPH DAYTONA 40MM - PANDA",
    },
    {
      img: "/images/Audemars_Piguet_Royal_Oak.png",
      name: "Audemars Piguet Royal Oak",
    },
    {
      img: "/images/ROLEX_SUBMARINER_40MM_-_HULK_DIAMOND__EMERALD.jpg",
      name: "ROLEX SUBMARINER 40MM - HULK",
    },
  ];

  const [randomImage] = useState(
    questionImgs[Math.floor(Math.random() * questionImgs.length)]
  );
  console.log("competitions:", competitions);

  return (
    <div className={styles.CartMain}>
      {isLoading ? (
        <div
          style={{
            height: "40vh",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : data && competitions.length > 0 ? (
        competitions.map((comp, index) => {
          const ComptetionData = data.find(
            (compData) => compData.id === comp.compID
          );
          if (!ComptetionData || ComptetionData.Watches === null) return null;

          return (
            <div className={styles.Watch} key={index}>
              <div className={styles.watchLeft}>
                <Image
                  width={196}
                  height={195}
                  alt="watchImage"
                  src={
                    ComptetionData.Watches.images_url[0]?.url ||
                    "/images/watch.png"
                  }
                />
                <div className={styles.watchleftDesc}>
                  <h1>{ComptetionData.Watches.model}</h1>
                  <h4>{ComptetionData.Watches.Bracelet_material}</h4>
                  <p>{ComptetionData.Watches.brand}</p>
                </div>
              </div>
              <div className={styles.CartRight}>
                <div className={styles.Counter}>
                  <div
                    onClick={() => {
                      updateComp({
                        reduction:
                          comp.number_tickets === 6
                            ? 0.1
                            : comp.number_tickets === 11
                            ? 0.15
                            : comp.number_tickets === 21
                            ? 0.2
                            : 0,
                        compID: comp.compID,
                        number_tickets:
                          comp.number_tickets > 1
                            ? comp.number_tickets - 1
                            : comp.number_tickets,
                        price_per_ticket: ComptetionData.ticket_price,
                      });
                    }}
                    className={styles.CounterSelec}
                  >
                    <Image
                      width={13}
                      height={1}
                      src="/images/Minus.png"
                      alt="minus"
                    />
                  </div>
                  <div className={styles.counterValue}>
                    {comp.number_tickets}
                  </div>
                  <div
                    onClick={() => {
                      updateComp({
                        reduction:
                          comp.number_tickets === 4
                            ? 0.1
                            : comp.number_tickets === 9
                            ? 0.15
                            : comp.number_tickets === 19
                            ? 0.2
                            : 0,
                        compID: comp.compID,
                        number_tickets:
                          comp.number_tickets < ComptetionData.remaining_tickets
                            ? comp.number_tickets + 1
                            : comp.number_tickets,
                        price_per_ticket: ComptetionData.ticket_price,
                      });
                    }}
                    className={styles.CounterSelec}
                  >
                    <Image
                      width={11}
                      height={11}
                      src="/images/plus.png"
                      alt="plus"
                    />
                  </div>
                </div>
                <div className={styles.CartPriceCon}>
                  <h2>
                    {Formater(
                      comp.number_tickets * ComptetionData.ticket_price
                    )}
                  </h2>
                  <p>
                    {comp.reduction > 0 &&
                      (comp.number_tickets === 5 ||
                        comp.number_tickets === 10 ||
                        comp.number_tickets === 20) &&
                      `${t("discount")}: \t${Formater(
                        comp.reduction *
                          comp.number_tickets *
                          comp.price_per_ticket
                      )}`}
                  </p>
                  <p onClick={() => removeComp(comp.compID)}>{t("remove")}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <h1
          style={{
            fontFamily: "Iskry, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {t("emptycart")}
        </h1>
      )}

      <div className={styles.CartTotal}>
        <p>{t("total")}</p>
        <span>{Formater(totalCost)}</span>
      </div>
      <div className={styles.cartCheckoutCon}>
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("checkout")}
        </button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={open}>
            <Box className={styles.ModalBox} sx={style}>
              {competitions.length === 0 ? (
                <div className={styles.ModalBoxTopFlex}>
                  <p id="spring-modal-description">{t("cartempty")}</p>
                  <span onClick={handleClose}>
                    <CloseOutlined />
                  </span>
                </div>
              ) : (
                <>
                  <div className={styles.ModalBoxTopFlex}>
                    <p id="spring-modal-description">{t("tocontinue")}</p>
                    <span onClick={handleClose}>
                      <CloseOutlined />
                    </span>
                  </div>
                  <div className={styles.modalQuestion}>
                    {randomImage && (
                      <Image
                        src={randomImage.img}
                        style={{
                          objectFit: "cover",
                        }}
                        width={300}
                        height={150}
                        alt="questionImage"
                      />
                    )}

                    <h1>{t("whatwatch")}</h1>
                  </div>
                  <h2
                    style={{ display: wrong ? "flex" : "none", color: "red" }}
                  >
                    {t("wronganswer")}
                  </h2>
                  <div className={styles.questionsCon}>
                    {questionImgs.map(({ name }, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (randomImage?.name.includes(name)) {
                            router
                              .push("/CheckoutPage")
                              .then(() => {
                                return null;
                              })
                              .catch((e) => {
                                console.log(e);
                                return null;
                              });
                          } else {
                            setWrong(true);
                          }
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};

export default CartComp;
