/* eslint-disable @typescript-eslint/no-misused-promises */
import * as React from "react";
import { api } from "@/utils/api";
import styles from "@/styles/Dashboard.module.css";
import { Alert, Button } from "react-bootstrap";
import { GoPrimitiveDot } from "react-icons/go";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datetime/css/react-datetime.css";
import { Formater, DateFormater } from "@/utils";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { IoIosArrowDown } from "react-icons/io";
import TablePagination from "@mui/material/TablePagination";
import { ExportToCsv } from "export-to-csv";
import Loader from "../Loader";
import { useRouter } from "next/router";
import { Fade } from "@mui/material";

const csvExporter = new ExportToCsv({
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: true,
  title: "Order",
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
});

const DashboardOrders = () => {
  const { locale } = useRouter();
  const [open, setOpen] = React.useState({
    opened: false,
    orderID: "",
  });
  const [resend, setResend] = useState({
    open: false,
    id: "",
  });
  const { mutateAsync } = api.Winners.getCSV.useMutation();

  const { data, isLoading } = api.Competition.getAll.useQuery();

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

  const { data: orders } = api.Order.getAll.useQuery([show.data]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className={styles.DashCompsMain}>
      <div className={styles.dashCompsTopHeader}>
        <h1>Your Orders</h1>
      </div>
      {isLoading || data === null || !data ? (
        <div className={styles.LoaderWrapper}>
          <Loader />
        </div>
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
                      onClick={async () => {
                        const data = await mutateAsync(comp.id);
                        csvExporter.generateCsv(data);
                      }}
                    >
                      CSV
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
                  <Modal
                    style={{ width: "100vw" }}
                    size="xl"
                    show={show.modal}
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Manage your competition</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Paper sx={{ width: "100%", mb: 2 }}>
                        <TableContainer component={Paper}>
                          <Table
                            style={{ tableLayout: "auto" }}
                            aria-label="collapsible table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <p style={{ marginBottom: "0" }}>Full Name</p>
                                </TableCell>
                                <TableCell align="center">
                                  <p style={{ marginBottom: "0" }}>
                                    Country
                                    <br />
                                    Town
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Payment Method
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Total Price
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>Status</p>
                                </TableCell>
                                <TableCell align="center">
                                  <p style={{ marginBottom: "0" }}>
                                    Email - Phone - Address
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>Zip</p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Date of Birth
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Checked Email
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Checked Terms
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p style={{ marginBottom: "0" }}>
                                    Created At
                                  </p>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orders
                                ?.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => (
                                  <>
                                    <TableRow
                                      key={row.id}
                                      hover
                                      onClick={() =>
                                        setOpen({
                                          opened: !open.opened,
                                          orderID: row.id,
                                        })
                                      }
                                      sx={{
                                        "& > *": {
                                          borderBottom: "unset",
                                          cursor: "pointer",
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.first_name} {row.last_name}
                                      </TableCell>

                                      <TableCell align="right">
                                        {row.country}
                                        <br />
                                        {row.town}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.paymentMethod}
                                      </TableCell>
                                      <TableCell align="right">
                                        £{row.totalPrice}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.status}
                                      </TableCell>
                                      <TableCell align="right">
                                        <p
                                          style={{
                                            margin: "0",
                                          }}
                                        >
                                          {row.email}
                                          <br />
                                          {row.phone ? row.phone : "No Phone"}
                                          <br />
                                          {row.address
                                            ? row.address
                                            : "No Address"}
                                        </p>
                                      </TableCell>

                                      <TableCell align="right">
                                        {row.zip}
                                      </TableCell>
                                      <TableCell align="right">
                                        {DateFormater(row.date)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.checkedEmail ? "Yes" : "No"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.checkedTerms ? "Yes" : "No"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {DateFormater(row.createdAt)}
                                      </TableCell>
                                    </TableRow>

                                    <TableRow>
                                      <TableCell
                                        style={{
                                          paddingBottom: 0,
                                          paddingTop: 0,
                                        }}
                                        colSpan={6}
                                      >
                                        <Collapse
                                          in={
                                            row.id === open.orderID &&
                                            open.opened
                                          }
                                          timeout="auto"
                                          unmountOnExit
                                        >
                                          <Box
                                            sx={{
                                              margin: 1,
                                              width: "100%",
                                            }}
                                          >
                                            {row.id === resend.id && (
                                              <Fade
                                                in={resend.open} //Write the needed condition here to make it appear
                                                timeout={{
                                                  enter: 1000,
                                                  exit: 1000,
                                                }} //Edit these two values to change the duration of transition when the element is getting appeared and disappeard
                                                addEndListener={() => {
                                                  setTimeout(() => {
                                                    setResend({
                                                      open: false,
                                                      id: "",
                                                    });
                                                  }, 2000);
                                                }}
                                              >
                                                <Alert
                                                  style={{
                                                    transition: " 0.5s all",
                                                  }}
                                                  variant="success"
                                                >
                                                  Email Resent!
                                                </Alert>
                                              </Fade>
                                            )}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "1rem",
                                              }}
                                            >
                                              <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                              >
                                                Tickets
                                              </Typography>

                                              <Button
                                                onClick={() => {
                                                  setResend({
                                                    open: !resend.open,
                                                    id: row.id,
                                                  });
                                                }}
                                                size="sm"
                                                style={{
                                                  width: "max-content",
                                                }}
                                              >
                                                Resend Email
                                              </Button>
                                            </Box>

                                            <Table
                                              size="small"
                                              aria-label="purchases"
                                            >
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell>
                                                    Ticket Number
                                                  </TableCell>
                                                  <TableCell>
                                                    First Name
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    Last Name
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    Price Per Ticket
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    Ticket ID
                                                  </TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody sx={{ width: "100%" }}>
                                                {row.Ticket.map((ticket) => (
                                                  <TableRow key={ticket.id}>
                                                    <TableCell
                                                      component="th"
                                                      scope="row"
                                                    >
                                                      1
                                                    </TableCell>
                                                    <TableCell>
                                                      {row.first_name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                      {row.last_name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                      {Formater(
                                                        row.totalPrice /
                                                          row.Ticket.length,
                                                        locale
                                                      )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                      {ticket.id.toUpperCase()}
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  </>
                                ))}
                            </TableBody>
                          </Table>
                          <TablePagination
                            rowsPerPageOptions={[5, 15, 100]}
                            component="div"
                            count={orders ? orders.length : -1}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TableContainer>
                      </Paper>
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
