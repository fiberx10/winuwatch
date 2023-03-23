import { create } from "zustand";
import { Order } from "@prisma/client";

interface Comp {
  compID: string;
  number_tickets: number;
  price_per_ticket: number;
}
export interface OrderStore extends Order {
  comps: Comp[];
}

export const Formater = (value : number | bigint) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(value);

interface RootState {
    order:
      | OrderStore
      | undefined
      | {
          comps: Comp[];
        };
    updateOrder: (NewOrder: OrderStore) => void;
    addComp: ({ compID, number_tickets, price_per_ticket }: Comp) => void;
    removeComp: (compID: string) => void;
    cardDetails: () => {
      totalCost : number;
      Number_of_item: number;
    };
    updateComp: ({ compID, number_tickets }: Comp) => void;
    updateTotal: (total: number) => void;
    reset: () => void;
  }

export default create<RootState>((set, get) => ({
  order: undefined,
  reset: () => set({ order: undefined }),
  updateOrder: (NewOrder) =>
    set(({ order }) => ({
      order: order ? { ...order, ...NewOrder } : NewOrder,
    })),
  cardDetails: () => {
    const { order } = get();
    
    return order
      ? {
        
          totalCost : order.comps.reduce((acc, c) => {
              return acc + c.number_tickets * c.price_per_ticket;
            }, 0),
          Number_of_item: order.comps.length,
        }
      : {
         
          totalCost : 0,
          Number_of_item: 0,
        };
  },
  updateTotal: (total) =>
    set(({ order }) => ({
      order: order && {
        ...order,
        total,
      },
    })),

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
