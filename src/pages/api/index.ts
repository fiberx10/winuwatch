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
  const OrdeerID = "2e776100-1870-4235-99ff-d0143dfd6f00";

  const EmailRender = Email(await GetData(OrdeerID, prisma));
  const data = await GetData(OrdeerID, prisma);

  await Transporter.sendMail({
    from: "noreply@winuwatch.uk",
    to: "louihranim@gmail.com",
    subject: `Order Confirmation - Winuwatch #${data[0]?.id || "000000"}`,
    html: EmailRender,
  });

  res.send(Email(await GetData(OrdeerID, prisma)));
}
