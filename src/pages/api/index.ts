import type { NextApiRequest, NextApiResponse } from "next";
import Email, { GetData } from "@/components/emails";
import { Competition, PrismaClient } from "@prisma/client";
//import Email from "@/components/newsLetter1";
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
  const OrderID = "b02e8ab1-e42c-4f8e-9650-4312822bda32";

  //const data = await GetData(OrdeerID, prisma);
  //const EmailRender = Email(data);

  /*await Transporter.sendMail({
    from: "noreply@winuwatch.uk",
    to: "louihranim@gmail.com",

    subject: `Order Confirmation - Winuwatch #${data[0]?.id || "000000"}`,

    subject: `Order Confirmation - Winuwatch #${order?.id || "000000"}`,
    html: EmailRender,
  });
  // const data = await prisma.competition.findMany({
  //   include: {
  //     Ticket: {
  //       where: {
  //         orderId: ,
  //       },
  //     },
  //     Watches : {
  //       include: {
  //         images_url: true,
  //       }
  //     }
  //   },
  // });

  // res.send(data[0]?.Ticket.map((ticket) => ticket.id));

  res.send(EmailRender);
  */

  res.send(await GetData(OrderID, prisma));
}
