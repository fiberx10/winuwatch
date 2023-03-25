import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [navColor, setNavColor] = useState("");
  const router = useRouter();
  const { cardDetails } = useCart();

  const howTo =
    typeof window !== "undefined" && document.getElementById("Howtoplay");
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  useEffect(() => {
    typeof window !== "undefined" && location.pathname !== "/"
      ? setNavColor("#927C66")
      : setNavColor("white");
  }, []);
  return (
    <div
      onClick={() => open && setOpen(false)}
      className={styles.NavBarContainer}
      style={{
        color: navColor,
      }}
    >
      <div
        style={{
          borderBottom: `1px solid ${navColor}`,
        }}
        className={styles.flexStart}
      >
        <span
          onClick={() =>
            typeof window !== "undefined" && location.pathname !== "/"
              ? router.push("/")
              : window.scrollTo({
                  top:
                    theComp !== null && theComp instanceof HTMLElement
                      ? theComp.offsetTop
                      : 400,
                  behavior: "smooth",
                })
          }
          className={styles.mobile}
        >
          The competition
        </span>
        <span
          className={styles.mobile}
          onClick={() =>
            typeof window !== "undefined" && location.pathname !== "/"
              ? router.push("/")
              : window.scrollTo({
                  top:
                    howTo !== null && howTo instanceof HTMLElement
                      ? howTo.offsetTop
                      : 400,
                  behavior: "smooth",
                })
          }
        >
          How to play
        </span>
        <Image
          style={{
            cursor: "pointer",
            filter: navColor === "white" ? "brightness(0) invert(1)" : "",
          }}
          onClick={() => setOpen(!open)}
          className={styles.burger}
          alt="menu"
          width={38}
          height={7}
          src="/images/burgerMenu.svg"
        />
        <Drawer className={styles.Drawer} anchor="left" open={open}>
          <div className={styles.DrawerCon}>
            <span
              className={styles.DrawerMenu}
              style={{
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              Menu
            </span>
            <hr />
            <span onClick={() => router.push("/")}>Home</span>
            <span
              onClick={() =>
                typeof window !== "undefined" && location.pathname !== "/"
                  ? router.push("/")
                  : window.scrollTo({
                      top:
                        theComp !== null && theComp instanceof HTMLElement
                          ? theComp.offsetTop
                          : 400,
                      behavior: "smooth",
                    })
              }
            >
              The competition
            </span>
            <span
              onClick={() =>
                typeof window !== "undefined" && location.pathname !== "/"
                  ? router.push("/")
                  : window.scrollTo({
                      top:
                        howTo !== null && howTo instanceof HTMLElement
                          ? howTo.offsetTop
                          : 400,
                      behavior: "smooth",
                    })
              }
            >
              How to play
            </span>
            <hr />

            <span onClick={() => router.push("/Philosophy")}>philosophy</span>
            <span onClick={() => router.push("/Charity")}>Charity</span>
          </div>
        </Drawer>
      </div>

      <Image
        width={200}
        height={105.42}
        className={styles.Logo}
        alt="logo"
        src={`/images/${navColor === "white" ? "newLogo.png" : "logo.png"}`}
      />

      <div
        style={{
          borderBottom: `1px solid ${navColor}`,
        }}
        className={styles.flexEnd}
      >
        <span
          style={{
            fontWeight:
              typeof window !== "undefined" &&
              window.location.pathname === "/Philosophy"
                ? "600"
                : "initial",
          }}
          className={styles.mobile}
          onClick={() => router.push("/Philosophy")}
        >
          philosophy
        </span>
        <span
          style={{
            fontWeight:
              typeof window !== "undefined" &&
              window.location.pathname === "/Charity"
                ? "600"
                : "initial",
          }}
          className={styles.mobile}
          onClick={() => router.push("/Charity")}
        >
          Charity
        </span>
        <span
          style={{
            fontWeight:
              typeof window !== "undefined" &&
              window.location.pathname === "/Cart"
                ? "600"
                : "initial",
          }}
          onClick={() => router.push("/Cart")}
        >
          {`Cart (${cardDetails().Number_of_item})`}
        </span>

        <Image
          width={15}
          style={{
            filter: navColor === "white" ? "brightness(0) invert(1)" : "",
          }}
          height={15}
          alt="global"
          src="/images/global.png"
        />
      </div>
    </div>
  );
}
