/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Affiliation, CompetitionStatus, order_status } from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  getBaseUrl,
  CreateOrderSchema,
  CreateOrderFromCartSchema,
  CreateOrderStripeSchema,
  Comps,
} from "@/utils";
import { Transporter, Stripe } from "../utils";
import {
  WatchesSchema,
  CompetitionSchema,
  affiliationSchema,
} from "@/utils/zodSchemas";
import type { PrismaClient } from "@prisma/client";
import Email, { GetData } from "@/components/emails";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";

const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const discountCodeGenerator = async (prisma: PrismaClient): Promise<string> => {
  const possible =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  let attempts = 0;
  while (attempts < 10) {
    // limit the number of attempts to 10
    const coupon = Array.from(
      { length: 8 },
      () => possible[Math.floor(Math.random() * possible.length)]
    ).join("");
    const exists = await prisma.affiliation.findMany({
      where: {
        discountCode: coupon,
      },
    });
    if (exists.length === 0) {
      return coupon;
    }
    attempts++;
  }
  throw new Error(
    "Failed to generate a unique discount code after 10 attempts"
  );
};

export const WinnersRouter = createTRPCRouter({
  getCSV: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const competition = await ctx.prisma.competition.findUnique({
      where: {
        id: input,
      },
      include: {
        Ticket: {
          include: {
            Order: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error("Competition not found");
    }
    return competition.Ticket.map((ticket) => ({
      ticketID: ticket.id,
      Full_Name: `${ticket.Order.first_name!} ${ticket.Order.last_name!}`,
      Order_ID: ticket.Order.id,
      competionName: competition.name,
      Total_Price: ticket.Order.totalPrice,
    }));
  }),
  pickOneRandom: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //based on the competition id, pick a random winner and return the ticket data and order data

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          competitionId: input,
        },
        include: {
          Order: true,
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
      const random = Math.floor(Math.random() * tickets.length); // This algo neeeds to change
      return tickets[random] ?? tickets[0];
    }),
  confirmWinner: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //based on the ticket ID we should be able to close the competition and send the winner an email
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input,
        },
        include: {
          Order: true,
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
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      /*
      const { Order, Competition } = ticket;
      const { Watches } = Competition;
      const { email } = Order;
      */
      return void 0; //TODO : Send email
    }),
});

export const TicketsRouter = createTRPCRouter({
  getTicket: publicProcedure.input(z.string().optional()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.ticket.findUniqueOrThrow({
        where: {
          id: input,
        },
        include: {
          Competition: true,
          Order: true,
        },
      })
  ),
});

export const AuthRouter = createTRPCRouter({
  auth: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      const user = { username: "admin", password: "1234" };
      return (
        input.username === user.username && input.password === user.password
      );
    }),
});

