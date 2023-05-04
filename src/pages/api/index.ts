import type { NextApiRequest, NextApiResponse } from "next";
import Email, { GetData } from "@/components/emails";
import { Competition, PrismaClient } from "@prisma/client";
//import Email from "@/components/newsLetter1";
import nodemailer from "nodemailer";


const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

export default async function send(req: NextApiRequest, res: NextApiResponse) {
  const OrderID = "8a0a819e-bc12-4d01-86c0-2f1e3e25dc75";

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

  res.send(Email(await GetData(OrderID, prisma)));
}
