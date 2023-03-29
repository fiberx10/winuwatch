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
import Image from "next/image";

interface FormState {
  [key: string]: string | number;
}
const DashboardWatches = () => {
  const { data, isLoading } = api.Watches.getAll.useQuery();
  const {mutateAsync : removewatch} = api.Watches.remove.useMutation()
  const {mutateAsync: addWatch} = api.Watches.add.useMutation()
  const {mutateAsync: updateWatch} = api.Watches.update.useMutation()


  //REMOVE WATCH
  const [remove, setRemove] = useState(false);
  //ADD WATCH
  const [add, setAdd] = useState(false);
  const [addWacth, setAddWatch] = useState<FormState>({});

  const handleAddNewComp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddWatch((prevState) => ({
      ...prevState,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };
  const submitNewComp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from submitting normally
    console.log("Form submitted:", addWacth);
  };

  // UPDATE WATCH
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
    // const {  data: update } = await api.Competition.updateOne
    // .useMutation()
    // .mutateAsync({ id: formState.id });
    console.log("Form submitted:", formState);
  };

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
          {data?.map((watch, i) => {
            return (
              <div className={styles.dashWatchesGridItem} key={watch.id}>
                <Image
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                  src="/images/tester.png"
                  alt="watchImage"
                />
                <div className={styles.dashWatchGridDet}>
                  <h2>
                    {watch.brand} {watch.model}
                  </h2>
                  <div className={styles.dashGridItemTop}>
                    <p>Reference number : {watch.reference_number}</p>
                    <p>Year of Manifacture : {watch.year_of_manifacture}</p>
                    <p>Condition : {watch.condition}</p>
                  </div>
                  <div className={styles.dashGridItemBot}>
                    <div>
                      <Button onClick={() => setRemove(true)} variant="danger">
                        Remove
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleShow(i, watch)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
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
                              placeholder="Enter Name"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Start Date Competition</Form.Label>
                            <Form.Control
                              placeholder="Enter Date"
                              name="start_date"
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>End Date Competition</Form.Label>
                            <Form.Control
                              placeholder="Enter Date"
                              name="end_date"
                              onChange={handleChange}
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

                        <Row className="mb-3">
                          <Form.Group as={Col}>
                            <Form.Label>Total Tickets</Form.Label>
                            <Form.Control
                              onChange={handleChange}
                              name="total_tickets"
                              type="number"
                              placeholder="Total Tickets"
                            />
                          </Form.Group>

                          <Form.Group as={Col}>
                            <Form.Label>Ticket Price</Form.Label>
                            <Form.Control
                              onChange={handleChange}
                              type="number"
                              placeholder="Price Per Ticket"
                              name="ticket_price"
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                              as="select"
                              onChange={handleChange}
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
      <Modal show={add}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitNewComp}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Watch Brand</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Brand"
                  name="brand"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Watch Model</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Model"
                  name="model"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Bracelet Material</Form.Label>
                <Form.Control
                  required
                  placeholder="Enter Material"
                  name="Bracelet_material"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bezel Material</Form.Label>
                <Form.Control
                  required
                  placeholder="Enter Material"
                  name="bezel_material"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Caliber Grear</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Caliber"
                  name="caliber_grear"
                  onChange={handleAddNewComp}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Number of Stones</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of Stones"
                  name="number_of_stones"
                  onChange={handleAddNewComp}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Condition</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Condition"
                  name="condition"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Glass</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Glass"
                  name="glass"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Movement</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Movement"
                  name="movement"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Reference Number</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleAddNewComp}
                  placeholder="Enter Reference Number"
                  name="reference_number"
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Total Tickets</Form.Label>
                <Form.Control
                  required
                  onChange={handleAddNewComp}
                  name="total_tickets"
                  type="number"
                  placeholder="Total Tickets"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Ticket Price</Form.Label>
                <Form.Control
                  required
                  onChange={handleAddNewComp}
                  type="number"
                  placeholder="Price Per Ticket"
                  name="ticket_price"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  required
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

export default DashboardWatches;
