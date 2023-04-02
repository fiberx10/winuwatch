/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import styles from "@/styles/Dashboard.module.css";
import { Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "react-datetime/css/react-datetime.css";
import moment from "moment-timezone";
import EnhancedTable from "./OrdersTable";

const DashboardOrders = () => {
  const { data, isLoading } = api.Competition.getAll.useQuery();
  const [compIds, setCompIds] = useState(
    data?.map((comp) => {
      return comp.id;
    })
  );
  // UPDATE
  const [show, setShow] = useState({ modal: false, data: "" });

  // HANDLE UPDATE MODAL FORM
  const handleClose = () => {
    setShow({ modal: false, data: "" });
  };
  const handleShow = (i: string) => {
    setShow({
      modal: true,
      data: i,
    });
  };
  //DATA FROM BACKEND

  const { data: orders } = api.Order.getAll.useQuery(compIds);

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Competitions</h1>
      </div>
      {isLoading || data === null || !data ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.dashCompsGrid}>
          {data.map((comp) => {
            if (comp === null || comp.Watches === null) return null;
            return (
              <div className={styles.dashGridItem} key={comp.id}>
                <h2>{comp.name}</h2>
                <div className={styles.dashGridItemTop}>
                  <p>Creating date : {comp.createdAt.toDateString()}</p>
                  <p>Drawing date : {comp.drawing_date.toDateString()}</p>
                  <p>Ends : {comp.end_date.toDateString()}</p>
                  <p>Remaining Tickets : {comp.remaining_tickets}</p>
                  <p>
                    Prize : {comp.Watches.brand} {comp.Watches.model}
                  </p>
                  {comp.winner && <p>Winner : {comp.winner}</p>}
                </div>
                <div className={styles.dashGridItemBot}>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => handleShow(comp.id)}
                    >
                      Manage
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
                  <Modal size="lg" show={show.modal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Manage your competition</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EnhancedTable />
                    </Modal.Body>
                  </Modal>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
