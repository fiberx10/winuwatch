/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styles from "@/styles/Cart.module.css";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";
import { Formater, api } from "@/utils";
import { useState } from "react";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
const CartComp = () => {
  const [open, setOpen] = useState(false);
  const [wrong, setWrong] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { cardDetails, updateComp, removeComp, competitions } = useCart();

  const { data } = api.Competition.getAll.useQuery({
    ids: competitions.map(({ compID }) => compID),
  });
  const { data: question } = api.Question.getOneRandom.useQuery();

  const router = useRouter();
  console.log(question);

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

  return (
    <div className={styles.CartMain}>
      {data && competitions.length > 0 ? (
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
                    ComptetionData.Watches.images_url[0]?.url || "/images/watch.png"
                  }
                />
                <div className={styles.watchleftDesc}>
                  <h1>{ComptetionData.Watches.brand}</h1>
                  <h4>{ComptetionData.Watches.Bracelet_material}</h4>
                  <p>{ComptetionData.Watches.model}</p>
                </div>
              </div>
              <div className={styles.CartRight}>
                <div className={styles.Counter}>
                  <div
                    onClick={() =>
                      updateComp({
                        compID: comp.compID,
                        number_tickets:
                          comp.number_tickets > 1
                            ? comp.number_tickets - 1
                            : comp.number_tickets,
                        price_per_ticket: ComptetionData.ticket_price,
                      })
                    }
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
                    onClick={() =>
                      updateComp({
                        compID: comp.compID,
                        number_tickets:
                          comp.number_tickets < ComptetionData.remaining_tickets
                            ? comp.number_tickets + 1
                            : comp.number_tickets,
                        price_per_ticket: ComptetionData.ticket_price,
                      })
                    }
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
                  <p onClick={() => removeComp(comp.compID)}>REMOVE</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <h1>No Items in the Cart</h1>
      )}

      <div className={styles.CartTotal}>
        <p>{`Total + (20%) VAT`}</p>
        <span>{Formater(totalCost * 1.02)}</span>
      </div>
      <div className={styles.cartCheckoutCon}>
        <button onClick={handleOpen}>Check Out</button>
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
                  <p id="spring-modal-description">Cart is empty</p>
                  <span onClick={handleClose}>
                    <CloseOutlined />
                  </span>
                </div>
              ) : (
                <>
                  <div className={styles.ModalBoxTopFlex}>
                    <p id="spring-modal-description">
                      In Order to continue to the checkout page you must answer
                      this question:
                    </p>
                    <span onClick={handleClose}>
                      <CloseOutlined />
                    </span>
                  </div>
                  <h1>{question?.question}</h1>
                  <h2
                    style={{ display: wrong ? "flex" : "none", color: "red" }}
                  >
                    Wrong Answer
                  </h2>
                  <div className={styles.questionsCon}>
                    {question?.answers.map((quest, i) => {
                      return (
                        <button
                          onClick={() => {
                            quest === question?.correctAnswer
                              ? router
                                  .push("/CheckoutPage")
                                  .then(() => {
                                    return null;
                                  })
                                  .catch(() => {
                                    return null;
                                  })
                              : setWrong(true);
                          }}
                          key={i}
                        >
                          {quest}
                        </button>
                      );
                    })}
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
