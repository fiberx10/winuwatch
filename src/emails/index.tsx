import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Section } from "@react-email/section";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Font } from "@react-email/font";
import { Heading } from "@react-email/heading";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";
import { render } from "@react-email/render";
import { Order, Ticket } from "@prisma/client";


const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ""; //TO be imporrted

export const SlackConfirmEmail = (
  order: Order & {
    Ticket: Ticket[];
  }
) => (
  <Html>
    <Head>
      <Font
        fontFamily="Roboto"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Confirm your email address</Preview>
    <Container style={container}>
      <Section style={logoContainer}>
        <Img
          src={`${baseUrl}/static/slack-logo.png`}
          width="120"
          height="36"
          alt="Slack"
        />
      </Section>
      <Heading style={h1}>Confirm your email address</Heading>
      <Text style={heroText}>
        Your confirmation code is below - enter it in your open browser window
        and we&apos;ll help you get signed in.
      </Text>

      <Section style={codeBox}>
        <Text style={confirmationCodeText}>
          {numerOfTickets?.map((ticket) => ticket.number_tickets)} {clientName}
        </Text>
      </Section>

      <Text style={text}>
        If you didn&apos;t request this email, there&apos;s nothing to worry
        about - you can safely ignore it.
      </Text>

      <Section>
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
      </Section>
    </Container>
  </Html>
);


export default SlackConfirmEmail;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const socialMediaIcon = {
  display: "inline",
  marginLeft: "32px",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginRight: "50px",
  marginBottom: "30px",
  padding: "43px 23px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
