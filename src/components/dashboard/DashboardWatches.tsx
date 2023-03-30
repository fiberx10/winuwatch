import { api } from "@/utils/api";
import styles from "@/styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "next/image";
import { Formik } from "formik";
import * as yup from "yup";

const DashboardWatches = () => {
  const { data, isLoading } = api.Watches.getAll.useQuery();
  const { mutateAsync: removewatch } = api.Watches.remove.useMutation();
  const { mutateAsync: addWatch } = api.Watches.add.useMutation();
  const { mutateAsync: updateWatch } = api.Watches.update.useMutation();

  //REMOVE WATCH
  const [remove, setRemove] = useState(false);
  //ADD WATCH
  const [add, setAdd] = useState(false);

  // UPDATE WATCH
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
  const schema = yup.object().shape({
    brand: yup.string().required(),
    model: yup.string().required(),
    Bracelet_material: yup.string().required(),
    bezel_material: yup.string().required(),
    caliber_grear: yup.string().required(),
    number_of_stones: yup.string().required(),
    condition: yup.string().required(),
    glass: yup.string().required(),
    movement: yup.string().required(),
    reference_number: yup.string().required(),
    year_of_manifacture: yup.string().required(),
    has_box: yup.bool().required(),
    has_certificate: yup.bool().required(),
  });
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
                      <Button variant="secondary" onClick={() => handleShow(i)}>
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
                    <Formik
                      onSubmit={(values, actions) => {
                        setShow({ modal: false, data: 0 });

                        console.log("Form submitted:", values);

                        actions.setSubmitting(false);
                      }}
                      validationSchema={schema}
                      initialValues={{
                        brand: watch.brand,
                        model: watch.model,
                        Bracelet_material: watch.Bracelet_material,
                        bezel_material: watch.bezel_material,
                        caliber_grear: watch.caliber_grear,
                        number_of_stones: watch.number_of_stones,
                        condition: watch.condition,
                        glass: watch.glass,
                        movement: watch.movement,
                        reference_number: watch.reference_number,
                        year_of_manifacture: watch.year_of_manifacture,
                        has_box: true,
                        has_certificate: watch.has_certificate,
                      }}
                    >
                      {({ values, handleSubmit, handleChange }) => (
                        <Form onSubmit={handleSubmit}>
                          <Modal.Body>
                            <Row className="mb-3">
                              <Form.Group as={Col}>
                                <Form.Label>Watch Brand</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={values.brand}
                                  onChange={handleChange}
                                  placeholder="Enter Brand"
                                  name="brand"
                                  required
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Watch Model</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={values.model}
                                  required
                                  onChange={handleChange}
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
                                  value={values.Bracelet_material}
                                  placeholder="Enter Material"
                                  name="Bracelet_material"
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Bezel Material</Form.Label>
                                <Form.Control
                                  required
                                  placeholder="Enter Material"
                                  name="bezel_material"
                                  onChange={handleChange}
                                  value={values.bezel_material}
                                />
                              </Form.Group>
                              <Form.Group as={Col}>
                                <Form.Label>Caliber Grear</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter Caliber"
                                  name="caliber_grear"
                                  onChange={handleChange}
                                  value={values.caliber_grear}
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Number of Stones</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Number of Stones"
                                  name="number_of_stones"
                                  onChange={handleChange}
                                  value={values.number_of_stones}
                                />
                              </Form.Group>
                            </Row>
                            <Row className="mb-3">
                              <Form.Group as={Col}>
                                <Form.Label>Condition</Form.Label>
                                <Form.Control
                                  type="text"
                                  onChange={handleChange}
                                  placeholder="Enter Condition"
                                  name="condition"
                                  value={values.condition}
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Glass</Form.Label>
                                <Form.Control
                                  type="text"
                                  onChange={handleChange}
                                  placeholder="Enter Glass"
                                  name="glass"
                                  value={values.glass}
                                />
                              </Form.Group>
                            </Row>
                            <Row className="mb-3">
                              <Form.Group as={Col}>
                                <Form.Label>Movement</Form.Label>
                                <Form.Control
                                  type="text"
                                  onChange={handleChange}
                                  placeholder="Enter Movement"
                                  name="movement"
                                  value={values.movement}
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Reference Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  onChange={handleChange}
                                  placeholder="Enter Reference Number"
                                  name="reference_number"
                                  value={values.reference_number}
                                />
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group as={Col}>
                                <Form.Label>Year of Manifacture</Form.Label>
                                <Form.Control
                                  required
                                  onChange={handleChange}
                                  name="year_of_manifacture"
                                  type="number"
                                  placeholder="Year of Manifacture"
                                  value={values.year_of_manifacture}
                                />
                              </Form.Group>

                              <Form.Group as={Col}>
                                <Form.Check
                                  checked={values.has_box}
                                  label="Has Box"
                                  onChange={handleChange}
                                  name="has_box"
                                />
                              </Form.Group>

                              <Form.Group as={Col} controlId="formGridZip">
                                <Form.Check
                                  checked={values.has_certificate}
                                  label="Has Certificate"
                                  onChange={handleChange}
                                  name="has_certificate"
                                />
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
          <Modal.Title>Add a Watch</Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={(values, actions) => {
            setShow({ modal: false, data: 0 });

            console.log("Form submitted:", values);

            actions.setSubmitting(false);
          }}
          validationSchema={schema}
          initialValues={{
            brand: "",
            model: "",
            Bracelet_material: "",
            bezel_material: "",
            caliber_grear: "",
            number_of_stones: "",
            condition: "",
            glass: "",
            movement: "",
            reference_number: "",
            year_of_manifacture: "",
            has_box: false,
            has_certificate: false,
          }}
        >
          {({ handleSubmit, handleChange }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Watch Brand</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      placeholder="Enter Brand"
                      name="brand"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Watch Model</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bezel Material</Form.Label>
                    <Form.Control
                      required
                      placeholder="Enter Material"
                      name="bezel_material"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Caliber Grear</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Caliber"
                      name="caliber_grear"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Number of Stones</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Number of Stones"
                      name="number_of_stones"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Condition</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      placeholder="Enter Condition"
                      name="condition"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Glass</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
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
                      onChange={handleChange}
                      placeholder="Enter Movement"
                      name="movement"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      placeholder="Enter Reference Number"
                      name="reference_number"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Year of Manifacture</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      name="year_of_manifacture"
                      type="number"
                      placeholder="Year of Manifacture"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Check
                      label="Has Box"
                      onChange={handleChange}
                      name="has_box"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Check
                      label="Has Certificate"
                      onChange={handleChange}
                      name="has_certificate"
                    />
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
        <Modal.Body>Do you wish to delete this watch ?</Modal.Body>
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
