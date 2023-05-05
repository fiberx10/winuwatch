/* eslint-disable @typescript-eslint/no-misused-promises */
import styles from "@/styles/Dashboard.module.css";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import Modal from "react-bootstrap/Modal";
import "react-datetime/css/react-datetime.css";
import Loader from "../Loader";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";

const DashboardNewsLetters = () => {
  const [show, setShow] = useState({ modal: false, data: "" });
  const { data, isLoading, refetch } = api.Competition.getAll.useQuery({});
  const { mutateAsync: sendNewsLetter } =
    api.Winners.sendNewsLetters.useMutation();
  const handleClose = () => {
    setShow({ modal: false, data: "" });
  };

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your NewsLetters</h1>
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
                        onClick={() => setShow({ modal: true, data: comp.id })}
                        variant="primary"
                      >
                        Send NewsLetters
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
                    <Modal show={show.modal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Hello</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={async () => {
                            await sendNewsLetter(comp.id);
                            setShow({ modal: false, data: "" });
                          }}
                        >
                          Send NewsLetters
                        </Button>
                      </Modal.Footer>
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

export default DashboardNewsLetters;
