import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import useStore from "./Store";
import { useRouter } from "next/router";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const bears = useStore((state) => state.bears);
  const [number, setNumber] = useState();
  useEffect(() => {
    setNumber(typeof window !== "undefined" ? bears : 0);
  }, [bears]);
  let howTo =
    typeof window !== "undefined" && document.getElementById("Howtoplay");
  let theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  return (
    <div
      onClick={() => open && setOpen(false)}
      className={styles.NavBarContainer}
    >
      <div className={styles.flexStart}>
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
          }}
          onClick={() => setOpen(!open)}
          className={styles.burger}
          alt="menu"
          src="/images/burgerMenu.svg"
        />
        <Drawer className={styles.Drawer} anchor="left" open={open}>
          <div className={styles.DrawerCon}>
            <Link
              className={styles.DrawerMenu}
              style={{
                fontSize: "20px",
                fontWeight: "500",
              }}
              href="/"
            >
              Menu
            </Link>
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
      <Image className={styles.Logo} alt="logo" src="/images/logo.png" />
      <div className={styles.flexEnd}>
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
          cart ({number})
        </span>
        <Image alt="global" src="/images/global.png" />
      </div>
    </div>
  );
}
