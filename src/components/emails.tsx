import type { PrismaClient } from "@prisma/client";
import { Formater, getBaseUrl, DateFormater } from "@/utils";

import { renderToString } from "react-dom/server";

export const GetData = async (OrderID: string, prismaClient: PrismaClient) => {
  const [order, comps] = await Promise.all([
    prismaClient.order.findUnique({
      where: {
        id: OrderID,
      },
    }),
    prismaClient.competition.findMany({
      include: {
        Ticket: {
          where: {
            orderId: OrderID,
          },
        },
        Watches: {
          include: {
            images_url: true,
          },
        },
      },
    }),
  ]);

  return {
    order,
    comps: comps
      .filter(({ Ticket }) => Ticket.length > 0)
      .map((comp) => ({
        ...comp,
        affiliationCode: "",
        affiliationRate: 0,
      })),
  };
};

export const DISCOUNT_RATES = [
  { threshold: 5, rate: 0.1 },
  { threshold: 10, rate: 0.15 },
  { threshold: 20, rate: 0.2 },
];

export const Reduction = (ticketPrice: number, ticketNumber: number) => {
  const discount = DISCOUNT_RATES.find(
    ({ threshold }) => ticketNumber == threshold
  );
  return Formater(
    discount
      ? ticketPrice * ticketNumber * (1 - discount.rate)
      : ticketPrice * ticketNumber
  );
};
export const Email = ({
  order,
  comps,
}: ReturnType<typeof GetData> extends Promise<infer T>
  ? T extends Promise<infer U>
    ? U
    : T
  : never) => (
  <>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
    </head>

    <table
      align="center"
      width="100%"
      data-id="__react-email-container"
      role="presentation"
      cellSpacing={0}
      cellPadding={0}
      border={0}
      style={{
        maxWidth: "37.5em",
        margin: "0 auto",
        fontFamily: "Kanit, sans-serif",
        textAlign: "center",
        fontWeight: "500",
      }}
    >
      <tbody>
        <tr style={{ width: "100%" }}>
          <table
            align="center"
            style={{
              maxWidth: "37.5em",
              margin: "0 auto",
              fontFamily: "Kanit, sans-serif",
              textAlign: "center",
              fontWeight: "500",
            }}
            border={0}
            cellPadding={0}
            cellSpacing={0}
            role="presentation"
          >
            <tbody>
              <tr>
                <td
                  style={{
                    backgroundColor: "#cbb9ac",
                    padding: "20px",
                  }}
                >
                  <img
                    alt="Logo"
                    src="https://www.win-u-watch.uk/images/newLogo.png"
                    width={200}
                    height={100}
                    style={{
                      display: "block",
                      outline: "none",
                      alignSelf: "center",
                      border: "none",
                      textDecoration: "none",
                      margin: "0  auto",
                      marginBottom: "20px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "16px",
                      margin: "5px 0px",
                      textTransform: "uppercase",
                      color: "white",
                      textAlign: "center",
                      fontWeight: "300",
                      letterSpacing: "0.1rem",
                    }}
                  >
                    <p style={{ margin: "0" }}>
                      {order?.first_name}, Thank you!
                    </p>
                    <p style={{ margin: "0" }}>
                      {order?.totalPrice !== 0
                        ? "We are pleased to inform you that your"
                        : "Your"}
                    </p>
                    <p style={{ margin: "0" }}>
                      {order?.totalPrice !== 0
                        ? "registration has been successfully received and"
                        : "registration has been successfully received and"}
                    </p>
                    <p style={{ margin: "0" }}>
                      processed. you have now officially entered in the{" "}
                    </p>
                    <p style={{ margin: "0" }}>
                      {comps?.length > 1 ? "competitions" : "competition"}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                {comps?.map((c, i) => (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <img
                          alt={c.id}
                          src={c.Watches?.images_url[0]?.url}
                          width="100%"
                          height="500px"
                          style={{
                            display: "block",
                            outline: "none",
                            border: "none",
                            textDecoration: "none",
                            objectFit: "cover",
                            marginTop: "10px",
                          }}
                        />
                        <table
                          align="center"
                          style={{
                            textAlign: "left",
                            textTransform: "uppercase",
                            color: "black",
                            width: "100%",
                            fontFamily: "Kanit, sans-serif",
                          }}
                          border={0}
                          cellPadding={0}
                          cellSpacing={0}
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  backgroundColor: "#cbb9ac",
                                  color: "white",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "16px",
                                    margin: "5px 0px",
                                    textTransform: "uppercase",
                                    color: "white",
                                    textAlign: "left",
                                    fontWeight: "300",
                                    letterSpacing: "0.1rem",
                                    padding: "0px 0px 0px 20px",
                                  }}
                                >
                                  {c.name}
                                </p>
                                <table
                                  align="center"
                                  style={{
                                    maxWidth: "37.5em",
                                  }}
                                  border={0}
                                  cellPadding={0}
                                  cellSpacing={0}
                                  role="presentation"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          width: "66%",
                                          padding: "0px 0px 0px 20px",
                                          fontSize: "16px",
                                          margin: "5px 0px",
                                          textTransform: "uppercase",
                                          color: "white",
                                          textAlign: "left",
                                          fontWeight: "300",
                                          letterSpacing: "0.1rem",
                                        }}
                                      >
                                        <p
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "24px",
                                            margin: "5px 0",
                                          }}
                                        >
                                          ORDER: {order?.id}
                                        </p>
                                        <p
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "24px",
                                            margin: "5px 0",
                                          }}
                                        >   {/* (t.ticketprice * (1 - t.reduction)) * (1 - t.affiliation_reduction) */}
                                          QUANTITY: {c.Ticket.length} - TOTAL: {(c.Ticket[0]!.ticketPrice * (1-c.Ticket[0]!.reduction!) * (1-c.Ticket[0]!.affiliation_reduction))*c.Ticket.length} £
                                        
                                        </p>
                                      </td>

                                      <th></th>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "16px",
                                    flex: "1",
                                    textAlign: "left",
                                    lineHeight: "24px",
                                    margin: "0px",
                                    padding: "10px",
                                    paddingLeft: "20px",
                                    textTransform: "uppercase",
                                    color: "white",
                                    backgroundColor: "black",
                                  }}
                                >
                                  My Tickets
                                </td>
                              </tr>
                              <table
                                style={{
                                  padding: "0px 0px 0px 0px",
                                  paddingLeft: "20px",
                                  width: "100%",
                                  fontFamily: "Kanit, sans-serif",
                                  border: "1px solid rgb(146, 124, 102)",
                                }}
                              >
                                <tbody>
                                  {c.Ticket.map((ticket, index) => (
                                    <tr
                                      key={index}
                                      style={{
                                        width: "100%",
                                        border: "1px solid rgb(146, 124, 102)",
                                      }}
                                    >
                                      <td>
                                        <p
                                          style={{
                                            fontSize: "13px",
                                            lineHeight: "24px",
                                            paddingRight: "5px",
                                            textTransform: "uppercase",
                                            color: "black",
                                          }}
                                        >
                                          {index + 1}
                                        </p>
                                      </td>
                                      <td>
                                        <p
                                          style={{
                                            fontSize: "13px",
                                            lineHeight: "24px",
                                            textTransform: "uppercase",
                                            color: "black",
                                          }}
                                        >
                                          {ticket.id}
                                        </p>
                                      </td>
                                      <td>
                                        <a
                                          style={{
                                            fontSize: "13px",
                                            textAlign: "end",
                                            lineHeight: "24px",
                                            textTransform: "uppercase",
                                            color: "black",
                                            textDecoration: "underline",
                                          }}
                                          href={`https://winuwatch.com/ticket/${ticket?.id}`}
                                        >
                                          see my ticket
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <tr>
                                <td>
                                  <p
                                    style={{
                                      fontSize: "16px",
                                      lineHeight: "24px",
                                      margin: "5px 0px",
                                      textTransform: "uppercase",
                                      color: "black",
                                      textAlign: "center",
                                      letterSpacing: "0.05rem",
                                      padding: "20px",
                                      fontFamily: "Kanit, sans-serif",
                                    }}
                                  >
                                    What happens now?
                                    <br /> the contest will end on{" "}
                                    {DateFormater(c.end_date) +
                                      " (Local Time in London) "}
                                    , the winners will be announced on{" "}
                                    {DateFormater(c.drawing_date) +
                                      " (Local Time in London) "}
                                  </p>
                                </td>
                              </tr>
                              {/* add discount code so he can share it with his friends and when it's used 5 times he gets a free ticket */}
                              {c.affiliationCode && order?.totalPrice !== 0 ? (
                                <tr style={{ margin: "0 0 20px 0" }}>
                                  <td
                                    style={{
                                      fontSize: "16px",
                                      flex: "1",
                                      textAlign: "center",
                                      lineHeight: "24px",
                                      padding: "10px",
                                      paddingLeft: "20px",
                                      textTransform: "uppercase",
                                      color: "black",
                                      backgroundColor: "white",
                                      border: "1px solid rgb(146, 124, 102)",
                                    }}
                                  >
                                    You have earned a discount code, share it
                                    with your friends and get a free ticket on
                                    each 5 uses! <br /> <br />
                                    <p
                                      style={{
                                        display: "flex",
                                        fontSize: "20px",
                                        textTransform: "none",
                                        margin: "0 auto",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {c.affiliationCode}
                                    </p>
                                  </td>
                                </tr>
                              ) : null}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </tr>
              <tr style={{}}>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    margin: "5px 0px",
                    textTransform: "uppercase",
                    color: "black",
                    textAlign: "center",
                    letterSpacing: "0.05rem",
                    padding: "20px",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  please make sure to follow us on instagram where we <br />
                  host a live for each competition. <br /> we wish you the best
                  of luck!
                </p>
                <a
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    margin: "0  auto",
                  }}
                  href="https://www.instagram.com/winuwatch/"
                >
                  <img
                    alt="instaFollow"
                    src="https://www.win-u-watch.uk/images/InstaFooter.png"
                    style={{ margin: "0  auto" }}
                  />
                </a>
                <h4
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "400",
                    background: "lightgrey",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Lisam Watch Ltd 63-66 Hatton Gardens, London, EC1N 8LE, UK
                </h4>
                <div style={{ display: "flex" }}>
                  <h5
                    style={{
                      margin: "0",
                      fontWeight: "300",
                      marginRight: "auto",
                      fontFamily: "Kanit, sans-serif",
                    }}
                  >
                    NO LONGER WANT TO RECEIVE THESE EMAILS? UNSUBSCRIBE
                  </h5>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="https://www.win-u-watch.uk/Privacy_Policy"
                  >
                    <h5
                      style={{
                        margin: "0",
                        fontWeight: "300",
                        fontFamily: "Kanit, sans-serif",
                      }}
                    >
                      PRIVACY POLICY
                    </h5>
                  </a>
                </div>
              </tr>
            </tbody>
          </table>
        </tr>
      </tbody>
    </table>
  </>
);

export default (order: Parameters<typeof Email>[0]) =>
  renderToString(Email(order));
/*
const mail = (
  order:
    | (Order & {
        Competition: (Competition & {
          Watches:
            | (Watches & {
                images_url: ImagesUrl[];
              })
            | null;
        })[];
        Ticket: Ticket[];
      })
    | null
) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
    </head>

    <table
      align="center"
      width="100%"
      data-id="__react-email-container"
      role="presentation"
      cellSpacing={0}
      cellPadding={0}
      border={0}
      style={{
        maxWidth: "37.5em",
        margin: "0 auto",
        fontFamily: "Kanit, sans-serif",
        textAlign: "center",
        fontWeight: "500",
      }}
    >
      <tbody>
        <tr style={{ width: "100%" }}>
          <td>
            <table
              align="center"
              width="100%"
              style={{
                backgroundColor: "#cbb9ac",
                padding: "20px",
              }}
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      alt="Slack"
                      src="https://www.win-u-watch.uk/images/newLogo.png"
                      width={200}
                      height={100}
                      style={{
                        display: "block",
                        outline: "none",
                        alignSelf: "center",
                        border: "none",
                        textDecoration: "none",
                        margin: "0  auto",
                        marginBottom: "20px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "16px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "300",
                        letterSpacing: "0.1rem",
                      }}
                    >
                      <p style={{ margin: "0" }}>
                        {order?.first_name}, Thank you!
                      </p>
                      <p style={{ margin: "0" }}>
                        We are pleased to inform you that your
                      </p>
                      <p style={{ margin: "0" }}>
                        registration has been successfully received and
                      </p>
                      <p style={{ margin: "0" }}>
                        processed. you have now officially entered in the{" "}
                      </p>
                      <p style={{ margin: "0" }}>competition</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border={0}>
              <tbody>
                <tr>
                  <td>
                    <img
                      alt=""
                      src={
                        order
                          ? order?.Competition[0]?.Watches?.images_url[0]?.url
                          : ""
                      }
                      width="100%"
                      height="auto"
                      max-height="200px"
                      style={{
                        display: "block",
                        outline: "none",
                        border: "none",
                        textDecoration: "none",
                      }}
                    />
                    <table
                      align="center"
                      width="100%"
                      style={{
                        textAlign: "left",
                        textTransform: "uppercase",
                        backgroundColor: "#cbb9ac",
                        color: "white",
                      }}
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style={{
                                fontSize: "16px",
                                margin: "5px 0px",
                                textTransform: "uppercase",
                                color: "white",
                                textAlign: "left",
                                fontWeight: "300",
                                letterSpacing: "0.1rem",
                                padding: "0px 0px 0px 20px",
                              }}
                            >
                              {order?.Competition[0]?.name}
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      width: "66%",
                                      padding: "0px 0px 0px 20px",
                                      fontSize: "16px",
                                      margin: "5px 0px",
                                      textTransform: "uppercase",
                                      color: "white",
                                      textAlign: "left",
                                      fontWeight: "300",
                                      letterSpacing: "0.1rem",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: "24px",
                                        margin: "5px 0",
                                      }}
                                    >
                                      ORDER: {order?.id}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: "24px",
                                        margin: "5px 0",
                                      }}
                                    >
                                      QUANTITY: {order?.Ticket.length} - TOTAL:
                                      {order?.totalPrice &&
                                        Formater(order.totalPrice)}
                                    </p>
                                  </td>

                                  <th></th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              align="center"
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      style={{
                        textAlign: "left",
                        textTransform: "uppercase",
                        backgroundColor: "black",
                        color: "white",
                      }}
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "16px",
                              flex: "1",
                              textAlign: "left",
                              lineHeight: "24px",
                              margin: "0px",
                              padding: "10px",
                              paddingLeft: "20px",
                              textTransform: "uppercase",
                              color: "white",
                              backgroundColor: "black",
                            }}
                          >
                            My Tickets
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                padding: "0px 0px 0px 0px",
                width: "100%",
                paddingLeft: "20px",
                minWidth: "100%",
                border: "1px solid rgb(146, 124, 102)",
              }}
            >
              <tbody>
                {order?.Ticket.map((ticket, index) => {
                  return (
                    <tr
                      key={index}
                      style={{
                        width: "100%",
                        border: "1px solid rgb(146, 124, 102)",
                      }}
                    >
                      <td>
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: "24px",
                            paddingRight: "5px",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          {index + 1}
                        </p>
                      </td>
                      <td>
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: "24px",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          {ticket?.id}
                        </p>
                      </td>
                      <td>
                        <a
                          style={{
                            fontSize: "13px",
                            textAlign: "end",
                            lineHeight: "24px",
                            textTransform: "uppercase",
                            color: "black",
                            textDecoration: "underline",
                          }}
                          href={`${getBaseUrl()}/ticket/${ticket?.id}`}
                        >
                          see my ticket
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <table
              align="center"
              width="100%"
              style={{ fontWeight: 500 }}
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <p
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                        textAlign: "center",
                        letterSpacing: "0.05rem",
                        padding: "20px",
                      }}
                    >
                      What happens now?
                      <br /> the contest will end on{" "}
                      {DateFormater(order?.Competition[0]?.end_date as Date) +
                        " (Local Time in London) "}
                      , the winners will be announced on{" "}
                      {DateFormater(
                        order?.Competition[0]?.drawing_date as Date
                      ) + " (Local Time in London) "}
                      <br /> please make sure to follow us on instagram where we{" "}
                      <br />
                      host a live for each competition. <br /> we wish you the
                      best of luck!
                    </p>
                    <a
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        margin: "0  auto",
                      }}
                      href="https://www.instagram.com/winuwatch/"
                    >
                      <img
                        alt="instaFollow"
                        src="https://www.win-u-watch.uk/images/InstaFooter.png"
                        style={{ margin: "0  auto" }}
                      />
                    </a>
                    <h4
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontWeight: "400",
                        background: "lightgrey",
                      }}
                    >
                      Lisam Watch Ltd 63-66 Hatton Gardens, London, EC1N 8LE, UK
                    </h4>
                    <div style={{ display: "flex" }}>
                      <h5
                        style={{
                          margin: "0",
                          fontWeight: "300",
                          marginRight: "auto",
                        }}
                      >
                        NO LONGER WANT TO RECEIVE THESE EMAILS? UNSUBSCRIBE
                      </h5>
                      <a
                        style={{ textDecoration: "none", color: "black" }}
                        href="https://www.win-u-watch.uk/Privacy_Policy"
                      >
                        <h5
                          style={{
                            margin: "0",
                            fontWeight: "300",
                          }}
                        >
                          PRIVACY POLICY
                        </h5>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default (order: Parameters<typeof mail>[0]) =>
  renderToString(mail(order));
*/
