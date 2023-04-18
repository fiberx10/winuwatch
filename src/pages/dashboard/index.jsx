import DashboardComp from "@/components/dashboard/DashboardComp";
import styles from "@/styles/Dashboard.module.css";
import DashboardMainNav from "@/components/dashboard/DashboardMainNav";
import { useStore as UseStore } from "@/components/Store";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardCompetitions from "@/components/dashboard/DashboardCompetitions";
import DashboardWatches from "@/components/dashboard/DashboardWatches";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import DashboardWinners from "@/components/dashboard/DashboardWinners";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";
import { Formik } from "formik";
import Image from "next/image";

export function ModalCheck() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const SignupSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            width: "100%",
          }}
        >
          <Image src="/images/logo.png" width={150} height={100} alt="logo" />
          <h2
            style={{
              margin: "0",
              marginTop: "-30px",
              fontFamily: "Iskry, sans-serif",
              textTransform: "uppercase",
            }}
          >
            Admin Dashboard
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "40vh",
            margin: "20px 0px",
          }}
        >
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              // same shape as initial values
              console.log(values);
            }}
          >
            {({ errors, touched, handleSubmit, handleChange }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      required
                      name="username"
                      onChange={handleChange}
                      placeholder="User Name"
                    />
                  </Form.Group>
                </Row>
                {errors.username && touched.username ? (
                  <div style={{ color: "red" }}>{errors.username}</div>
                ) : null}
                <Row className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                    />
                  </Form.Group>
                </Row>
                {errors.password && touched.password ? (
                  <div style={{ color: "red" }}>{errors.password}</div>
                ) : null}
                <Row
                  style={{ display: "grid", placeItems: "center" }}
                  className="mb-3"
                >
                  <Button
                    style={{
                      width: "95%",
                      backgroundColor: "#a8957e",
                      borderColor: "#a8957e",
                    }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const index = () => {
  const { menu } = UseStore();

  return (
    <div className={styles.MainCon}>
      <Head>
        <title>Win u Watch - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardMainNav />
      <div className={styles.dashBody}>
        <DashboardNav />
        <div className={styles.Body}>
          {menu === "Dashboard" ? (
            <DashboardComp />
          ) : menu === "Competitions" ? (
            <DashboardCompetitions />
          ) : menu === "Watches" ? (
            <DashboardWatches />
          ) : menu === "Orders" ? (
            <DashboardOrders />
          ) : menu === "Winners" ? (
            <DashboardWinners />
          ) : (
            <h1>Competitions</h1>
          )}
        </div>
      </div>
      <ModalCheck />
    </div>
  );
};

export default index;
