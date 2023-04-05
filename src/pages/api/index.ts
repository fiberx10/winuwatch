import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import Email from "@/emails";
import { CompetitionStatus, Order, OrderStatus, Ticket } from "@prisma/client";

const Send_email = async () => {
  //TODO here we implement the logic to send the email
  sendgrid.setApiKey(
    "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"
  );

  await sendgrid.send({
    from: "noreply@winuwatch.uk",
    to: "iliassjabali@gmail.com",
    subject: "Order Confirmation",
    html: render(Email("Order Confirmation")),
  });
};
export default async function (req: NextApiRequest, res: NextApiResponse) {
  await Send_email();
  //console.log("email sent");
  res.send(render(Email("Order Confirmation")));
}
