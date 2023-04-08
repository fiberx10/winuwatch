/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/no-img-element */

import type {
  Competition,
  ImagesUrl,
  Order,
  Ticket,
  Watches,
} from "@prisma/client";
import React from "react";
import { getBaseUrl } from "@/utils";
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
  <div>
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
              data-id="react-email-section"
              style={{
                marginTop: "32px",
                backgroundColor: "#a8957e",
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
                    <table
                      align="center"
                      width="100%"
                      data-id="react-email-section"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
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
                              data-id="react-email-img"
                              alt="Slack"
                              src="/images/newLogo.png"
                              width={200}
                              height={100}
                              style={{
                                display: "block",
                                outline: "none",
                                border: "none",
                                textDecoration: "none",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      {order?.first_name}, Thank you!
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      We are pleased to inform you that your
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      registration has been successfully received and
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      processed. you have now officially entered in the
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      competition
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              data-id="react-email-section"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      data-id="react-email-img"
                      alt=""
                      src="/images/tester.png"
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
                      data-id="react-email-section"
                      style={{
                        textAlign: "left",
                        textTransform: "uppercase",
                        backgroundColor: "#a8957e",
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
                              data-id="react-email-text"
                              style={{
                                fontSize: "14px",
                                lineHeight: "24px",
                                margin: "16px 0",
                                padding: "0px 0px 0px 20px",
                              }}
                            >
                              Watch Info
                            </p>
                            <table
                              align="center"
                              width="100%"
                              data-id="react-email-section"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td />
                                  <td
                                    data-id="__react-email-column"
                                    style={{
                                      width: "66%",
                                      padding: "0px 0px 0px 20px",
                                    }}
                                  >
                                    <p
                                      data-id="react-email-text"
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: "24px",
                                        margin: "16px 0",
                                      }}
                                    >
                                      ORDER: {order?.id}
                                    </p>
                                    <p
                                      data-id="react-email-text"
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: "24px",
                                        margin: "16px 0",
                                      }}
                                    >
                                      QUANTITY: {order?.Ticket.length} - TOTAL:
                                      £{order?.totalPrice}
                                    </p>
                                  </td>
                                  <td
                                    data-id="__react-email-column"
                                    style={{
                                      backgroundColor: "black",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      fontWeight: 600,
                                    }}
                                  >
                                    <a
                                      href={
                                        order?.id &&
                                        `${getBaseUrl()}/ticket/${order.id}`
                                      }
                                    >
                                      <button
                                        style={{
                                          color: "white",
                                          textDecoration: "none",
                                        }}
                                      >
                                        CLICK TO SEE YOUR TICKET(S)!
                                      </button>
                                    </a>
                                  </td>
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
              data-id="react-email-section"
              style={{ padding: "20px", fontWeight: 500 }}
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      What happens now?
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      the contest will end on [end date] at [end time] [time
                      zone],
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      the winners will be announced on [announcement date]
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      at [announcement time] [time zone]
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      please make sure to follow us on instagram where we
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      host a live for each competition.
                    </p>
                    <p
                      data-id="react-email-text"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        margin: "5px 0px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      we wish you the best of luck!
                    </p>
                    <table
                      align="center"
                      width="100%"
                      data-id="react-email-section"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                        cursor: "pointer",
                      }}
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <a
                              style={{ textDecoration: "none" }}
                              href="https://www.instagram.com/winuwatch/"
                            >
                              <img
                                data-id="react-email-img"
                                alt="Slack"
                                src={getBaseUrl() + "/images/InstaFooter.svg"}
                                width={200}
                                height={100}
                                style={{
                                  display: "block",
                                  outline: "none",
                                  border: "none",
                                  textDecoration: "none",
                                }}
                              />
                            </a>
                          </td>
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
  </div>
);

const EmailRendered = (order: Parameters<typeof mail>[0]) =>
  renderToString(mail(order));

export default EmailRendered;
