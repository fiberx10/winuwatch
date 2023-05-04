/* eslint-disable @typescript-eslint/no-misused-promises */
import styles from "@/styles/Dashboard.module.css";
import { api } from "@/utils/api";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import Modal from "react-bootstrap/Modal";
import "react-datetime/css/react-datetime.css";
import Loader from "../Loader";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";

const DashboardWinners = () => {
  const [show, setShow] = useState({ modal: false, data: "" });
  const { data, isLoading } = api.Competition.getAll.useQuery({});
  const {
    mutateAsync: winner,
    data: winnerData,
    isLoading: winnerLoading,
  } = api.Winners.pickOneRandom.useMutation();
  const {
    mutateAsync: getWinner,
    data: winnerData2,
    isLoading: loading,
  } = api.Winners.getWinner.useMutation();

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
                          {loading ? (
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
                          ) : winnerData2 &&
                            winnerData2.Competition.id === show.data ? (
                            <div>
                              <p>
                                New Winner is :{" "}
                                <b>
                                  {winnerData2.Order.first_name}{" "}
                                  {winnerData2.Order.last_name}
                                </b>
                              </p>
                              <p>
                                With Email: <b>{winnerData2.Order.email}</b>
                              </p>
                              <p>
                                With Order ID: <b>{winnerData2.orderId}</b>
                              </p>
                              <p>
                                With Ticket ID: <b>{winnerData2.id}</b>
                              </p>
                            </div>
                          ) : winnerData2 &&
                            winnerData2.Competition.id !== show.data ? (
                            <h5>No Order was made in this competition.</h5>
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
                          <Formik
                            initialValues={{
                              ticketId: "",
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                              console.log("Form submitted:", values);
                              await getWinner(values.ticketId);
                              setSubmitting(false);
                            }}
                          >
                            {({ values, handleChange, handleSubmit }) => (
                              <Form
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "2rem",
                                }}
                                onSubmit={handleSubmit}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  {winnerData2 === null && (
                                    <p
                                      style={{
                                        color: "red",
                                        margin: "0",
                                      }}
                                    >
                                      No Order Found
                                    </p>
                                  )}
                                  <Form.Control
                                    required
                                    placeholder="Enter TicketId"
                                    name="ticketId"
                                    onChange={handleChange}
                                    value={values.ticketId}
                                  />
                                </div>
                                <Button
                                  style={{
                                    width: "200px",
                                  }}
                                  type="submit"
                                  variant="secondary"
                                >
                                  Draw Winner
                                </Button>
                              </Form>
                            )}
                          </Formik>
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
