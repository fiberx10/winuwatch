import React, { useEffect, useState } from "react";
import styles from "@/styles/Checkout.module.css";

import Image from "next/image";
import { BackendLink, PaypalID } from "./Backend";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";

const CheckoutComp = () => {
  const router = useRouter();
  const total = [];
  const minAge = "2005-01-01";
  const [items, setItems] = useState();
  const [itemsForFetch, setItemsForFetch] = useState();
  const [checkData, setCheckData] = useState();
  const [Total, setTotal] = useState("");

  const [formData, setFormData] = useState({
    items: items,
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    town: "",
    zip: "",
    phone: "",
    email: "",
    date: "",
    payMeth: "paypal",
    checkedEmail: false,
    checkedSMS: false,
  });
  useEffect(() => {
    setTotal(String(total.reduce((a, b) => a + b, 0)));
  }, [total]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      var a = localStorage.getItem("cartItems");
      var b = JSON.parse(localStorage.getItem("cartItems"));

      setItems(a);
      setItemsForFetch(b ? b : []);
      setFormData((prevState) => ({ ...prevState, items: b }));
    }
  }, []);
  useEffect(() => {
    const arr = [];
    const fetchItems = async () => {
      itemsForFetch &&
        itemsForFetch.map((ite) => {
          fetch(`${BackendLink}/details/${ite.compID}`)
            .then((res) => res.json())
            .then((data) => arr.push(data))
            .then(() => setCheckData([...arr]));
        });
    };
    fetchItems();
  }, [itemsForFetch]);

  function decreCart(item) {
    if (typeof window !== "undefined") {
      var check = itemsForFetch.filter((it) => {
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
        itemsForFetch.map((u) => u.compID === change.compID)[0] === true ||
        itemsForFetch.map((u) => u.compID === change.compID)[1] === true
      ) {
        const newa = itemsForFetch.map((u) =>
          u.compID !== change.compID ? u : change
        );
        localStorage.setItem("cartItems", JSON.stringify(newa));
        var a = JSON.parse(localStorage.getItem("cartItems"));
        var b = localStorage.getItem("cartItems");

        setItems(b);
        setItemsForFetch(a);
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
      var check = itemsForFetch.filter((it) => {
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
        itemsForFetch.map((u) => u.compID === change.compID)[0] === true ||
        itemsForFetch.map((u) => u.compID === change.compID)[1] === true
      ) {
        const newa = itemsForFetch.map((u) =>
          u.compID !== change.compID ? u : change
        );
        localStorage.setItem("cartItems", JSON.stringify(newa));
        var a = JSON.parse(localStorage.getItem("cartItems"));
        var b = localStorage.getItem("cartItems");

        setItems(b);
        setItemsForFetch(a);
      }
      //   } else {
      //     a.push(items);
      //   }

      //   // Alert the array value
      //   // Re-serialize the array back into a string and store it in localStorage
    }
  }

  function handleSubmit(e) {
    formData.date <= minAge
      ? console.log(formData)
      : console.log("Age must be 18 or more.");
    e.preventDefault();
  }
  function handleDate(e) {
    setFormData((prevState) => ({ ...prevState, date: e.target.value }));
  }

  return (
    <div className={styles.CheckoutMain}>
      {items !== undefined && (
        <div className={styles.formMain}>
          <form onSubmit={handleSubmit}>
            <div className={styles.CheckoutLeft}>
              <div className={styles.leftFormItem}>
                <h1>Billing Information</h1>
                <div className={styles.CheckoutForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            firstName: e.target.value,
                          }))
                        }
                        id="firstName"
                        type={"text"}
                        name="firstName"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            lastName: e.target.value,
                          }))
                        }
                        id="lastName"
                        type={"text"}
                        name="lastName"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Country">Country/Region</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            country: e.target.value,
                          }))
                        }
                        id="Country"
                        type={"text"}
                        name="Country"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Address</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            address: e.target.value,
                          }))
                        }
                        id="Address"
                        type={"text"}
                        name="Address"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Town">Town/City</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            town: e.target.value,
                          }))
                        }
                        id="Town"
                        type={"text"}
                        name="Town"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">ZIP</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            zip: e.target.value,
                          }))
                        }
                        id="Zip"
                        name="Zip"
                        type={"number"}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Phone">Phone</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            phone: e.target.value,
                          }))
                        }
                        id="Phone"
                        type={"number"}
                        name="Phone"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="Email">Email</label>
                      <input
                        required
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            email: e.target.value,
                          }))
                        }
                        id="Email"
                        name="Email"
                        type="Email"
                      />
                    </div>
                  </div>
                  <div className={styles.FinalRow}>
                    <div className={styles.formField}>
                      <label htmlFor="Date">Date of birth</label>
                      <input
                        required
                        onChange={(e) => handleDate(e)}
                        id="Date"
                        name="Date"
                        type={"date"}
                      />
                      <p
                        style={{
                          color: "red",
                          display: formData.date <= minAge ? "none" : "flex",
                        }}
                      >
                        Age must be higher than 18years
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.leftFormItem}>
                <h1>Payment Method</h1>
                <div className={styles.PaymentMethod}>
                  <div className={styles.method}>
                    <input
                      type="radio"
                      name="payment"
                      value="Paypal"
                      defaultChecked
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          payMeth: e.target.value,
                        }))
                      }
                    />
                    <p
                      style={{
                        color:
                          formData.payMeth === "Paypal"
                            ? "#987358"
                            : "rgba(30, 30, 30, 0.6)",
                      }}
                    >
                      PayPal
                    </p>
                  </div>
                  <div className={styles.method}>
                    <input
                      type="radio"
                      name="payment"
                      value="Stripe"
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          payMeth: e.target.value,
                        }))
                      }
                    />
                    <p
                      style={{
                        color:
                          formData.payMeth === "Stripe"
                            ? "#987358"
                            : "rgba(30, 30, 30, 0.6)",
                      }}
                    >
                      Stripe
                    </p>
                  </div>
                </div>
                <div className={styles.SignMeUp}>
                  <label>
                    <input
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          checkedEmail: !formData.checkedEmail,
                        }))
                      }
                      type="checkbox"
                    />
                    <p>Sign me up to recieve email updates and news</p>
                  </label>
                  <label>
                    <input
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          checkedSMS: !formData.checkedSMS,
                        }))
                      }
                      type="checkbox"
                    />
                    <p>Sign me up to recieve SMS updates and news</p>
                  </label>
                </div>
                <p className={styles.paymDesc}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution It is a long established fact that a
                  reader will be distracted by the readable content of a page
                  when looking at its layout. The point of using Lorem Ipsum is
                  that it has a more-or-less normal distribution
                </p>
              </div>
            </div>
            <div className={styles.CheckoutRight}>
              <h1> Order Summary</h1>
              <div className={styles.RightCon}>
                <div className={styles.OrdersFlex}>
                  {checkData &&
                    checkData.map((order, i) => {
                      itemsForFetch &&
                        itemsForFetch.map((ite) => {
                          return (
                            ite.compID === order.id &&
                            total.push(
                              ite.number_tickets * Number(order.ticket_price)
                            )
                          );
                        });
                      return (
                        <div className={styles.orderItem} key={i}>
                          <Image
                            width={106}
                            height={105}
                            className={styles.orderImg}
                            src="/images/tester.png"
                            alt="watching"
                          />
                          <div className={styles.orderTit}>
                            <h3>{order.Watch.name}</h3>
                            <span>
                              $
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    ite.number_tickets *
                                      Number(order.ticket_price)
                                  );
                                })}
                              .00
                            </span>
                            <h3>
                              Remaining Tickets:{" "}
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    order.remaining_tickets - ite.number_tickets
                                  );
                                })}
                            </h3>
                          </div>
                          <div className={styles.Counter}>
                            <div
                              onClick={() => decreCart(order)}
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
                              {itemsForFetch &&
                                itemsForFetch.map((ite) => {
                                  return (
                                    ite.compID === order.id &&
                                    ite.number_tickets
                                  );
                                })}
                            </div>
                            <div
                              // onClick={() =>
                              //   counter < item.remaining_tickets &&
                              //   setCounter(counter + 1)
                              // }
                              onClick={() => increCart(order)}
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
                        </div>
                      );
                    })}
                </div>
                <div className={styles.orderSumBot}>
                  <div className={styles.orderSum}>
                    <h2>Sub Total</h2>
                    <span>${total.reduce((a, b) => a + b, 0)}.00</span>
                  </div>
                  <div className={styles.orderSum}>
                    <h3>Total</h3>
                    <span>${total.reduce((a, b) => a + b, 0)}.00</span>
                  </div>
                  {formData.payMeth === "paypal" ? (
                    <PayPalScriptProvider
                      options={{
                        "client-id": `${PaypalID}`,
                      }}
                    >
                      <PayPalButtons
                        forceReRender={[Total]}
                        createOrder={(data, actions) => {
                          return actions.order
                            .create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: Total,
                                  },
                                },
                              ],
                            })
                            .then((orderId) => {
                              // Your code here after create the order
                              return orderId;
                            });
                        }}
                        onApprove={function (data, actions) {
                          return actions.order
                            .capture()
                            .then(function (details) {
                              details.status === "COMPLETED" &&
                                router.push(`/CheckoutPage/${details.id}`);
                              // Your code here after capture the order
                              alert(
                                // "data.orderID:" +
                                //   data.orderID +
                                //   "  " +
                                //   "data.billingToken:" +
                                //   data.billingToken +
                                //   "  " +
                                //   "data.paymentID:" +
                                //   data.paymentID +
                                details.id
                                // "  " +
                                // "data.payerID:" +
                                // data.payerID +
                                // "  " +
                                // "details.payer.name:" +
                                // details.payer.name.given_name +
                                // "  " +
                                // "details.status:" +
                                // details.status
                              );
                            });
                        }}
                        style={{ layout: "horizontal" }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <button type="submit">Confirm Order</button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutComp;
