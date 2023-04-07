import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import Email from "@/components/emails";
import nodemailer from "nodemailer";
import { faker } from "@faker-js/faker";
import { Order, OrderStatus, PaymentMethod, Ticket } from "@prisma/client";
const GENorder = (): Order & {
  Ticket: Ticket[];
} => ({
  id: faker.datatype.uuid(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  country: faker.address.country(),
  address: faker.address.streetAddress(),
  town: faker.address.city(),
  zip: faker.address.zipCode(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  date: faker.date.past(),
  status: faker.helpers.arrayElement([
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.CANCELLED,
  ]),
  paymentMethod: faker.helpers.arrayElement([
    PaymentMethod.PAYPAL,
    PaymentMethod.STRIPE,
  ]),
  checkedEmail: faker.datatype.boolean(),
  checkedTerms: faker.datatype.boolean(),
  totalPrice: faker.datatype.number(1000),
  paymentId: faker.datatype.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  Ticket: new Array(faker.datatype.number(10)).fill(0).map((_) => ({
    id: faker.datatype.uuid(),
    orderId: faker.datatype.uuid(),
    competitionId: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })),
});

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@winuwatch.uk",
    pass: "Password1!",
  },
});
export default async function send(req: NextApiRequest, res: NextApiResponse) {
  //  res.send("Order Confirmation")));
  await transporter.sendMail({
    from: "noreply@winuwatch.uk",
    to: "iliassjabali@gmail.com",
    subject: "Order Confirmation",
    html: render(Email(GENorder())),
  });
  res.send(render(Email(GENorder())));
}
