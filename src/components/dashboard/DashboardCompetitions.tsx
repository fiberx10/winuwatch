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
interface FormState {
  [key: string]: string | number;
}
const DashboardCompetitions = () => {
  //ADD
  const [add, setAdd] = useState(false);
  const [addComp, setAddComp] = useState<FormState>({});

  const handleAddNewComp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };
  const submitNewComp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from submitting normally
    console.log("Form submitted:", addComp);
  };

  // UPDATE
  const [show, setShow] = useState({ modal: false, data: 0 });
  const [changed, setIsChanged] = useState(true);
  const [formState, setFormState] = useState<object>();

  // HANDLE UPDATE MODAL FORM
  const handleClose = () => {
    setShow({ modal: false, data: 0 });
    setIsChanged(true);
  };
  const handleShow = (i: number, comp: object) => {
    setShow({
      modal: true,
      data: i,
    });
    setFormState(comp);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChanged(false);
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from submitting normally
    setIsChanged(true);
    console.log("Form submitted:", formState);
  };

  //DATA FROM BACKEND
  const { data, isLoading } = api.Competition.getEverything.useQuery();
  const { data: watches } = api.Watches.getAll.useQuery();

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Competitions</h1>
        <Button onClick={() => setAdd(true)} variant="primary">
          <PlusOutlined /> Add
        </Button>
      </div>
      {isLoading ? (
        <p>isLoading...</p>
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
                    <Button variant="danger">Remove</Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleShow(i, comp)}
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
                    <Form onSubmit={handleSubmit}>
                      <Modal.Body>
                        <Row className="mb-3">
                          <Form.Group className="mb-3">
                            <Form.Label>Name of Competition</Form.Label>
                            <Form.Control
                              name="name"
                              onChange={handleChange}
                              defaultValue={comp.name}
                              placeholder="Enter Name"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Start Date Competition</Form.Label>
                            <Form.Control
                              defaultValue={comp.start_date.toUTCString()}
                              placeholder="Enter Date"
                              name="start_date"
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>End Date Competition</Form.Label>
                            <Form.Control
                              defaultValue={comp.end_date.toUTCString()}
                              placeholder="Enter Date"
                              name="end_date"
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              defaultValue={comp.location}
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
                              defaultValue={comp.price}
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
                              defaultValue={comp.max_space_in_final_draw}
                              placeholder="Number of Spaces"
                              name="max_space_in_final_draw"
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Max Watch Number</Form.Label>
                            <Form.Control
                              type="number"
                              onChange={handleChange}
                              defaultValue={comp.max_watch_number}
                              placeholder="Number of Watches"
                              name="max_watch_number"
                            />
                          </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Run up Prize</Form.Label>
                          <Form.Control
                            onChange={handleChange}
                            defaultValue={comp.run_up_prize as string}
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
                            defaultValue={comp.Watches.id}
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
                              defaultValue={comp.total_tickets}
                            />
                          </Form.Group>

                          <Form.Group as={Col}>
                            <Form.Label>Ticket Price</Form.Label>
                            <Form.Control
                              onChange={handleChange}
                              type="number"
                              placeholder="Price Per Ticket"
                              defaultValue={comp.ticket_price}
                              name="ticket_price"
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                              as="select"
                              onChange={handleChange}
                              name="status"
                              defaultValue={comp.status}
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="NOT_ACTIVE">NOT ACTIVE</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </Form.Control>
                          </Form.Group>
                        </Row>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          disabled={changed}
                          variant="primary"
                          type="submit"
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Modal show={add} onHide={() => setAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Name of Competition</Form.Label>
                <Form.Control
                  name="name"
                  onChange={handleAddNewComp}
                  placeholder="Enter Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date Competition</Form.Label>
                <Form.Control
                  placeholder="Enter Date"
                  name="start_date"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date Competition</Form.Label>
                <Form.Control
                  placeholder="Enter Date"
                  name="end_date"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 Main St"
                  name="location"
                  onChange={handleAddNewComp}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Overall Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  name="price"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
            </Row>
            <Row classa="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Final Draw Spaces</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleAddNewComp}
                  placeholder="Number of Spaces"
                  name="max_space_in_final_draw"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Max Watch Number</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleAddNewComp}
                  placeholder="Number of Watches"
                  name="max_watch_number"
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Run up Prize</Form.Label>
              <Form.Control
                onChange={handleAddNewComp}
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
                onChange={handleAddNewComp}
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
                  onChange={handleAddNewComp}
                  name="total_tickets"
                  type="number"
                  placeholder="Total Tickets"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Ticket Price</Form.Label>
                <Form.Control
                  onChange={handleAddNewComp}
                  type="number"
                  placeholder="Price Per Ticket"
                  name="ticket_price"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleAddNewComp}
                  name="status"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NOT_ACTIVE">NOT ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </Form.Control>
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
      </Modal>
    </div>
  );
};

export default DashboardCompetitions;