export const OrderRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.string()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: {
          Ticket: {
            some: {
              Competition: {
                id: input,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Ticket: {
            where: {
              competitionId: input,
            },
          },
        },
      })
  ),
  getOrder: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await GetData(input, ctx.prisma);
    if (!data.order) {
      throw new Error("Order not found");
    }

    await Transporter.sendMail({
      from: "noreply@winuwatch.uk",
      to: data.order.email,
      subject: `Order Confirmation - Winuwatch #${data.order?.id || "000000"}`,
      html: Email(data),
    });
    return data.order;
  }),
  getOrderCheck: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input,
        },
      });
      //const data = await GetData(input, ctx.prisma);
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),
  AddTicketsAfterConfirmation: publicProcedure
    .input(z.object({ id: z.string(), comps: Comps }))
    .query(async ({ ctx, input }) => {
      const data = await GetData(input.id, ctx.prisma);
      if (!data.order) {
        throw new Error("Order not found");
      }
      await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          Ticket: {
            createMany: {
              data: input.comps
                .map(({ compID, number_tickets }) =>
                  new Array(number_tickets).fill(0).map((_) => ({
                    competitionId: compID,
                  }))
                )
                .flat(),
            },
          },
        },
      });

      //! What I've added
      if (data.comps.length > 0 && !!data.order?.affiliationId?.length) {
        await ctx.prisma.$transaction(async (tx) => {
          const updatedAffiliation = await tx.affiliation.update({
            where: {
              id: data?.order?.affiliationId || undefined,
            },
            data: {
              uses: {
                increment: 1,
              },
            },
          });

          if (updatedAffiliation && updatedAffiliation.uses % 5 === 0) {
            const ownerPrevOrders = await tx.order.findFirst({
              where: {
                email: updatedAffiliation.ownerEmail,
              },
              include: {
                Ticket: {
                  where: {
                    competitionId: updatedAffiliation.competitionId,
                  },
                },
              },
            });

            if (!!ownerPrevOrders) {
              const { phone, first_name, last_name, country, address, zip } =
                ownerPrevOrders || {};
              const wonOrder = await tx.order.create({
                data: {
                  email: updatedAffiliation.ownerEmail,
                  phone: phone,
                  first_name: first_name,
                  last_name: last_name,
                  country: country,
                  address: address,
                  zip: zip,
                  date: new Date(),
                  paymentMethod: "AFFILIATION",
                  status: order_status.CONFIRMED,
                },
              });
              await tx.ticket.create({
                data: {
                  competitionId: updatedAffiliation.competitionId,
                  orderId: wonOrder.id,
                },
              });
              await tx.competition.update({
                where: {
                  id: updatedAffiliation.competitionId,
                },
                data: {
                  remaining_tickets: {
                    decrement: 1,
                  },
                },
              });

              await Transporter.sendMail({
                from: "noreply@winuwatch.uk",
                to: updatedAffiliation.ownerEmail,
                subject: `Claim your free ticket - Winuwatch`,
                html: Email({
                  order: wonOrder,
                  comps: data.comps.filter(
                    (e) => e.id === updatedAffiliation.competitionId
                  ),
                }),
              });
            }
          }
        });
      }

      //! send new discount code to user that made the order
      if (
        data.comps.length > 0 &&
        data.order?.status === order_status.CONFIRMED
      ) {
        const affiliationExist = await ctx.prisma.affiliation.findMany({
          where: {
            ownerEmail: data.order.email,
            competitionId: {
              in: data.comps.map((e) => e.id),
            },
          },
        });

        const affiliationExistIds = new Set(
          affiliationExist.map((e) => e.competitionId)
        );

        for (const comp of data.comps) {
          if (!affiliationExistIds.has(comp.id)) {
            const newAffiliation = await ctx.prisma.affiliation.create({
              data: {
                ownerEmail: data.order.email,
                discountCode: await discountCodeGenerator(ctx.prisma),
                competitionId: comp.id,
              },
            });
            comp.affiliationCode = newAffiliation.discountCode;
          } else {
            for (const affiliation of affiliationExist) {
              if (comp.id === affiliation.competitionId) {
                comp.affiliationCode = affiliation.discountCode;
                break;
              }
            }
          }
        }
      }

      data.comps.length > 0 &&
        data.order?.status === order_status.CONFIRMED &&
        (await Transporter.sendMail({
          from: "noreply@winuwatch.uk",
          to: data.order.email,
          subject: `Order Confirmation - Winuwatch #${
            data.order?.id || "000000"
          }`,
          html: Email(data),
        }));
      return data.order;
    }),
  sendEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await GetData(input, ctx.prisma);
      if (!data.order) {
        throw new Error("Order not found");
      }

      await Transporter.sendMail({
        from: "noreply@winuwatch.uk",
        to: data.order.email,
        subject: `Order Confirmation - Winuwatch #${
          data.order?.id || "000000"
        }`,
        html: Email(data),
      });
      return true;
    }),
  createStripe: publicProcedure
    .input(CreateOrderStripeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { locale, comps, affiliationId, ...data } = input;
        const affiliationData = input.affiliationId
          ? await ctx.prisma.affiliation.findUnique({
              where: {
                id: affiliationId,
              },
            })
          : null;
        const [Order, StripeOrder] = await Promise.all([
          ctx.prisma.order.update({
            where: {
              id: input.id,
            },
            data: {
              ...data,
              affiliationId: affiliationId,
              status: order_status.PENDING,
            },
          }),
          await Stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: data.email,
            locale: locale === "il" ? "auto" : locale,
            line_items: (
              await ctx.prisma.competition.findMany({
                where: {
                  id: {
                    in: comps.map(({ compID }) => compID),
                  },
                },
                include: {
                  Watches: {
                    include: {
                      images_url: true,
                    },
                  },
                },
              })
            ).map((comp) =>
              comp.Watches
                ? {
                    price_data: {
                      currency: "gbp",
                      product_data: {
                        name: comp.Watches.model,
                        images: comp.Watches.images_url.map(({ url }) => url),
                      },
                      unit_amount: Math.floor(
                        comp.ticket_price *
                          100 *
                          (1 -
                            (input.comps.find(
                              ({ compID }) => compID === comp.id
                            )?.reduction || 0))
                      ),
                    },
                    quantity:
                      input.comps.find((item) => item.compID === comp.id)
                        ?.number_tickets || 0,
                  }
                : {}
            ),
            success_url: `${getBaseUrl()}${
              locale && `/${locale}`
            }/Confirmation/${input.id}`,
            cancel_url: `${getBaseUrl()}${locale && `/${locale}`}/Cancel/${
              input.id
            }`,
          }),
        ]);

        await ctx.prisma.order.update({
          where: {
            id: Order.id,
          },
          data: {
            paymentId: StripeOrder.id,
          },
        });

        return {
          url: StripeOrder.url,
        };
      } catch (e) {
        console.error(e);
        return {
          error: "Error in creating the order",
          url: null,
        };
      }
    }),

  createOrder: publicProcedure
    .input(CreateOrderFromCartSchema.optional())
    .mutation(async ({ ctx, input }) => {
      const id = faker.datatype.uuid();
      const order = await ctx.prisma.order.create({
        data: {
          address: "",
          checkedEmail: false,
          country: "",
          date: new Date(),
          first_name: "",
          last_name: "",
          town: "",
          zip: "",
          phone: "",
          email: "",
          paymentMethod: "STRIPE",
          checkedTerms: false,
          totalPrice: 0,
          id,
          status: order_status.INCOMPLETE,
          Ticket: {
            createMany: {
              data: [],
            },
          },
        },
      });
      return order.id;
    }),
  create: publicProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { comps, ...data } = input;
      return await ctx.prisma.order.create({
        data: {
          ...data,
          status: order_status.CONFIRMED,
          Ticket: {
            createMany: {
              data: comps
                .map(({ compID, number_tickets }) =>
                  new Array(number_tickets).fill(0).map((_) => ({
                    competitionId: compID,
                  }))
                )
                .flat(),
            },
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      CreateOrderSchema.extend({
        status: z.nativeEnum(order_status),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.order.update({
        data: input,
        where: {
          id,
        },
      });
    }),
  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.nativeEnum(order_status) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  removeTickets: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ticket.deleteMany({
        where: {
          orderId: input,
        },
      });
    }),
  remove: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.ticket.deleteMany({
      where: {
        orderId: input,
      },
    });
    return await ctx.prisma.order.delete({
      where: {
        id: input,
      },
    });
  }),
});

