import type { NextApiRequest, NextApiResponse } from "next";
import Email, { GetData } from "@/components/emails";
import { Competition, PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

export default async function send(req: NextApiRequest, res: NextApiResponse) {
  const OrdeerID = "97d79eef-5e5e-4884-a9f0-4143eb5fbd1e";

  const data = await GetData(OrdeerID, prisma);
  const EmailRender = Email(data);

  /*
  await Transporter.sendMail({
    from: "noreply@winuwatch.uk",
    to: "iliassjabali@gmail.com",
    subject: `Order Confirmation - Winuwatch #${data[0]?.id || "000000"}`,
    html: EmailRender,
  });
  const data = await prisma.competition.findMany({
    include: {
      Ticket: {
        where: {
          orderId: ,
        },
      },
      Watches : {
        include: {
          images_url: true,
        }  
      }
    },
  });

  res.send(data[0]?.Ticket.map((ticket) => ticket.id));
  */
  res.send(EmailRender);
}
