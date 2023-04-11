import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [navColor, setNavColor] = useState("white");
  const router = useRouter();
  const { cardDetails } = useCart();

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
        <Link
          style={{ color: navColor }}
          href={"/#theComp"}
          className={styles.mobile}
        >
          The competition
        </Link>
        <Link
          style={{ color: navColor }}
          className={styles.mobile}
          href={"/#Howtoplay"}
        >
          How to play
        </Link>
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
            <MdClose className={styles.closeBut} />
            <Link href={"/#theComp"}>The competition</Link>
            <Link href={"/Philosophy"}>philosophy</Link>
            <Link href={"/Charity"}>Charity</Link>
            <Link href={"/#Howtoplay"}>How to play</Link>
          </div>
        </Drawer>
      </div>

      <Image
        width={200}
        height={105.42}
        className={styles.Logo}
        onClick={() => router.push("/")}
        alt="logo"
        style={{
          cursor: "pointer",
          filter: navColor === "white" ? "brightness(0) invert(1)" : "",
          marginBottom: "-20px",
        }}
        src={`/images/logo.png`}
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
