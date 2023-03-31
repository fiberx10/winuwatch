import { api } from "@/utils/api";
import styles from "@/styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";
import type { Moment } from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const DashboardCompetitions = () => {
  //REMOVE COMPETITION
  const [remove, setRemove] = useState(false);
  //ADD
  const [add, setAdd] = useState(false);

  // UPDATE
  const [show, setShow] = useState({ modal: false, data: 0 });

  // HANDLE UPDATE MODAL FORM
  const handleClose = () => {
    setShow({ modal: false, data: 0 });
  };
  const handleShow = (i: number) => {
    setShow({
      modal: true,
      data: i,
    });
  };

  //DATA FROM BACKEND
  const { data, isLoading, refetch } = api.Competition.getEverything.useQuery();
  const { data: watches } = api.Watches.getAll.useQuery();
  const { mutateAsync: removeComp } = api.Competition.remove.useMutation();
  // const { mutateAsync: addComp } = api.Competition.add.useMutation();
  const { mutateAsync: updateComp } = api.Competition.updateOne.useMutation();

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Competitions</h1>
        <Button onClick={() => setAdd(true)} variant="primary">
          <PlusOutlined /> Add
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.dashCompsGrid}>
          {data?.map((comp, i) => {
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
                    <Button onClick={() => setRemove(true)} variant="danger">
                      Remove
                    </Button>
                    <Button variant="secondary" onClick={() => handleShow(i)}>
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
                    {comp.status === "COMPLETED"
                      ? "COMPLETED"
                      : comp.status === "NOT_ACTIVE"
                      ? "NOT ACTIVE"
                      : "ACTIVE"}
                  </span>
                </div>
                {show.data === i && (
                  <Modal show={show.modal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Manage your competition</Modal.Title>
                    </Modal.Header>
                    <Formik
                      onSubmit={(values, actions) => {
                        setShow({ modal: false, data: 0 });

                        console.log("Form submitted:", values);

                        actions.setSubmitting(false);
                      }}
                      initialValues={{
                        name: comp.name,
                        start_date: comp.start_date,
                        end_date: comp.end_date,
                        location: comp.location,
                        price: comp.price,
                        max_space_in_final_draw: comp.max_space_in_final_draw,
                        max_watch_number: comp.max_watch_number,
                        run_up_prize: comp.run_up_prize as string,
                        Watch: comp.Watches.id,
                        total_tickets: comp.total_tickets,
                        ticket_price: comp.ticket_price,
                        status: comp.status,
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
                                <Form.Label>Name of Competition</Form.Label>
                                <Form.Control
                                  name="name"
                                  onChange={handleChange}
                                  value={values.name}
                                  placeholder="Enter Name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Start Date Competition</Form.Label>
                                <Datetime
                                  utc={true}
                                  input={true}
                                  inputProps={{
                                    name: "start_date",
                                    placeholder: "Enter Date",
                                    required: true,
                                  }}
                                  value={values.start_date}
                                  onChange={(value: string | Moment) =>
                                    setFieldValue("start_date", value)
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
                                  value={values.end_date}
                                  onChange={(value) =>
                                    setFieldValue("end_date", value)
                                  }
                                />
                              </Form.Group>
                              <Form.Group as={Col}>
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                  value={values.location}
                                  type="text"
                                  placeholder="1234 Main St"
                                  name="location"
                                  onChange={handleChange}
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridPassword">
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
                            <Row classa="mb-3">
                              <Form.Group as={Col}>
                                <Form.Label>Final Draw Spaces</Form.Label>
                                <Form.Control
                                  type="number"
                                  onChange={handleChange}
                                  value={values.max_space_in_final_draw}
                                  placeholder="Number of Spaces"
                                  name="max_space_in_final_draw"
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Max Watch Number</Form.Label>
                                <Form.Control
                                  type="number"
                                  onChange={handleChange}
                                  value={values.max_watch_number}
                                  placeholder="Number of Watches"
                                  name="max_watch_number"
                                />
                              </Form.Group>
                            </Row>
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
                              <Form.Label>Watch of The Competition</Form.Label>
                              <Form.Control
                                as="select"
                                name="Watch"
                                onChange={handleChange}
                                value={values.Watch}
                              >
                                {watches?.map((watch, i) => {
                                  return (
                                    <option key={i} value={watch.id}>
                                      {watch.brand} {watch.model}
                                    </option>
                                  );
                                })}
                              </Form.Control>
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

                              <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                  onChange={handleChange}
                                  name="status"
                                  value={values.status}
                                >
                                  <option value="ACTIVE">ACTIVE</option>
                                  <option value="NOT_ACTIVE">NOT ACTIVE</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </Form.Select>
                              </Form.Group>
                            </Row>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
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
            );
          })}
        </div>
      )}
      <Modal show={add}>
        <Modal.Header>
          <Modal.Title>Add a Competition</Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={(values, actions) => {
            setAdd(false);
            console.log("Form submitted:", values);

            actions.setSubmitting(false);
          }}
          initialValues={{
            name: "",
            start_date: "",
            end_date: "",
            location: "",
            price: "",
            max_space_in_final_draw: "",
            max_watch_number: "",
            run_up_prize: "",
            Watch: "",
            total_tickets: "",
            ticket_price: "",
            status: "",
          }}
        >
          {({ handleSubmit, handleChange, setFieldValue }) => (
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
                      utc={true}
                      input={true}
                      inputProps={{
                        name: "start_date",
                        placeholder: "Enter Date",
                        required: true,
                      }}
                      onChange={(value) => setFieldValue("start_date", value)}
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
                      onChange={(value) => setFieldValue("end_date", value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1234 Main St"
                      name="location"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Overall Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      name="price"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row classa="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Final Draw Spaces</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      placeholder="Number of Spaces"
                      name="max_space_in_final_draw"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Max Watch Number</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      placeholder="Number of Watches"
                      name="max_watch_number"
                    />
                  </Form.Group>
                </Row>
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
                  <Form.Control
                    required
                    as="select"
                    name="Watch"
                    onChange={handleChange}
                  >
                    {watches?.map((watch, i) => {
                      return (
                        <option key={i} value={watch.id}>
                          {watch.brand} {watch.model}
                        </option>
                      );
                    })}
                  </Form.Control>
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

      <Modal show={remove} onHide={() => setRemove(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you wish to delete this competition ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRemove(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setRemove(false)}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardCompetitions;
