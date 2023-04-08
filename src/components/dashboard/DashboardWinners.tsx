/* eslint-disable @typescript-eslint/no-misused-promises */
import styles from "@/styles/Dashboard.module.css";
import { api } from "@/utils/api";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import Modal from "react-bootstrap/Modal";
import "react-datetime/css/react-datetime.css";
import Loader from "../Loader";

const DashboardWinners = () => {
  const [show, setShow] = useState({ modal: false, data: "" });
  const { data, refetch, isLoading } = api.Competition.getAll.useQuery({});
  const {
    mutateAsync: winner,
    data: winnerData,
    isLoading: winnerLoading,
  } = api.Winners.pickOneRandom.useMutation();

  const handleShow = (i: string) => {
    setShow({
      modal: true,
      data: i,
    });
  };
  const handleClose = () => {
    setShow({ modal: false, data: "" });
  };

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Winners</h1>
      </div>
      {isLoading ? (
        <div className={styles.LoaderWrapper}>
          <Loader />
        </div>
      ) : (
        <div className={styles.dashCompsGrid}>
          {data?.map((comp) => {
            if (comp === null || comp.Watches === null) return null;
            return (
              comp.status === "ACTIVE" && (
                <div className={styles.dashGridItem} key={comp.id}>
                  <h2>{comp.name}</h2>
                  <div className={styles.dashGridItemTop}>
                    <p>Creating date : {comp.createdAt.toDateString()}</p>
                    <p>Drawing date : {comp.drawing_date.toDateString()}</p>
                    <p>Ends : {comp.end_date.toDateString()}</p>
                    <p>Remaining Tickets : {comp.remaining_tickets}</p>
                    <p>Winner: {comp.winner ? comp.winner : "none"}</p>
                  </div>
                  <div className={styles.dashGridItemBot}>
                    <div>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          handleShow(comp.id);
                        }}
                      >
                        Draw Winner
                      </Button>
                    </div>
                    <span
                      style={{
                        color:
                          comp.status === "ACTIVE"
                            ? "green"
                            : comp.status === "NOT_ACTIVE"
                            ? "red"
                            : "blue",
                      }}
                    >
                      <GoPrimitiveDot />
                      {comp.status.valueOf() === "COMPLETED"
                        ? "COMPLETED"
                        : comp.status.valueOf() === "NOT_ACTIVE"
                        ? "NOT ACTIVE"
                        : "ACTIVE"}
                    </span>
                  </div>
                  {show.data === comp.id && (
                    <Modal size="xl" show={show.modal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Manage your competition</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <h3>For Competiton: {comp?.name}</h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <p>
                              Winner Drawing Date:{" "}
                              {comp?.drawing_date.toUTCString()}
                            </p>
                            <p>
                              Current Winner:{" "}
                              {comp.winner === null ? "none" : comp.winner}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          {winnerLoading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "2rem",
                              }}
                            >
                              <Loader />
                              <p style={{ color: "#a8957e", margin: "0" }}>
                                Loading Takes long if List of Participants is
                                big...
                              </p>
                            </div>
                          ) : winnerData &&
                            winnerData.competitionId === show.data ? (
                            <div>
                              <p>
                                New Winner is :{" "}
                                <b>
                                  {winnerData.Order.first_name}{" "}
                                  {winnerData.Order.last_name}
                                </b>
                              </p>
                              <p>
                                With Email: <b>{winnerData.Order.email}</b>
                              </p>
                              <p>
                                With Order ID: <b>{winnerData.orderId}</b>
                              </p>
                            </div>
                          ) : comp.winner === null ? (
                            <h5>
                              No winner in this competition click Draw Winner to
                              draw one.
                            </h5>
                          ) : (
                            <h5>The winner is: {comp.winner}</h5>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "2rem",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <u style={{ cursor: "pointer" }}>
                            Resend Congratulation email
                          </u>
                          <Button>Confirm Winner</Button>
                          <Button
                            variant="secondary"
                            onClick={async () => {
                              await winner(show.data);
                            }}
                          >
                            Draw Winner
                          </Button>
                        </div>
                      </Modal.Body>
                    </Modal>
                  )}
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardWinners;