export const CompetitionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          ids: z.array(z.string()).optional(),
          status: z.nativeEnum(CompetitionStatus).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const Data = await ctx.prisma.$transaction([
        ctx.prisma.competition.findMany({
          where: input
            ? {
                status: input.status,
                id: {
                  in: input.ids,
                },
              }
            : {},
          select: {
            id: true,
            _count: {
              select: {
                Ticket: true,
              },
            },
          },
        }),
        ctx.prisma.competition.findMany({
          where: input
            ? {
                status: input.status,
                id: {
                  in: input.ids,
                },
              }
            : {},
          include: {
            Watches: {
              include: {
                images_url: true,
              },
            },
          },
        }),
      ]);
      // Get the list of competitions to update
      const finishedComps = Data[1]
        .filter(
          (comp) =>
            comp.status !== CompetitionStatus.COMPLETED &&
            comp.total_tickets -
              (Data[0].find((item) => item.id === comp.id)?._count?.Ticket ||
                0) <=
              0 &&
            comp.end_date < new Date()
        )
        .map(({ id }) => id);

      // Update the status of the selected competitions to "COMPLETE"
      await ctx.prisma.competition.updateMany({
        where: { id: { in: finishedComps } },
        data: { status: CompetitionStatus.COMPLETED },
      });

      return Data[1].map((comp) => ({
        ...comp,
        remaining_tickets:
          comp.total_tickets -
          (Data[0].find((item) => item.id === comp.id)?._count?.Ticket || 0),
      }));
    }),
  //GetUniqueByID
  GetUniqueByID: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Data = await ctx.prisma.$transaction([
        ctx.prisma.competition.findUnique({
          where: {
            id: input,
          },
          select: {
            id: true,
            _count: {
              select: {
                Ticket: true,
              },
            },
          },
        }),
        ctx.prisma.competition.findUnique({
          where: {
            id: input,
          },
          include: {
            Watches: {
              include: {
                images_url: true,
              },
            },
          },
        }),
      ]);
      return Data[1] && Data[0]
        ? {
            ...Data[1],
            remaining_tickets: Data[1]?.total_tickets - Data[0]?._count?.Ticket,
          }
        : undefined;
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return (await ctx.prisma.competition.delete({
      where: {
        id: input,
      },
    }))
      ? {
          success: true,
        }
      : {
          success: false,
          error: "Competition not found",
        };
  }),
  byID: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const Data = await ctx.prisma.$transaction([
      ctx.prisma.competition.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          _count: {
            select: {
              Ticket: true,
            },
          },
        },
      }),
      ctx.prisma.competition.findUnique({
        where: {
          id: input,
        },
        include: {
          Watches: {
            include: {
              images_url: true,
            },
          },
        },
      }),
    ]);
    return Data[1]
      ? {
          ...Data[1],
          remaining_tickets:
            Data[1].total_tickets - (Data[0]?._count?.Ticket || 0),
        }
      : undefined;
  }),
  updateOne: publicProcedure
    .input(
      CompetitionSchema.extend({
        watchesId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.competition.update({
        data,
        where: {
          id,
        },
      });
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(CompetitionStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      return await ctx.prisma.competition.updateMany({
        where: {
          id,
        },
        data: {
          status: status,
        },
      });
    }),

  add: publicProcedure
    .input(CompetitionSchema.omit({ id: true }).required())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.competition.create({
        data: {
          ...input,
        },
      });
    }),
});

