import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface Comp {
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
  addComp: ({
    compID,
    number_tickets,
    price_per_ticket,
  }: {
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

export const Dashmenus = [
  "Dashboard",
  "Competitions",
  "Watches",
  "Orders",
  "Winners",
] as const;

export const useStore = create<{
  menu: (typeof Dashmenus)[number];
  selectMenu: (menu: (typeof Dashmenus)[number]) => void;
}>()(
  devtools(
    persist(
      (set) => ({
        menu: "Dashboard",
        selectMenu: (menu) => set({ menu }),
      }),
      {
        name: "store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useCart = create<RootState>()(
  devtools(
    persist(
      (set, get) => ({
        competitions: [],
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
          set(({ competitions }) =>
            comp.number_tickets > 25 || comp.number_tickets < 1
              ? {
                  competitions,
                }
              : {
                  competitions: competitions.map((c) =>
                    c.compID === comp.compID ? { ...c, ...comp } : c
                  ),
                }
          ),
        reset: () => set({ competitions: [] }),
      }),
      {
        name: "cart-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
