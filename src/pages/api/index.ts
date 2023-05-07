import type { NextApiRequest, NextApiResponse } from "next";
import { Competition, PrismaClient } from "@prisma/client";
//import Email from "@/components/newsLetter1";
import nodemailer from "nodemailer";
import WinningEmail, { GetWinnerData } from "@/components/emails/WinningEmail";
import { Email } from "@/components/emails";
import { Transporter } from "@/server/utils";
import RemainingEmail from "@/components/emails/RemainingEmail";
import FreeTickets from "@/components/emails/FreeTickets";
import { NewsLetter } from "@/components/newsLetter1";

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

export default async function send(req: NextApiRequest, res: NextApiResponse) {
  // const OrderID = '8a0a819e-bc12-4d01-86c0-2f1e3e25dc75';
  const TicketID = "clgwcdyeg01h4t5jgi5kzezv5";

  // const data = await GetWinnerData(TicketID, prisma);
  // const EmailRender = WinningEmail(data);

  // await Transporter.sendMail({
  //   from: 'noreply@winuwatch.uk',
  //   to: 'ysftest3@gmail.com',

  //   subject: `Order Confirmation - Winuwatch #${data.data?.id || '000000'}`,

  //   html: EmailRender,
  // });
  // await Transporter.sendMail({
  //   from: "noreply@winuwatch.uk",
  //   cc: "admin@winuwatch.uk",
  //   to: "louihranim@gmail.com",
  //   subject: `Claim your free ticket - Winuwatch`,
  //   html: FreeTickets({
  //     tickets: 5,
  //     nextComp: nextCompetition,
  //   }),
  //   // `You won ${Math.floor(
  //   //   updatedAffiliation.uses / 5
  //   // )} free ${
  //   //   Math.floor(updatedAffiliation.uses / 5) === 1
  //   //     ? "ticket"
  //   //     : "tickets"
  //   // }, buy a ticket on next compition ${
  //   //   nextCompetition?.name || ""
  //   // } with ID ${nextCompetition?.id || ""} to claim it!`,
  // });
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
  //   const orders = await ctx.prisma.ticket.findMany({
  //   where: {
  //     Order: {
  //       checkedEmail: true,
  //     },
  //     competitionId: input,
  //   },
  //   include: {
  //     Order: true,
  //     Competition: {
  //       include: {
  //         Watches: {
  //           include: {
  //             images_url: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // await sendNewsLetters("clgwcdyeg01h4t5jgi5kzezv5");
  // res.send(data[0]?.Ticket.map((ticket) => ticket.id));

  // res.send(EmailRender);

  res.send(NewsLetter(await GetWinnerData(TicketID, prisma)));
}
