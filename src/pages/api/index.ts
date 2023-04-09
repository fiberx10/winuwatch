import type { NextApiRequest, NextApiResponse } from "next";
import Email from "@/components/emails";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@winuwatch.uk",
    pass: "Password1!",
  },
});
export default async function send(req: NextApiRequest, res: NextApiResponse) {
  const OrdeerID = "clg1elwrs0000mbsisg6i5t7n";
  const prisma = new PrismaClient({
    log: ["query", "info", "warn"],
  });

  const order = await prisma.order.findUnique({
    where: {
      id: OrdeerID,
    },
    include: {
      Ticket: true,
      Competition: {
        include: {
          Watches: {
            include: {
              images_url: true,
            },
          },
        },
      },
    },
  });
  const EmailRender = Email(order);
  /*
  await Transporter.sendMail({
    from: "noreply@winuwatch.uk",
    to: "iliassjabali@gmail.com",
    subject: `Order Confirmation - Winuwatch #${order?.id || "000000"}`,
    html: EmailRender,
  });
  */
  res.send(EmailRender);
}