export const WatchesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.watches.findMany({
        include: {
          images_url: true,
        },
      })
    ).map((watch) => ({
      ...watch,
      images_url: watch.images_url.map((image) => image.url),
    }));
  }),
  byID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.watches.findUnique({
        where: {
          id: input.id,
        },
        include: {
          images_url: true,
        },
      });
    }),
  remove: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    //TODO: Delete the images from firebase
    await ctx.prisma.imagesUrl.deleteMany({
      where: {
        WatchesId: input,
      },
    });
    return await ctx.prisma.watches.delete({
      where: {
        id: input,
      },
    });
  }),
  removeWatchIMG: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //TODO: Delete the images from firebase
      await ctx.prisma.imagesUrl.deleteMany({
        where: {
          url: input,
        },
      });
    }),
  addWatchIMG: publicProcedure
    .input(
      z.object({
        WatchesId: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.imagesUrl.create({
        data: {
          ...input,
        },
      });
    }),

  add: publicProcedure
    .input(
      WatchesSchema.omit({
        id: true,
      }).extend({
        images_url: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { images_url, ...data } = input;
      return await ctx.prisma.watches.create({
        data: {
          ...data,
          images_url: {
            create: images_url.map((url) => ({ url })),
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      WatchesSchema.extend({
        images_url: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, images_url, ...data } = input;
      return await ctx.prisma.watches.update({
        data: {
          ...data,
          images_url: {
            create: images_url?.map((url) => ({ url })),
          },
        },
        where: {
          id,
        },
      });
    }),

  /*
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        owner_ref: z.string().optional(),
        condition: z.string(),
        years: z.number(),
        movement: z.string(),
        case_size: z.number(),
        dail: z.string(),
        case_material: z.string(),
        bracelet_material: z.string(),
        water_proof: z.string(),
        box: z.boolean().default(false),
        papers: z.boolean().default(false),
        imageURL: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.create({
        data: input,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        owner_ref: z.string().optional(),
        condition: z.string().optional(),
        years: z.number().optional(),
        movement: z.string().optional(),
        case_size: z.number().optional(),
        dail: z.string().optional(),
        case_material: z.string().optional(),
        bracelet_material: z.string().optional(),
        water_proof: z.string().optional(),
        box: z.boolean().optional(),
        papers: z.boolean().optional(),
        imageURL: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.watches.update({
        data,
        where: { id },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watches.delete({
        where: {
          id: input.id,
        },
      });
    }),
    */
});

export const QuestionRouter = createTRPCRouter({
  getOneRandom: publicProcedure.query(async ({ ctx }) => {
    const Questions = await ctx.prisma.question.findMany({
      include: {
        answers: true,
      },
    });
    const randomIndex = Math.floor(Math.random() * Questions.length);
    const Question =
      randomIndex < Questions.length && randomIndex >= 0
        ? Questions[randomIndex]
        : Questions[0];
    if (!Question) {
      return null;
    }
    return {
      ...Question,
      answers:
        ((array: (string | undefined)[]) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array.filter(
            (item): item is string => typeof item === "string"
          );
        })(Question.answers.map(({ answer }) => answer)) || [],
    };
  }),
});

export const AffiliationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.affiliation.findMany();
  }),
  add: publicProcedure
    .input(
      z.object({
        discountRate: z.number(),
        ownerEmail: z.string().email(),
        competitionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.affiliation.create({
        data: {
          ...input,
          discountCode: await discountCodeGenerator(ctx.prisma),
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        discountRate: z.number().optional(),
        ownerEmail: z.string().email().optional(),
        compitionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.affiliation.update({
        data,
        where: { id },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.affiliation.delete({
      where: {
        id: input,
      },
    });
  }),
  checkDiscount: publicProcedure
    .input(
      z.object({
        discountCode: z.string(),
        competitionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.discountCode) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Enter your discount code",
          });
        }
        return await ctx.prisma.affiliation.findFirstOrThrow({
          where: {
            discountCode: input.discountCode,
            competitionId: {
              in: input.competitionIds,
            },
          },
        });
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Invalid discount code",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: e,
        });
      }
    }),
});

