import type { NextApiRequest, NextApiResponse } from 'next';
import { Competition, PrismaClient } from '@prisma/client';
//import Email from "@/components/newsLetter1";
import nodemailer from 'nodemailer';
import WinningEmail, { GetWinnerData } from '@/components/emails/WinningEmail';
import { Email } from '@/components/emails';
import { Transporter } from '@/server/utils';
import RemainingEmail from '@/components/emails/RemainingEmail';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

export default async function send(req: NextApiRequest, res: NextApiResponse) {
  // const OrderID = '8a0a819e-bc12-4d01-86c0-2f1e3e25dc75';
  const TicketID = 'clgwcdyeg01h4t5jgi5kzezv5';

  // const data = await GetWinnerData(TicketID, prisma);
  // const EmailRender = WinningEmail(data);

  // await Transporter.sendMail({
  //   from: 'noreply@winuwatch.uk',
  //   to: 'ysftest3@gmail.com',

  //   subject: `Order Confirmation - Winuwatch #${data.data?.id || '000000'}`,

  //   html: EmailRender,
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

  // res.send(data[0]?.Ticket.map((ticket) => ticket.id));

  // res.send(EmailRender);

  res.send(RemainingEmail(await GetWinnerData(TicketID, prisma)));
}
