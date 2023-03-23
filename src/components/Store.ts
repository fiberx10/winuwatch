import { create } from "zustand";
import { Order } from "@prisma/client";

interface Comp {
  compID: string;
  number_tickets: number;
}
interface OrderStore extends Order {
  comps: Comp[];
}
export default create<{
  order:
    | OrderStore
    | undefined
    | {
        comps: Comp[];
      };
  updateOrder: (NewOrder: OrderStore) => void;
  addComp: ({ compID, number_tickets }: Comp) => void;
  removeComp: (compID: string) => void;
  cardDetails: () => {
    total: number;
    items: number;
  };
  updateComp: ({ compID, number_tickets }: Comp) => void;
}>((set, get) => ({
  order: undefined,
  updateOrder: (NewOrder) =>
    set(({ order }) => ({
      order: order ? { ...order, ...NewOrder } : NewOrder,
    })),
  cardDetails: () => {
    const { order } = get();
    return order
      ? {
          total: order.comps.reduce((acc, c) => acc + c.number_tickets, 0),
          items: order.comps.length,
        }
      : {
          total: 0,
          items: 0,
        };
  },
  addComp: (comp) =>
    set(({ order }) => ({
      order: order
        ? {
            ...order,
            comps: [...order.comps, comp],
          }
        : { comps: [comp] },
    })),
  removeComp: (compID) =>
    set(({ order }) => ({
      order: order
        ? {
            ...order,
            comps: order.comps.filter((c) => c.compID !== compID),
          }
        : { comps: [] },
    })),
  updateComp: (comp) =>
    set(({ order }) => ({
      order: order
        ? {
            ...order,
            comps: order.comps.map((c) =>
              c.compID === comp.compID ? comp : c
            ),
          }
        : { comps: [] },
    })),
}));