export const ChartsRouter = createTRPCRouter({
  getLastOrders: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.order.findMany({
          take: input || 10,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            status: {
              not: order_status.INCOMPLETE,
            },
          },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            totalPrice: true,
            status: true,
            paymentMethod: true,
            Ticket: {
              select: {
                Competition: {
                  select: {
                    name: true,
                    Watches: {
                      select: {
                        model: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        return data;
      } catch (e) {
        return [];
      }
    }),
  // get total per month for a year
  getperMonthforYear: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const date = input ? new Date(Number(input), 0, 2) : new Date();

      const data: Array<{
        yaer: number;
        month: number;
        confirmed_total: number;
        refunded_total: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                              YEAR(m.date) AS year,
                              MONTH(m.date) AS month,
                              IFNULL(SUM(CASE WHEN o.status = 'REFUNDED' THEN o.totalPrice END), 0) AS refunded_total,
                              IFNULL(SUM(CASE WHEN o.status = 'CONFIRMED' THEN o.totalPrice END), 0) AS confirmed_total
                              FROM 
                                (
                                  SELECT 
                                    MAKEDATE(YEAR(${date}), 1) + INTERVAL (MONTHS.month - 1) MONTH AS date
                                  FROM 
                                    (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 
                                    UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS MONTHS
                                ) AS m
                                LEFT JOIN \`order\` AS o 
                                  ON YEAR(o.createdAt) = YEAR(m.date) AND MONTH(o.createdAt) = MONTH(m.date) AND o.status IN ('REFUNDED', 'CONFIRMED') 
                                  AND o.createdAt >= DATE_SUB(${date}, INTERVAL 12 MONTH) AND o.createdAt <= ${date}
                              GROUP BY 
                                YEAR(m.date), MONTH(m.date)
                              ORDER BY 
                                year ASC, month ASC
                              `;
      const result = data.map((d) => ({
        ...d,
        month: Months[d.month - 1],
        confirmed_total: Number(d.confirmed_total).toFixed(2),
        refunded_total: Number(d.refunded_total).toFixed(2),
      }));
      return result;
    }),
  // get yearly earnings for current year and previous year
  yearlyEarnings: publicProcedure.query(async ({ ctx }) => {
    // get current year and previous year total earnings
    const input = new Date();

    const data:
      | Array<{ current_year: number; last_year: number }>
      | [{ current_year: number; last_year: number }] = await ctx.prisma
      .$queryRaw`SELECT
                    IFNULL(SUM(CASE WHEN YEAR(o.createdAt) = YEAR(${input}) THEN o.totalPrice END), 0) AS current_year,
                    IFNULL(SUM(CASE WHEN YEAR(o.createdAt) = (YEAR(${input}) - 1) THEN o.totalPrice END), 0) AS last_year
                  FROM 
                      \`order\` AS o
                  WHERE 
                    o.status = 'CONFIRMED' 
                    AND YEAR(o.createdAt) >= YEAR(${input}) - 1 
                    AND YEAR(o.createdAt) <= YEAR(${input})`;
    const result: { current_year: number; last_year: number } = {
      current_year: Number(data[0].current_year.toFixed(2)) || 0,
      last_year: Number(data[0].last_year.toFixed(2)) || 0,
    };
    return result;
  }),
  // get total tickets sold per day for a month
  ticketSoldPerDay: publicProcedure.query(async ({ ctx }) => {
    try {
      const date = new Date();
      const data: Array<{
        date: string;
        total_tickets: number;
        total_orders: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                                        DATE(t.createdAt) AS date,
                                        IFNULL(COUNT(t.id), 0) AS total_tickets
                                      FROM
                                        \`tickets\` AS t
                                      WHERE
                                        t.createdAt >= DATE_SUB(${date}, INTERVAL 30 DAY)
                                        AND t.createdAt <= ${date}
                                      GROUP BY
                                        DATE(t.createdAt)
                                      ORDER BY
                                        date ASC`;

      const ticketsThisMonth: Array<{ total_tickets: number }> = await ctx
        .prisma.$queryRaw`SELECT
                            IFNULL(COUNT(t.id), 0) AS total_tickets
                          FROM
                            \`tickets\` AS t
                          WHERE
                            t.createdAt >= DATE_SUB(${date}, INTERVAL 30 DAY)
                            AND t.createdAt <= ${date}`;
      const ticketsLastMonth: Array<{ total_tickets: number }> = await ctx
        .prisma.$queryRaw`SELECT 
                            IFNULL(COUNT(t.id), 0) AS total_tickets
                          FROM
                            \`tickets\` AS t
                          WHERE
                            t.createdAt >= DATE_SUB(${date}, INTERVAL 60 DAY)
                            AND t.createdAt <= DATE_SUB(${date}, INTERVAL 30 DAY)`;
      const result = data.map((d) => ({
        month: Months[date.getMonth()],
        day: new Date(d.date).getDate(),
        total_tickets: Number(d.total_tickets),
      }));
      return {
        totalTicketsThisMonth: Number(ticketsThisMonth[0]?.total_tickets) || 0,
        totalTicketsLastMonth: Number(ticketsLastMonth[0]?.total_tickets) || 0,
        data: result,
      };
    } catch (e) {
      console.log(e);
      return { data: [], totalTicketsThisMonth: 0, totalTicketsLastMonth: 0 };
    }
  }),
  clientsCountry: publicProcedure.query(async ({ ctx }) => {
    try {
      const data: Array<{
        country: string;
        total: number;
      }> = await ctx.prisma.$queryRaw`SELECT 
                                        IFNULL(u.country, 'Unknown') AS country,
                                        COUNT(u.id) AS total
                                      FROM 
                                        \`order\` AS u
                                      GROUP BY 
                                        u.country
                                      ORDER BY 
                                        total DESC
                                      LIMIT 10`;
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }),
});
