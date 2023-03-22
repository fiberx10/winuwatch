/* eslint-disable @typescript-eslint/ban-ts-comment */
import { create } from "zustand";
const a = JSON.parse(
  // @ts-ignore
  typeof window !== "undefined" && localStorage.getItem("cartItems")
);
const useStore = create((set) => ({
  bears: a !== null ? a.length : 0,
  orderData: null,
  // @ts-ignore
  increasePopulation: (params) => set((state) => ({ bears: params })),
  // @ts-ignore
  FillData: (params) => set((state) => ({ orderData: params })),
}));
export default useStore;
