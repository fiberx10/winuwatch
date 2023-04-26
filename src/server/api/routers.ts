import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CompetitionStatus, order_status } from "@prisma/client";
import {
  getBaseUrl,
  CreateOrderSchema,
  CreateOrderFromCartSchema,
  CreateOrderStripeSchema,
  Comps,
} from "@/utils";
import { Transporter, Stripe } from "../utils";
import { WatchesSchema, CompetitionSchema } from "@/utils/zodSchemas";
import Email, { GetData } from "@/components/emails";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";

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
      Full_Name: `${ticket.Order.first_name} ${ticket.Order.last_name}`,
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
  getAll: publicProcedure.input(z.array(z.string()).optional()).query(
    async ({ ctx, input }) =>
      await ctx.prisma.order.findMany({
        where: {
          Ticket: {
            some: {
              Competition: {
                id: {
                  in: input,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Ticket: true,
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
      const data = await GetData(input, ctx.prisma);
      if (!data.order) {
        throw new Error("Order not found");
      }

      return data.order;
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
      data.comps.length > 0 &&
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
        const { locale, comps, ...data } = input;
        const [Order, StripeOrder] = await Promise.all([
          ctx.prisma.order.update({
            where: {
              id: input.id,
            },
            data: {
              ...data,
              status: order_status.PENDING,
            },
          }),
          await Stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: data.email,
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
                      ), // in cents
                    },
                    quantity:
                      input.comps.find((item) => item.compID === comp.id)
                        ?.number_tickets || 0,
                  }
                : {}
            ),
            success_url: `${getBaseUrl()}/${locale}/Confirmation/${input.id}`,
            cancel_url: `${getBaseUrl()}/${locale}/Cancel/${input.id}`,
          }),
        ]);
        console.log(StripeOrder);

        await ctx.prisma.order.update({
          where: {
            id: Order.id,
          },
          data: {
            paymentId: StripeOrder.id,
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

  // TODO: The two procedures that was added
  checkDiscount: publicProcedure
    .input(
      z.object({
        code: z.string(),
        email: z.string().email(),
        competitionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { code, email } = input;
        const discount = await ctx.prisma.affiliation.findUnique({
          where: {
            discountCode: code,
            ownerEmail: email,
          },
        });
        if (!discount) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount not found",
          });
        } else {
          return discount;
        }
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: e,
        });
      }
    }),

  applyDiscount: publicProcedure
    .input(z.object({ orderId: z.string(), discountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { orderId, discountId } = input;
        const order = await ctx.prisma.order.findUnique({
          where: {
            id: orderId,
          },
        });
        if (!order) {
          throw new Error("Invalid order");
        } else if (order.status !== order_status.CONFIRMED) {
          throw new Error("Order not confirmed");
        } else {
          const discount = await ctx.prisma.affiliation.findUnique({
            where: {
              id: discountId,
            },
          });
          if (!discount) {
            throw new Error("Invalid discount");
          } else {
            await ctx.prisma.$transaction(async (tx) => {
              await tx.order.update({
                where: {
                  id: orderId,
                },
                data: {
                  totalPrice: {
                    decrement: discount.discountRate * order.totalPrice,
                  },
                },
              });
              await tx.affiliation.update({
                where: {
                  id: discountId,
                },
                data: {
                  uses: {
                    increment: 1,
                  },
                },
              });
              const updatedDiscount = await tx.affiliation.findUnique({
                where: {
                  id: discountId,
                },
              });
              if (updatedDiscount && updatedDiscount.uses % 5 === 0) {
                const ownerPrevOrders = await tx.order.findMany({
                  where: {
                    email: discount.ownerEmail,
                  },
                  select: {
                    id: true,
                    phone: true,
                    first_name: true,
                    last_name: true,
                    country: true,
                    address: true,
                    zip: true,
                    Ticket: {
                      select: {
                        competitionId: true,
                      },
                      where: {
                        competitionId: discount.competitionId,
                      },
                    },
                  },
                });
                // await tx.$queryRaw`SELECT * FROM "ticket" WHERE "competitionId" = ${discount.competitionId} AND "orderId" IN (SELECT "id" FROM "order" WHERE "email" = ${discount.ownerEmail}) `;

                if (!!ownerPrevOrders.length) {
                  const {
                    phone = "",
                    first_name = "",
                    last_name = "",
                    country = "",
                    address = "",
                    zip = "",
                  } = ownerPrevOrders[0] || {};
                  const wonOrder = await tx.order.create({
                    data: {
                      email: discount.ownerEmail,
                      phone: phone,
                      first_name: first_name,
                      last_name: last_name,
                      country: country,
                      address: address,
                      zip: zip,
                      date: new Date(),
                      paymentMethod: "AFFILIATION",
                      checkedEmail: true,
                      checkedTerms: true,
                      status: order_status.CONFIRMED,
                      totalPrice: 0,
                    },
                  });
                  await tx.ticket.create({
                    data: {
                      competitionId: discount.competitionId,
                      orderId: wonOrder.id,
                    },
                  });
                  await tx.competition.update({
                    where: {
                      id: discount.competitionId,
                    },
                    data: {
                      remaining_tickets: {
                        decrement: 1,
                      },
                    },
                  });
                  await Transporter.sendMail({
                    from: "noreply@winuwatch.uk",
                    to: discount.ownerEmail,
                    subject: `Claim your free ticket - Winuwatch`,
                    // html: /* Email(), */
                  });
                } else {
                  throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No previous orders was made by this user",
                  });
                }
              }
            });
            return true;
          }
        }
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: e,
        });
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

function shuffleArray(array: (string | undefined)[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.filter((item): item is string => typeof item === "string");
}

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
      answers: shuffleArray(Question.answers.map(({ answer }) => answer)) || [],
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
        discountCode: z.string(),
        discountRate: z.number(),
        ownerEmail: z.string().email(),
        competitionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.affiliation.create({
        data: {
          ...input,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        discountCode: z.string(),
        discountRate: z.number(),
        ownerEmail: z.string(),
        compitionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.affiliation.update({
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.affiliation.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
