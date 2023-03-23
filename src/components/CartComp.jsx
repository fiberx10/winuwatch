import React, { useEffect, useState } from "react";
import styles from "@/styles/Cart.module.css";
import Image from "next/image";
import useStore from "./Store";
import { useRouter } from "next/router";
import { BackendLink } from "./Backend";
const CartComp = () => {
  const [checkData, setCheckData] = useState();
  const [items, setItems] = useState();
  const [Total, setTotal] = useState();
  const router = useRouter();
  const increasePopulation = useStore((state) => state.increasePopulation);
  const FillData = useStore((state) => state.FillData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var a = JSON.parse(localStorage.getItem("cartItems"));

      setItems(a ? a : []);
    }
  }, []);

  useEffect(() => {
    const arr = [];
    const fetchItems = async () => {
      items &&
        items.map((ite) => {
          fetch(`${BackendLink}/details/${ite.compID}`)
            .then((res) => res.json())
            .then((data) => arr.push(data))
            .then(() => setCheckData([...arr]));
        });
    };
    fetchItems();
  }, [items]);

  function decreCart(item) {
    if (typeof window !== "undefined") {
      var check = items.filter((it) => {
        return item.id === it.compID && it.number_tickets;
      });
      var change = {
        compID: item.id,
        number_tickets:
          check[0].number_tickets > 1
            ? check[0].number_tickets - 1
            : check[0].number_tickets,
      };
      if (
        items.map((u) => u.compID === change.compID)[0] === true ||
        items.map((u) => u.compID === change.compID)[1] === true
      ) {
        const newa = items.map((u) =>
          u.compID !== change.compID ? u : change
        );
        localStorage.setItem("cartItems", JSON.stringify(newa));
        var a = JSON.parse(localStorage.getItem("cartItems"));

        setItems(a);
      }
      //   } else {
      //     a.push(items);
      //   }

      //   // Alert the array value
      //   // Re-serialize the array back into a string and store it in localStorage
    }
  }
  function increCart(item) {
    if (typeof window !== "undefined") {
      var check = items.filter((it) => {
        return item.id === it.compID && it.number_tickets;
      });
      var change = {
        compID: item.id,
        number_tickets:
          check[0].number_tickets < item.remaining_tickets
            ? check[0].number_tickets + 1
            : check[0].number_tickets,
      };
      if (
        items.map((u) => u.compID === change.compID)[0] === true ||
        items.map((u) => u.compID === change.compID)[1] === true
      ) {
        const newa = items.map((u) =>
          u.compID !== change.compID ? u : change
        );
        localStorage.setItem("cartItems", JSON.stringify(newa));
        var a = JSON.parse(localStorage.getItem("cartItems"));

        setItems(a);
      }
      //   } else {
      //     a.push(items);
      //   }

      //   // Alert the array value
      //   // Re-serialize the array back into a string and store it in localStorage
    }
  }

  function handleRemove(item) {
    var check = items.filter((it) => {
      return item.id !== it.compID;
    });
    localStorage.setItem("cartItems", JSON.stringify(check));
    increasePopulation(check.length);
    var a = JSON.parse(localStorage.getItem("cartItems"));

    setItems(a !== null ? a : []);
  }
  let total = [];
  function handlePush() {
    router.push({
      pathname: "/CheckoutPage",
    });
  }

  return (
    <div className={styles.CartMain}>
      {checkData && items.length > 0 ? (
        checkData.map((item, i) => {
          items &&
            items.map((ite) => {
              return (
                ite.compID === item.id &&
                total.push(ite.number_tickets * Number(item.ticket_price))
              );
            });

          return (
            <div className={styles.Watch} key={i}>
              <div className={styles.watchLeft}>
                <Image alt="watchImage" src="/images/tester.png" />
                <div className={styles.watchleftDesc}>
                  <h1>{item.Watch.name}</h1>
                  <h4>{item.Watch.bracelet_material}</h4>
                  <p>{item.Watch.owner_ref}</p>
                </div>
              </div>
              <div className={styles.CartRight}>
                <div className={styles.Counter}>
                  <div
                    onClick={() => decreCart(item)}
                    className={styles.CounterSelec}
                  >
                    <Image src="/images/Minus.png" alt="minus" />
                  </div>
                  <div className={styles.counterValue}>
                    {items &&
                      items.map((ite) => {
                        return ite.compID === item.id && ite.number_tickets;
                      })}
                  </div>
                  <div
                    // onClick={() =>
                    //   counter < item.remaining_tickets &&
                    //   setCounter(counter + 1)
                    // }
                    onClick={() => increCart(item)}
                    className={styles.CounterSelec}
                  >
                    <Image src="/images/plus.png" alt="plus" />
                  </div>
                </div>
                <div className={styles.CartPriceCon}>
                  <h2>
                    $
                    {items &&
                      items.map((ite) => {
                        return (
                          ite.compID === item.id &&
                          ite.number_tickets * Number(item.ticket_price)
                        );
                      })}
                    .00
                  </h2>
                  <p onClick={() => handleRemove(item)}>REMOVE</p>
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
        <span>${total.reduce((a, b) => a + b, 0)}.00</span>
      </div>
      <div className={styles.CartTotal}>
        <p>Total</p>
        <span>${total.reduce((a, b) => a + b, 0)}.00</span>
      </div>
      <div onClick={handlePush} className={styles.cartCheckoutCon}>
        <button>Check Out</button>
      </div>
    </div>
  );
};

export default CartComp;
