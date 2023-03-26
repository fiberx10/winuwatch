import { create } from "zustand";
import { Order } from "@prisma/client";

interface Comp  {
  compID: string;
  number_tickets: number;
  price_per_ticket: number;
}


interface RootState {
  competitions: {
    compID: string;
    number_tickets: number;
    price_per_ticket: number;
  }[];
  addComp: ({ compID, number_tickets, price_per_ticket }: {
    compID: string;
    number_tickets: number;
    price_per_ticket: number;
  }) => void;
  removeComp: (compID: string) => void;
  cardDetails: () => {
    totalCost: number;
    Number_of_item: number;
  };
  
  updateComp: ({
    compID,
    number_tickets,
    price_per_ticket,
  }: Comp & { price_per_ticket: number | undefined }) => void;
  reset: () => void;
}

type Pages = "Vue d'ensemble" | "Concours" | "Prix";

export const useStore = create<{
  menu: Pages;
  selectMenu: (params: "Vue d'ensemble" | "Concours" | "Prix") => void;
}>((set, get) => ({
  menu: "Vue d'ensemble",
  selectMenu: (params) => set({ menu: params }),
}));

export const useCart = create<RootState>((set, get) => ({
  competitions: [],
  reset: () =>
    set({
      competitions: [],
    }),
  cardDetails: () => {
    const { competitions } = get();
    return {
      totalCost: competitions.reduce(
        (acc, c) => acc + c.number_tickets * c.price_per_ticket,
        0
      ),
      Number_of_item: competitions.length,
    };
  },
  addComp: (comp) =>
    set(({ competitions }) => ({
      competitions: [...competitions, comp],
    })),
  removeComp: (compID) =>
    set(({ competitions }) => ({
      competitions: competitions.filter((c) => c.compID !== compID),
    })),
  updateComp: (comp) =>
    set(({ competitions }) => ({
      competitions: competitions.map((c) =>
        c.compID === comp.compID ? { ...c, ...comp } : c
      ),
    })),
}));
