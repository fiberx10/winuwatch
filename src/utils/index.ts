import { z } from "zod";
import { OrderSchema } from "./zodSchemas";
export * from "./api";

export const i18n = ["en", "es", "fr", "ja", "il"] as const;

export const CreateOrderFromCartSchema = OrderSchema.extend({
  comps: z.array(
    z.object({
      compID: z.string(),
      number_tickets: z.number().default(1),
      price_per_ticket: z.number(),
      reduction: z.number().default(0),
    })
  ),
}).omit({
  id: true,
  status: true,
  address: true,
  checkedEmail: true,
  country: true,
  date: true,
  first_name: true,
  last_name: true,
  town: true,
  zip: true,
  phone: true,
  email: true,
  paymentMethod: true,
  checkedTerms: true,
  totalPrice: true,
});
export const CreateOrderSchema = OrderSchema.extend({
  comps: z.array(
    z.object({
      compID: z.string(),
      number_tickets: z.number().default(1),
      price_per_ticket: z.number(),
      reduction: z.number().default(0),
    })
  ),
}).omit({
  status: true,
  id: true,
});
export const Comps = z.array(
  z.object({
    compID: z.string(),
    number_tickets: z.number().default(1),
    price_per_ticket: z.number(),
    reduction: z.number().default(0),
  })
);
export const CreateOrderStripeSchema = OrderSchema.extend({
  comps: z.array(
    z.object({
      compID: z.string(),
      number_tickets: z.number().default(1),
      price_per_ticket: z.number(),
      reduction: z.number().default(0),
    })
  ),
  affiliationId: z.string().optional(),
  runUpPrizeId: z.string().optional(),
  locale: z.enum(i18n).default("en"),
}).omit({
  status: true,
});
const DEFAULTLOCAL = "en";

export const Formater = (value: number | bigint, local = DEFAULTLOCAL) =>
  new Intl.NumberFormat(local, {
    style: "currency",
    currency: "GBP",
  }).format(value);

export const DateFormater = (value: Date, local = DEFAULTLOCAL) =>
  new Intl.DateTimeFormat(local, {
    dateStyle: "full",
    timeStyle: "short",
    hourCycle: "h12",
    timeZone: "Europe/London",
  }).format(value);

export const MAX_TICKETS = 25;
export const TICKETREDUC = [
  ...new Array(4).fill(0).map((_, i) => ({
    value: i + 1,
    reduction: 0.0,
  })),
  {
    value: 5,
    reduction: 0,
  },
  ...new Array(4).fill(0).map((_, i) => ({
    value: i + 6,
    reduction: 0.0,
  })),
  {
    value: 10,
    reduction: 0,
  },
  {
    value: 15,
    reduction: 0.1,
  },
  {
    value: 20,
    reduction: 0.15,
  },
  {
    value: 25,
    reduction: 0.2,
  },
];


export const Charities: Array<{
  img: string;
  name: any;
  amount: number;
  desc: any;
  link: string;
}> = [
  {
    img: "/images/jFox.png",
    name: "heart",
    amount: 2346,
    desc: "heartDesc",
    link: "https://www.michaeljfox.org/",
  },{
    img: "/images/SuperHero.png",
    name: "superhero",
    amount: 3435,
    desc: "superheroDesc",
    link: "https://www.associationsuperheros.org/checkout/donate?donatePageId=5c6dcb3ce79c70c63089d77b",
  }
] 

export interface CompetitionData {
  competitionId: string;
  competitionName: string;
  TotalOrderValue: number;
}
