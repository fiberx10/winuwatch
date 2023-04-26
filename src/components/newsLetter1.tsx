import type {
  Competition,
  ImagesUrl,
  Order,
  Ticket,
  Watches,
} from "@prisma/client";
import React from "react";
import { Formater, getBaseUrl, DateFormater } from "@/utils";

import { renderToString } from "react-dom/server";

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
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"
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
        position: "relative",
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
              }}
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody
                style={{
                  background: order
                    ? order.Competition[0]?.Watches?.images_url[0]?.url
                    : `url(https://firebasestorage.googleapis.com/v0/b/winuwatch-bd56d.appspot.com/o/newsletterwatch.jpg?alt=media&token=b9a66883-ab78-495f-8fce-9838a8590c3a)`,
                  backgroundSize: "contain",
                  backgroundPosition: "100% 97%",
                  backgroundRepeat: "no-repeat",
                  height: "550px",
                  marginTop: "50px",
                }}
              >
                <tr style={{ padding: "20px" }}>
                  <td style={{ paddingTop: "30px" }}>
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
                      <h1 style={{ margin: "0" }}>Here is a quick update</h1>
                      <h2
                        style={{
                          margin: "0",
                          fontWeight: "300",
                          marginTop: "-10px",
                        }}
                      >
                        A New Competition is Online !
                      </h2>

                      <h3 style={{ margin: "0" }}>Final draws in 14 Days</h3>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div style={{ width: "100%", height: "520px" }}>
                      <div
                        style={{
                          maxHeight: "0",
                          maxWidth: "0",
                          overflow: " visible",
                        }}
                      >
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            marginBottom: "200px",
                            marginLeft: "10px",
                            display: "inline-block",
                          }}
                        >
                          <div
                            style={{
                              background: "white",
                              borderRadius: "50%",
                              width: "fit-content",
                              padding: "30px 15px ",
                            }}
                          >
                            <p
                              style={{
                                letterSpacing: "0.3rem",
                                fontSize: "16px",
                                color: "#CBB9AC",
                                margin: "0",
                                fontWeight: "600",
                              }}
                            >
                              WORTH
                            </p>
                            <p
                              style={{
                                fontSize: "18px",
                                margin: "0",
                                fontFamily: "DM Serif Display",
                                color: "black",
                                fontWeight: "600",
                              }}
                            >
                              19,000£
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          maxHeight: "0",
                          maxWidth: "100%",
                          overflow: " visible",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            marginTop: "420px",

                            display: "inline-block",
                          }}
                        >
                          <div
                            style={{
                              width: "95%",

                              marginLeft: "0px",

                              display: "inline-block",
                            }}
                          >
                            <div
                              style={{
                                background: "white",
                                marginTop: "10px",
                                width: "fit-content",
                                padding: "5px ",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "16px",
                                  margin: "5px 0px",
                                  textTransform: "uppercase",
                                  color: "black",
                                  textAlign: "center",
                                  fontWeight: "500",
                                  letterSpacing: "0.1rem",
                                  padding: "0px 0px 0px 0px",
                                }}
                              >
                                Rolex GMT-Master II Black Dial, Blue & Red
                                &quot;Pepsi&quot; Bezel, Jubilee Bracelet
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <table
                        align="center"
                        width="100%"
                        style={{
                          textAlign: "left",
                          textTransform: "uppercase",
                          backgroundColor: "#cbb9ac",
                          color: "white",
                          padding: "50px 0px 10px 0px",
                          marginTop: "460px",
                        }}
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
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        width: "60%",
                                        padding: "0px 0px 0px 20px",
                                        fontSize: "20px",
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
                                          margin: "5px 0",
                                        }}
                                      >
                                        ONLY 1100 Tickets available
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          margin: "5px 0",
                                        }}
                                      >
                                        Entry ticket&apos;s Price : 20£
                                      </p>
                                    </td>

                                    <th
                                      style={{
                                        width: "40%",
                                      }}
                                    >
                                      <a
                                        href="winuwatch.com"
                                        style={{
                                          textTransform: "uppercase",
                                          color: "white",
                                          fontWeight: "500",
                                          fontSize: "14px",
                                          backgroundColor: "black",
                                          border: "none",
                                          padding: "10px 15px",
                                          cursor: "pointer",
                                          marginRight: "10px",
                                          textDecoration: "none",
                                        }}
                                      >
                                        enter competition
                                      </a>
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              align="center"
              width="100%"
              style={{ fontWeight: 500, marginTop: "50px" }}
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
                      The competition will end on{" "}
                      {DateFormater(order?.Competition[0]?.end_date as Date) +
                        " (Local Time in London). "}
                      <br />
                      <br />
                      <b style={{ fontSize: "25px", color: "black" }}>
                        {" "}
                        Don&apos;t delay in securing your tickets <br />
                        as they are selling fast !
                      </b>
                      <br />
                      <br />
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "16px",
                          color: "#CBB9AC",
                        }}
                      >
                        For news, exclusive offers and beatiful watches - Follow
                        us on <br /> instagram !
                      </span>
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
                        color: "black",
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
                          color: "black",
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
                            color: "black",
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
