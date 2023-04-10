import type {
  Competition,
  ImagesUrl,
  Order,
  Ticket,
  Watches,
} from "@prisma/client";
import React from "react";
import { Formater, getBaseUrl } from "@/utils";
import { renderToString } from "react-dom/server";
const data = [
  { names: ["COMPETITIONS", "how to play", "contact"] },
  { names: ["PHILOSOPHY", "trustpilot", "Charity"] },
  { names: ["Acceptable Use Policy", "faq"] },
  { names: ["Return Policy", "terms & conditions", "Privacy Policy"] },
];

import styles from "@/styles/Home.module.css";
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
                    <div
                      style={{
                        width: "100%",
                        alignContent: "center",
                        justifyContent: "center",
                        display: "grid",
                        placeItems: "center",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    >
                      <p>
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
                            marginRight: "10px",
                          }}
                        />
                      </p>
                    </div>
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
                    <img
                      alt=""
                      src={
                        order
                          ? order?.Competition[0]?.Watches?.images_url[0]?.url
                          : ""
                      }
                      width="100%"
                      height="100%"
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
                                    data-id="__react-email-column"
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
                      {order?.Competition[0]?.end_date.toDateString()} at{" "}
                      {order
                        ? order?.Competition[0]?.end_date.toTimeString()
                        : null}{" "}
                      , the winners will be announced on{" "}
                      {order?.Competition[0]?.winner_announcement_date?.toDateString()}
                      at
                      {order?.Competition[0]?.winner_announcement_date?.toTimeString()}
                      <br /> please make sure to follow us on instagram where we{" "}
                      <br />
                      host a live for each competition. <br /> we wish you the
                      best of luck!
                    </p>

                    <div style={{ width: "37.5em" }}>
                      <div
                        style={{
                          background: "#cbb9ac",
                          height: "fit-content",
                          padding: "20px 0",
                          gap: "1rem",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "Montserrat,sans-serif",
                            textTransform: "uppercase",
                            fontWeight: "600",
                            fontSize: "45px",
                            color: "#987358",
                            margin: "0",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          Follow us
                        </h1>

                        <p
                          style={{
                            fontWeight: "400",
                            fontSize: "20px",
                            width: "80%",
                            textAlign: "center",
                            color: "#faf8f6",
                            marginLeft: "10%",
                          }}
                        >
                          Don&apos;t miss the live draw and the announcement of
                          the next competitions on Instagram !
                        </p>

                        <a
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                          href="https://www.instagram.com/winuwatch/"
                        >
                          <img
                            alt="instaFollow"
                            src="https://www.win-u-watch.uk/images/InstaFooter.png"
                          />
                        </a>
                      </div>

                      <div
                        style={{
                          background: "#cbb9ac",
                          paddingBottom: "20px",
                          gap: "1rem",

                          justifyContent: "space-evenly",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            flexDirection: "column",
                            gap: "2rem",
                            width: "100%",
                            paddingTop: "20px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "20px",
                            }}
                          >
                            <img
                              width={144}
                              height={76}
                              style={{ marginRight: "10px" }}
                              src="https://www.win-u-watch.uk/images/newLogo.png"
                              alt="logo"
                            />
                          </div>

                          {data.map((menu, i) => {
                            return (
                              <>
                                <a
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    fontWeight: "300",
                                    fontSize: "14px",
                                    letterSpacing: ".05em",
                                    marginBottom: "10px",
                                  }}
                                  href={
                                    menu.names[0] === "COMPETITIONS"
                                      ? "https://www.win-u-watch.uk/#theComp"
                                      : menu.names[0] === "PHILOSOPHY"
                                      ? "https://www.win-u-watch.uk/Philosophy"
                                      : menu.names[0] ===
                                        "Acceptable Use Policy"
                                      ? "https://www.win-u-watch.uk/Acceptable_Use_Policy"
                                      : "https://www.win-u-watch.uk/Return_Policy"
                                  }
                                >
                                  {menu.names[0]}
                                </a>
                                <a
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    fontWeight: "300",
                                    fontSize: "14px",
                                    letterSpacing: ".05em",
                                    marginBottom: "10px",
                                  }}
                                  href={
                                    menu.names[1] === "how to play"
                                      ? "https://www.win-u-watch.uk/#Howtoplay"
                                      : menu.names[1] === "trustpilot"
                                      ? "https://www.win-u-watch.uk/#trustpilot"
                                      : menu.names[1] === "faq"
                                      ? "https://www.win-u-watch.uk/FAQ"
                                      : "https://www.win-u-watch.uk/TermsAndConditions"
                                  }
                                >
                                  {menu.names[1]}
                                </a>
                                <a
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    fontWeight: "300",
                                    fontSize: "14px",
                                    letterSpacing: ".05em",
                                    marginBottom: "10px",
                                  }}
                                  href={
                                    menu.names[2] === "Charity"
                                      ? "/Charity"
                                      : menu.names[2] === "Privacy Policy"
                                      ? "/Privacy_Policy"
                                      : menu.names[2] === "contact"
                                      ? "mailto:info@winuwatch.uk"
                                      : ""
                                  }
                                >
                                  {menu.names[2]}
                                </a>
                              </>
                            );
                          })}
                          <div
                            style={{
                              width: "90%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "15px 0",
                                borderBottom: "1px solid #fff",
                                width: "95%",
                                gap: "1rem",
                                color: "white",
                              }}
                            >
                              <p style={{ margin: "0" }}>
                                For enquiries, please email
                              </p>
                              <a
                                style={{
                                  color: "white",
                                }}
                                href="mailto:info@winuwatch.uk"
                              >
                                <u>info@winuwatch.uk</u>
                              </a>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "15px 0",
                                borderBottom: "1px solid #fff",
                                width: "95%",
                                gap: "1rem",
                                color: "white",
                              }}
                            >
                              <p style={{ margin: "0" }}>100% Secure payment</p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "1rem",
                                }}
                              >
                                <div
                                  style={{
                                    justifyContent: "center",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                    padding: "1px 7px",
                                    border: "1px solid #fff",
                                  }}
                                >
                                  visa
                                </div>
                                <div
                                  style={{
                                    padding: "4.5px 8px",
                                    border: "1px solid #fff",
                                    filter: "brightness(0) invert(1)",
                                  }}
                                >
                                  <img
                                    width={14}
                                    height={14}
                                    src="https://www.win-u-watch.uk/images/visacircdark.png"
                                    alt="visarecdark"
                                  />
                                  <img
                                    width={14}
                                    height={14}
                                    src="https://www.win-u-watch.uk/images/viacirclight.png"
                                    alt="visareclight"
                                    style={{
                                      marginLeft: "-3px",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            gap: "1rem",
                            color: "white",
                          }}
                        >
                          <h3
                            style={{
                              margin: "0",
                              fontWeight: "300",
                              fontSize: "18px",
                            }}
                          >
                            Win U Watch © 2023
                          </h3>
                          <p
                            style={{
                              fontWeight: "300",
                              fontSize: "15px",
                              textAlign: "center",
                              width: "60%",
                              margin: "0",
                            }}
                          >
                            Lisam Watch Ltd is registered at 63-66 Hatton
                            Gardens, London, EC1N 8LE, UK
                          </p>
                        </div>
                      </div>
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
