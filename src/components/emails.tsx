import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Section } from "@react-email/section";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import { Button } from "@react-email/Button";
import type { Order, Ticket } from "@prisma/client";
import Link from "next/link";
import React from "react";

export const SlackConfirmEmail = (
  order: Order & {
    Ticket: Ticket[];
  }
) => (
  <Html>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
    </Head>

    <Preview>Confirm your email address</Preview>
    <Container
      style={{
        margin: "0 auto",
        fontFamily: "Kanit, sans-serif",
        textAlign: "center",
      }}
    >
      <Section
        style={{
          marginTop: "32px",
          backgroundColor: "#a8957e",
          padding: "20px",
        }}
      >
        <Section
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Img src="/images/newLogo.png" width="200" height="100" alt="Slack" />
        </Section>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            margin: "5px 0px",
          }}
        >
          {order.first_name}, Thank you!
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            margin: "5px 0px",
          }}
        >
          We are pleased to inform you that your
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            margin: "5px 0px",
          }}
        >
          registration has been successfully received and
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            margin: "5px 0px",
          }}
        >
          processed. you have now officially entered in the
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            margin: "5px 0px",
          }}
        >
          competition
        </Text>
      </Section>

      <Section style={{}}>
        <Img src="/images/tester.png" width="100%" height="100%" alt="" />
        <Section
          style={{
            textAlign: "left",
            textTransform: "uppercase",
            backgroundColor: "#a8957e",
            color: "white",
          }}
        >
          <Text style={{ padding: "0px 0px 0px 20px" }}>Watch Info</Text>
          <Section>
            <Column style={{ width: "66%", padding: "0px 0px 0px 20px " }}>
              <Text style={{}}>ORDER: {order.id}</Text>
              <Text style={{}}>
                QUANTITY: {order.Ticket.length} - TOTAL: £{order.totalPrice}
              </Text>
            </Column>
            <Column
              style={{
                backgroundColor: "black",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <Button>CLICK TO SEE YOUR TICKET(S)!</Button>
            </Column>
          </Section>
        </Section>
      </Section>

      <Section
        style={{
          padding: "20px",
          fontWeight: "500",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          What happens now?
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          the contest will end on [end date] at [end time] [time zone],
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          the winners will be announced on [announcement date]
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          at [announcement time] [time zone]
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          please make sure to follow us on instagram where we
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          host a live for each competition.
        </Text>
        <Text
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            color: "black",
            margin: "5px 0px",
          }}
        >
          we wish you the best of luck!
        </Text>
        <Section
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          <Link
            href="https://www.instagram.com/winuwatch/"
            style={{ textDecoration: "none" }}
          >
            <Img
              src="/images/InstaFooter.svg"
              width="200"
              height="100"
              alt="Slack"
            />
          </Link>
        </Section>
      </Section>

      {/* <Section>
        <Column style={{ width: "66%" }}>
          <Img
            src={`${baseUrl}/static/slack-logo.png`}
            width="120"
            height="36"
            alt="Slack"
          />
        </Column>
        <Column>
          <Column>
            <Link href="/">
              <Img
                src={`${baseUrl}/static/slack-twitter.png`}
                width="32"
                height="32"
                alt="Slack"
                style={socialMediaIcon}
              />
            </Link>
          </Column>
          <Column>
            <Link href="/">
              <Img
                src={`${baseUrl}/static/slack-facebook.png`}
                width="32"
                height="32"
                alt="Slack"
                style={socialMediaIcon}
              />
            </Link>
          </Column>
          <Column>
            <Link href="/">
              <Img
                src={`${baseUrl}/static/slack-linkedin.png`}
                width="32"
                height="32"
                alt="Slack"
                style={socialMediaIcon}
              />
            </Link>
          </Column>
        </Column>
      </Section>

      <Section>
        <Link
          style={footerLink}
          href="https://slackhq.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Our blog
        </Link>
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        <Link
          style={footerLink}
          href="https://slack.com/legal"
          target="_blank"
          rel="noopener noreferrer"
        >
          Policies
        </Link>
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        <Link
          style={footerLink}
          href="https://slack.com/help"
          target="_blank"
          rel="noopener noreferrer"
        >
          Help center
        </Link>
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        <Link
          style={footerLink}
          href="https://slack.com/community"
          target="_blank"
          rel="noopener noreferrer"
          data-auth="NotApplicable"
          data-linkindex="6"
        >
          Slack Community
        </Link>
        <Text style={footerText}>
          ©2022 Slack Technologies, LLC, a Salesforce company. <br />
          500 Howard Street, San Francisco, CA 94105, USA <br />
          <br />
          All rights reserved.
        </Text>
      </Section> */}
    </Container>
  </Html>
);

export default SlackConfirmEmail;
