import React, { useEffect, useState } from "react";
import styles from "@/styles/Cart.module.css";
import Image from "next/image";
import useStore, { Formater } from "./Store";
import { useRouter } from "next/router";
import { BackendLink } from "./Backend";
import { api } from "@/utils/api";
import Link from "next/link";
const CartComp = () => {
  const { cardDetails, order, addComp, updateComp, removeComp } = useStore();
  const {
    data: items,
    isLoading,
    error,
  } = api.Competition.getAll.useQuery({
    ids: order?.comps.map((comp) => comp.compID) || [],
  });
  const router = useRouter();
  const { totalCost, Number_of_item } = cardDetails();
  //TODO: Loading
  if (isLoading) return <p>loading ...</p>;
  return (
    <div className={styles.CartMain}>
      {order?.comps && order.comps.length > 0 ? (
        order.comps.map((comp, index) => {
          const ComptetionData = items?.find((item) => item.id === comp.compID);
          if (!ComptetionData) return null;
          return (
            <div className={styles.Watch} key={index}>
              <div className={styles.watchLeft}>
                <Image
                  width={196}
                  height={195}
                  alt="watchImage"
                  src={
                    ComptetionData.Watches.imageURL[0] || "/images/watch1.jpeg"
                  }
                />
                <div className={styles.watchleftDesc}>
                  <h1>{ComptetionData.Watches.name}</h1>
                  <h4>{ComptetionData.Watches.bracelet_material}</h4>
                  <p>{ComptetionData.Watches.owner_ref}</p>
                </div>
              </div>
              <div className={styles.CartRight}>
                <div className={styles.Counter}>
                  <div
                    onClick={() =>
                      updateComp({
                        compID: comp.compID,
                        number_tickets: comp.number_tickets - 1,
                        price_per_ticket: ComptetionData.price,
                      })
                    }
                    className={styles.CounterSelec}
                  >
                    <Image
                      width={13}
                      height={1}
                      src="/images/Minus.png"
                      alt="minus"
                    />
                  </div>
                  <div className={styles.counterValue}>
                    {comp.number_tickets}
                  </div>
                  <div
                    onClick={() =>
                      updateComp({
                        compID: comp.compID,
                        number_tickets: comp.number_tickets + 1,
                        price_per_ticket: ComptetionData.price,
                      })
                    }
                    className={styles.CounterSelec}
                  >
                    <Image
                      width={11}
                      height={11}
                      src="/images/plus.png"
                      alt="plus"
                    />
                  </div>
                </div>
                <div className={styles.CartPriceCon}>
                  <h2>
                    {Formater(comp.number_tickets * comp.price_per_ticket)}
                  </h2>
                  <p onClick={() => removeComp(comp.compID)}>REMOVE</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <h1>No Items in the Cart</h1>
      )}
      <div className={styles.CartSubTotal}>
        <p>Sub Total</p>
        <span>{Formater(totalCost)}</span>
      </div>
      <div className={styles.CartTotal}>
        <p>{`Total + (20%) VAT`}</p>
        <span>{Formater(totalCost * 1.02)}</span>
      </div>
      <div className={styles.cartCheckoutCon}>
        <Link href="/CheckoutPage">
          <button>Check Out</button>
        </Link>
      </div>
    </div>
  );
};

export default CartComp;
