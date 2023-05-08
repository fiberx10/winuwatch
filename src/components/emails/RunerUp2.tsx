import type {
  Competition,
  ImagesUrl,
  Order,
  PrismaClient,
  RunUpPrize,
  Ticket,
  Watches,
} from "@prisma/client";

import { renderToString } from "react-dom/server";

export const RunerUp2 = (data: {
  runUpPrize: Ticket & { Competition: Competition; Order: Order };
  addedPrize: RunUpPrize;
}) => {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body style={{ width: "100%" }}>
        {/* Email header */}
        <div
          style={{
            maxWidth: "37.5em",
            margin: "0 auto",
            fontFamily: "Kanit, sans-serif",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          <div
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
                color: "#fff",
                textAlign: "center",
                fontWeight: "300",
                letterSpacing: "0.1rem",
              }}
            >
              <p style={{ margin: "0" }}>Congratulations</p>
              <p style={{ margin: "0" }}>
                We are pleased to inform you that you
              </p>
              <p style={{ margin: "0" }}>have won</p>
              <p style={{ margin: "0" }}>
                a run up prize for Winuwatch {data.runUpPrize.Order?.id}
              </p>
            </div>
          </div>

          {/* Email Body */}

          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                fontWeight: "300",
                backgroundColor: "#cbb9ac",
                padding: "20px",
                color: "#fff",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      margin: "4px",
                      minWidth: "180px",
                      textAlign: "start",
                      fontStyle: "italic",
                      fontWeight: "400",
                    }}
                  >
                    Your coupon code is
                  </p>
                  <p style={{ margin: "4px", textAlign: "start" }}>
                    {data?.addedPrize.couponCode}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      margin: "4px",
                      minWidth: "180px",
                      textAlign: "start",
                      fontStyle: "italic",
                      fontWeight: "400",
                    }}
                  >
                    Please use this coupon code for the next competition to get
                    a discount of{" "}
                    {data.runUpPrize.Competition?.run_up_prize?.toString() ||
                      "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Footer */}
          <div>
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
              host a live for each competition.
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
          </div>
        </div>
      </body>
    </>
  );
};

export default (order: Parameters<typeof RunerUp2>[0]) =>
  renderToString(RunerUp2(order));
