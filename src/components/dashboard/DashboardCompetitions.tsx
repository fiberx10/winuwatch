/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import styles from "@/styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { GoPrimitiveDot } from "react-icons/go";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";
import moment, { type Moment } from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import UpcomingComps from "./UpcomingComps";
import Loader from "../Loader";
import * as Yup from "yup";
import { ExportToCsv } from "export-to-csv";
const FixDate = (date: moment.MomentInput) =>
  moment(date).tz("Europe/London").toDate();

const DashboardCompetitions = () => {
  //REMOVE COMPETITION
  const [remove, setRemove] = useState({ modal: false, id: "" });
  const handleRemove = (id: string) => {
    setRemove({
      modal: true,
      id: id,
    });
  };
  const handleNoRemove = () => {
    setRemove({ modal: false, id: "" });
  };
  //ADD
  const [add, setAdd] = useState(false);

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
  const { isLoading: CSVLoading, mutateAsync: CSVDownload } = api.Competition.getConfirmedAsCSV.useMutation();
  //DATA FROM BACKEND
  const { data, isLoading, refetch } = api.Competition.getAll.useQuery();
  const { data: activeComps, refetch: activeFetch } =
    api.Competition.getAll.useQuery({
      status: "ACTIVE",
    });
  const { data: noActiveComps, refetch: noActiveFetch } =
    api.Competition.getAll.useQuery({
      status: "NOT_ACTIVE",
    });
  const { data: completedComps, refetch: completedFetch } =
    api.Competition.getAll.useQuery({
      status: "COMPLETED",
    });
  const { data: watches } = api.Watches.getAll.useQuery();
  const { mutateAsync: removeComp } = api.Competition.delete.useMutation();
  const { mutateAsync: addComp, isError: addError } =
    api.Competition.add.useMutation();
  const { mutateAsync: updateComp, isError: updateError } =
    api.Competition.updateOne.useMutation();
  const FormSchema = Yup.object().shape({
    watchesId: Yup.string().required("Required").notOneOf(["0"]),
  });
  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Competitions</h1>
        {(addError || updateError) && (
          <p style={{ color: "red" }}>
            Cannot put the same watch on multiple competitions!
          </p>
        )}
        <Button onClick={() => setAdd(true)} variant="primary">
          <PlusOutlined /> Add
        </Button>
      </div>
      {isLoading || data === null || !data ? (
        <div className={styles.LoaderWrapper}>
          <Loader />
        </div>
      ) : (
        <Accordion defaultActiveKey={["0"]}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Active Competitions ({activeComps?.length})
            </Accordion.Header>
            <Accordion.Body>
              <div className={styles.dashCompsGrid}>
                {data.map((comp) => {
                  if (comp === null || comp.Watches === null) return null;
                  return (
                    comp.status === "ACTIVE" && (
                      <div className={styles.dashGridItem} key={comp.id}>
                        <h2>{comp.name}</h2>
                        <div className={styles.dashGridItemTop}>
                          <p>Creating date : {comp.createdAt.toDateString()}</p>
                          <p>
                            Drawing date : {comp.drawing_date.toDateString()}
                          </p>
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
                              onClick={() => handleRemove(comp.id)}
                              variant="danger"
                            >
                              Remove
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => handleShow(comp.id)}
                            >
                              Manage
                            </Button>
                            <Button
                              variant="success"
                              disabled={CSVLoading}
                              onClick={async () => {
                                //Here
                                new ExportToCsv({
                                  fieldSeparator: ",",
                                  quoteStrings: '"',
                                  decimalSeparator: ".",
                                  showLabels: true,
                                  showTitle: false,
                                  title: "List of clients",
                                  useTextFile: false,
                                  useBom: true,
                                  useKeysAsHeaders: true,
                                  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
                                }).generateCsv(await CSVDownload(comp.id));
                              }}
                            >
                              Export emails
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
                              <Modal.Title>Manage your competition</Modal.Title>
                            </Modal.Header>
                            <Formik
                              onSubmit={async (values, actions) => {
                                setShow({ modal: false, data: "" });

                                console.log("Form submitted:", values);
                                await updateComp({
                                  ...values,
                                  id: comp.id,
                                });
                                await refetch();
                                await activeFetch();
                                await noActiveFetch();
                                await completedFetch();
                                actions.setSubmitting(false);
                              }}
                              initialValues={{
                                name: comp.name,
                                start_date: FixDate(comp.start_date),
                                end_date: FixDate(comp.end_date),
                                location: comp.location,
                                price: comp.price,
                                max_space_in_final_draw:
                                  comp.max_space_in_final_draw,
                                max_watch_number: comp.max_watch_number,
                                run_up_prize: comp.run_up_prize as string,
                                watchesId:
                                  comp.Watches === null
                                    ? undefined
                                    : comp.Watches.id,
                                total_tickets: comp.total_tickets,
                                ticket_price: comp.ticket_price,
                                status: comp.status,
                                drawing_date: FixDate(comp.drawing_date),
                                remaining_tickets: comp.remaining_tickets,
                              }}
                            >
                              {({
                                values,
                                handleSubmit,
                                handleChange,
                                setFieldValue,
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                  <Modal.Body>
                                    <Row className="mb-3">
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Name of Competition
                                        </Form.Label>
                                        <Form.Control
                                          name="name"
                                          onChange={handleChange}
                                          value={values.name}
                                          placeholder="Enter Name"
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Start Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "start_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.start_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "start_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>

                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          End Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "end_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.end_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "end_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Drawing Date of The Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "drawing_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.drawing_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "drawing_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        controlId="formGridPassword"
                                      >
                                        <Form.Label>Overall Price</Form.Label>
                                        <Form.Control
                                          type="number"
                                          value={values.price}
                                          placeholder="Price"
                                          name="price"
                                          onChange={handleChange}
                                        />
                                      </Form.Group>
                                    </Row>
                                    <Row classa="mb-3"></Row>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Run up Prize</Form.Label>
                                      <Form.Control
                                        onChange={handleChange}
                                        value={values.run_up_prize}
                                        type="text"
                                        placeholder="Run up Prize"
                                        name="run_up_prize"
                                      />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        Watch of The Competition
                                      </Form.Label>
                                      <Form.Select
                                        name="watchesId"
                                        onChange={handleChange}
                                        value={values.watchesId}
                                      >
                                        {watches?.map((watch, i) => {
                                          return (
                                            <option key={i} value={watch.id}>
                                              {watch.brand} {watch.model}
                                            </option>
                                          );
                                        })}
                                      </Form.Select>
                                    </Form.Group>

                                    <Row className="mb-3">
                                      <Form.Group as={Col}>
                                        <Form.Label>Total Tickets</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          name="total_tickets"
                                          type="number"
                                          placeholder="Total Tickets"
                                          value={values.total_tickets}
                                        />
                                      </Form.Group>

                                      <Form.Group as={Col}>
                                        <Form.Label>Ticket Price</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          type="number"
                                          placeholder="Price Per Ticket"
                                          value={values.ticket_price}
                                          name="ticket_price"
                                        />
                                      </Form.Group>

                                      <Form.Group
                                        as={Col}
                                        controlId="formGridZip"
                                      >
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                          onChange={handleChange}
                                          name="status"
                                          value={values.status}
                                        >
                                          <option value="ACTIVE">ACTIVE</option>
                                          <option value="NOT_ACTIVE">
                                            NOT ACTIVE
                                          </option>
                                          <option value="COMPLETED">
                                            COMPLETED
                                          </option>
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose}
                                    >
                                      Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                      Save Changes
                                    </Button>
                                  </Modal.Footer>
                                </Form>
                              )}
                            </Formik>
                          </Modal>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Non Active Competitions ({noActiveComps?.length})
            </Accordion.Header>
            <Accordion.Body>
              <div className={styles.dashCompsGrid}>
                {data?.map((comp) => {
                  if (comp === null || comp.Watches === null) return null;
                  return (
                    comp.status === "NOT_ACTIVE" && (
                      <div className={styles.dashGridItem} key={comp.id}>
                        <h2>{comp.name}</h2>
                        <div className={styles.dashGridItemTop}>
                          <p>Creating date : {comp.createdAt.toDateString()}</p>
                          <p>
                            Drawing date : {comp.drawing_date.toDateString()}
                          </p>
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
                              onClick={() => handleRemove(comp.id)}
                              variant="danger"
                            >
                              Remove
                            </Button>
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
                                comp.status.valueOf() === "ACTIVE"
                                  ? "green"
                                  : comp.status === "NOT_ACTIVE"
                                  ? "red"
                                  : "blue",
                            }}
                          >
                            <GoPrimitiveDot />
                            {comp.status.valueOf() === "COMPLETED"
                              ? "COMPLETED"
                              : comp.status === "NOT_ACTIVE"
                              ? "NOT ACTIVE"
                              : "ACTIVE"}
                          </span>
                        </div>
                        {show.data === comp.id && (
                          <Modal show={show.modal} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Manage your competition</Modal.Title>
                            </Modal.Header>
                            <Formik
                              onSubmit={async (values, actions) => {
                                setShow({ modal: false, data: "" });

                                console.log("Form submitted:", values);
                                await updateComp({
                                  ...values,
                                  id: comp.id,
                                });
                                await refetch();
                                await activeFetch();
                                await noActiveFetch();
                                await completedFetch();
                                actions.setSubmitting(false);
                              }}
                              initialValues={{
                                name: comp.name,
                                start_date: FixDate(comp.start_date),
                                end_date: FixDate(comp.end_date),
                                location: comp.location,
                                price: comp.price,
                                max_space_in_final_draw:
                                  comp.max_space_in_final_draw,
                                max_watch_number: comp.max_watch_number,
                                run_up_prize: comp.run_up_prize as string,
                                watchesId: comp.Watches.id,
                                total_tickets: comp.total_tickets,
                                ticket_price: comp.ticket_price,
                                status: comp.status,
                                drawing_date: FixDate(comp.drawing_date),
                                remaining_tickets: comp.remaining_tickets,
                              }}
                            >
                              {({
                                values,
                                handleSubmit,
                                handleChange,
                                setFieldValue,
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                  <Modal.Body>
                                    <Row className="mb-3">
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Name of Competition
                                        </Form.Label>
                                        <Form.Control
                                          name="name"
                                          onChange={handleChange}
                                          value={values.name}
                                          placeholder="Enter Name"
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Start Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "start_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.start_date}
                                          onChange={(value: string | Moment) =>
                                            setFieldValue(
                                              "start_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Drawing Date of The Competition
                                        </Form.Label>
                                        <Datetime
                                          utc={true}
                                          input={true}
                                          inputProps={{
                                            name: "drawing_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.drawing_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "drawing_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          End Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "end_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.end_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "end_date",
                                              new Date(FixDate(value))
                                            )
                                          }
                                        />
                                      </Form.Group>

                                      <Form.Group
                                        as={Col}
                                        controlId="formGridPassword"
                                      >
                                        <Form.Label>Overall Price</Form.Label>
                                        <Form.Control
                                          type="number"
                                          value={values.price}
                                          placeholder="Price"
                                          name="price"
                                          onChange={handleChange}
                                        />
                                      </Form.Group>
                                    </Row>
                                    <Row classa="mb-3"></Row>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Run up Prize</Form.Label>
                                      <Form.Control
                                        onChange={handleChange}
                                        value={values.run_up_prize}
                                        type="text"
                                        placeholder="Run up Prize"
                                        name="run_up_prize"
                                      />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        Watch of The Competition
                                      </Form.Label>
                                      <Form.Select
                                        name="watchesId"
                                        onChange={handleChange}
                                        value={values.watchesId}
                                      >
                                        {watches?.map((watch, i) => {
                                          return (
                                            <option key={i} value={watch.id}>
                                              {watch.brand} {watch.model}
                                            </option>
                                          );
                                        })}
                                      </Form.Select>
                                    </Form.Group>

                                    <Row className="mb-3">
                                      <Form.Group as={Col}>
                                        <Form.Label>Total Tickets</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          name="total_tickets"
                                          type="number"
                                          placeholder="Total Tickets"
                                          value={values.total_tickets}
                                        />
                                      </Form.Group>

                                      <Form.Group as={Col}>
                                        <Form.Label>Ticket Price</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          type="number"
                                          placeholder="Price Per Ticket"
                                          value={values.ticket_price}
                                          name="ticket_price"
                                        />
                                      </Form.Group>

                                      <Form.Group
                                        as={Col}
                                        controlId="formGridZip"
                                      >
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                          onChange={handleChange}
                                          name="status"
                                          value={values.status}
                                        >
                                          <option value="ACTIVE">ACTIVE</option>
                                          <option value="NOT_ACTIVE">
                                            NOT ACTIVE
                                          </option>
                                          <option value="COMPLETED">
                                            COMPLETED
                                          </option>
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose}
                                    >
                                      Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                      Save Changes
                                    </Button>
                                  </Modal.Footer>
                                </Form>
                              )}
                            </Formik>
                          </Modal>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              Completed Competitions ({completedComps?.length})
            </Accordion.Header>
            <Accordion.Body>
              <div className={styles.dashCompsGrid}>
                {data?.map((comp) => {
                  if (comp === null || comp.Watches === null) return null;

                  return (
                    comp.status === "COMPLETED" && (
                      <div className={styles.dashGridItem} key={comp.id}>
                        <h2>{comp.name}</h2>
                        <div className={styles.dashGridItemTop}>
                          <p>Creating date : {comp.createdAt.toDateString()}</p>
                          <p>
                            Drawing date : {comp.drawing_date.toDateString()}
                          </p>
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
                              onClick={() => handleRemove(comp.id)}
                              variant="danger"
                            >
                              Remove
                            </Button>
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
                                comp.status.valueOf() === "ACTIVE"
                                  ? "green"
                                  : comp.status.valueOf() === "NOT_ACTIVE"
                                  ? "red"
                                  : "blue",
                            }}
                          >
                            <GoPrimitiveDot />
                            {comp.status === "COMPLETED"
                              ? "COMPLETED"
                              : comp.status === "NOT_ACTIVE"
                              ? "NOT ACTIVE"
                              : "ACTIVE"}
                          </span>
                        </div>
                        {show.data === comp.id && (
                          <Modal show={show.modal} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Manage your competition</Modal.Title>
                            </Modal.Header>
                            <Formik
                              onSubmit={async (values, actions) => {
                                setShow({ modal: false, data: "" });

                                console.log("Form submitted:", values);
                                await updateComp({
                                  ...values,
                                  id: comp.id,
                                });
                                await refetch();
                                await activeFetch();
                                await noActiveFetch();
                                await completedFetch();
                                actions.setSubmitting(false);
                              }}
                              initialValues={{
                                name: comp.name,
                                start_date: comp.start_date,
                                end_date: comp.end_date,
                                location: comp.location,
                                price: comp.price,
                                max_space_in_final_draw:
                                  comp.max_space_in_final_draw,
                                max_watch_number: comp.max_watch_number,
                                run_up_prize: comp.run_up_prize as string,
                                watchesId: comp.Watches.id,
                                total_tickets: comp.total_tickets,
                                ticket_price: comp.ticket_price,
                                status: comp.status,
                                drawing_date: comp.drawing_date,
                                remaining_tickets: comp.remaining_tickets,
                              }}
                            >
                              {({
                                values,
                                handleSubmit,
                                handleChange,
                                setFieldValue,
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                  <Modal.Body>
                                    <Row className="mb-3">
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Name of Competition
                                        </Form.Label>
                                        <Form.Control
                                          name="name"
                                          onChange={handleChange}
                                          value={values.name}
                                          placeholder="Enter Name"
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Start Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "start_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.start_date}
                                          onChange={(value: string | Moment) =>
                                            setFieldValue(
                                              "start_date",
                                              new Date(
                                                moment(value)
                                                  .tz("Europe/London")
                                                  .format()
                                              )
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Drawing Date of The Competition
                                        </Form.Label>
                                        <Datetime
                                          utc={true}
                                          input={true}
                                          inputProps={{
                                            name: "drawing_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.drawing_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "drawing_date",
                                              new Date(
                                                moment(value)
                                                  .tz("Europe/London")
                                                  .format()
                                              )
                                            )
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          End Date Competition
                                        </Form.Label>
                                        <Datetime
                                          input={true}
                                          inputProps={{
                                            name: "end_date",
                                            placeholder: "Enter Date",
                                            required: true,
                                          }}
                                          value={values.end_date}
                                          onChange={(value) =>
                                            setFieldValue(
                                              "end_date",
                                              new Date(
                                                moment(value)
                                                  .tz("Europe/London")
                                                  .format()
                                              )
                                            )
                                          }
                                        />
                                      </Form.Group>

                                      <Form.Group
                                        as={Col}
                                        controlId="formGridPassword"
                                      >
                                        <Form.Label>Overall Price</Form.Label>
                                        <Form.Control
                                          type="number"
                                          value={values.price}
                                          placeholder="Price"
                                          name="price"
                                          onChange={handleChange}
                                        />
                                      </Form.Group>
                                    </Row>
                                    <Row classa="mb-3"></Row>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Run up Prize</Form.Label>
                                      <Form.Control
                                        onChange={handleChange}
                                        value={values.run_up_prize}
                                        type="text"
                                        placeholder="Run up Prize"
                                        name="run_up_prize"
                                      />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        Watch of The Competition
                                      </Form.Label>
                                      <Form.Select
                                        name="watchesId"
                                        onChange={handleChange}
                                        value={values.watchesId}
                                      >
                                        {watches?.map((watch, i) => {
                                          return (
                                            <option key={i} value={watch.id}>
                                              {watch.brand} {watch.model}
                                            </option>
                                          );
                                        })}
                                      </Form.Select>
                                    </Form.Group>

                                    <Row className="mb-3">
                                      <Form.Group as={Col}>
                                        <Form.Label>Total Tickets</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          name="total_tickets"
                                          type="number"
                                          placeholder="Total Tickets"
                                          value={values.total_tickets}
                                        />
                                      </Form.Group>

                                      <Form.Group as={Col}>
                                        <Form.Label>Ticket Price</Form.Label>
                                        <Form.Control
                                          onChange={handleChange}
                                          type="number"
                                          placeholder="Price Per Ticket"
                                          value={values.ticket_price}
                                          name="ticket_price"
                                        />
                                      </Form.Group>

                                      <Form.Group
                                        as={Col}
                                        controlId="formGridZip"
                                      >
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                          onChange={handleChange}
                                          name="status"
                                          value={values.status}
                                        >
                                          <option value="ACTIVE">ACTIVE</option>
                                          <option value="NOT_ACTIVE">
                                            NOT ACTIVE
                                          </option>
                                          <option value="COMPLETED">
                                            COMPLETED
                                          </option>
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose}
                                    >
                                      Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                      Save Changes
                                    </Button>
                                  </Modal.Footer>
                                </Form>
                              )}
                            </Formik>
                          </Modal>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <UpcomingComps />
        </Accordion>
      )}
      <Modal show={add}>
        <Modal.Header>
          <Modal.Title>Add a Competition</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={FormSchema}
          onSubmit={async (values, actions) => {
            setAdd(false);
            console.log("Form submitted:", values);
            await addComp({
              ...values,
              start_date: new Date(values.start_date),
              end_date: new Date(values.end_date),
              status: values.status as "ACTIVE" | "NOT_ACTIVE" | "COMPLETED",
              drawing_date: new Date(values.drawing_date),
              winner_announcement_date: null,
              winner: null,
              second_reward: null,
            });
            await refetch();
            await activeFetch();
            await noActiveFetch();
            await completedFetch();
            actions.setSubmitting(false);
          }}
          initialValues={{
            name: "",
            start_date: "",
            end_date: "",
            location: "",
            price: 0,
            max_space_in_final_draw: 1,
            max_watch_number: 1,
            run_up_prize: "",
            watchesId: "",
            total_tickets: 0,
            ticket_price: 0,
            status: "NOT_ACTIVE",
            drawing_date: "",
            remaining_tickets: 0,
          }}
        >
          {({ handleSubmit, handleChange, setFieldValue, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Name of Competition</Form.Label>
                    <Form.Control
                      required
                      name="name"
                      onChange={handleChange}
                      placeholder="Enter Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date Competition</Form.Label>
                    <Datetime
                      input={true}
                      inputProps={{
                        name: "start_date",
                        placeholder: "Enter Date",
                        required: true,
                      }}
                      onChange={(value) =>
                        setFieldValue(
                          "start_date",
                          new Date(moment(value).tz("Europe/London").format())
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Drawing Date of The Competition</Form.Label>
                    <Datetime
                      utc={true}
                      input={true}
                      inputProps={{
                        name: "drawing_date",
                        placeholder: "Enter Date",
                        required: true,
                      }}
                      onChange={(value) =>
                        setFieldValue(
                          "drawing_date",
                          new Date(moment(value).tz("Europe/London").format())
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date Competition</Form.Label>
                    <Datetime
                      utc={true}
                      input={true}
                      inputProps={{
                        name: "end_date",
                        placeholder: "Enter Date",
                        required: true,
                      }}
                      onChange={(value) =>
                        setFieldValue(
                          "end_date",
                          new Date(moment(value).tz("Europe/London").format())
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Watch Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      name="price"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row classa="mb-3"></Row>
                <Form.Group className="mb-3">
                  <Form.Label>Run up Prize</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    type="text"
                    placeholder="Run up Prize"
                    name="run_up_prize"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Watch of The Competition</Form.Label>
                  <Form.Select
                    required
                    name="watchesId"
                    onChange={handleChange}
                  >
                    <option value={"0"}>Select a Watch</option>
                    {watches?.map((watch, i) => {
                      return (
                        <option key={i} value={watch.id}>
                          {watch.brand} {watch.model}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {errors.watchesId && touched.watchesId ? (
                    <div style={{ color: "red" }}>{errors.watchesId}</div>
                  ) : null}
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Total Tickets</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      name="total_tickets"
                      type="number"
                      placeholder="Total Tickets"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Ticket Price</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      type="number"
                      placeholder="Price Per Ticket"
                      name="ticket_price"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Status</Form.Label>
                    <Form.Select required onChange={handleChange} name="status">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="NOT_ACTIVE">NOT ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setAdd(false)}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={remove.modal} onHide={handleNoRemove}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you wish to delete this competition ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNoRemove}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await removeComp(remove.id);
              await refetch();
              await activeFetch();
              await noActiveFetch();
              await completedFetch();
              setRemove({ modal: false, id: "" });
            }}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardCompetitions;
