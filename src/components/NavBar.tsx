/* eslint-disable  @typescript-eslint/no-misused-promises */
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Drawer, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavBar() {
  const t = useTranslations("navitems");
  const [open, setOpen] = useState(false);
  const [navColor, setNavColor] = useState("");
  const router = useRouter();
  const { cardDetails } = useCart();

  const [anchorLanguageEl, setAnchorLanguageEl] = useState<null | HTMLElement>(
    null
  );
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (location.pathname === "/es" ||
        location.pathname === "/fr" ||
        location.pathname === "/iw" ||
        location.pathname === "/ja")
    ) {
      setNavColor("white");
    } else if (typeof window !== "undefined" && location.pathname !== "/") {
      setNavColor("#927C66");
    } else {
      setNavColor("white");
    }
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
          {t("comp")}
        </Link>
        <Link
          style={{ color: navColor }}
          className={styles.mobile}
          href={"/#Howtoplay"}
        >
          {t("howto")}
        </Link>
        <svg
          width="38"
          height="8"
          viewBox="0 0 38 9"
          fill="none"
          style={{
            cursor: "pointer",
            filter: navColor === "white" ? "brightness(0) invert(1)" : "",
          }}
          onClick={() => setOpen(!open)}
          className={styles.burger}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="8" x2="38" y2="8" stroke="#987358" strokeWidth="2" />
          <line y1="1" x2="38" y2="1" stroke="#987358" strokeWidth="2" />
        </svg>

        <Drawer className={styles.Drawer} anchor="left" open={open}>
          <div className={styles.DrawerCon}>
            <MdClose className={styles.closeBut} />
            <Link href={"/#theComp"}>{t("comp")}</Link>
            <Link href={"/#Howtoplay"}>{t("howto")}</Link>
            <Link href={"/Philosophy"}>{t("phil")}</Link>
            <Link href={"/Charity"}>{t("charity")}</Link>
          </div>
        </Drawer>
      </div>

      <Image
        width={200}
        height={105.42}
        className={styles.Logo}
        onClick={() => router.push("/")}
        priority
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
        <Link
          className={styles.mobile}
          style={{ color: navColor }}
          href={"/Philosophy"}
        >
          {t("phil")}
        </Link>
        <Link
          className={styles.mobile}
          style={{ color: navColor }}
          href={"/Charity"}
        >
          {t("charity")}
        </Link>
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
          {`${t("cart")} (${cardDetails().Number_of_item})`}
        </span>

        <div>
          <Image
            width={15}
            onClick={(e) => {
              setAnchorLanguageEl(e.currentTarget);
            }}
            style={{
              filter: navColor === "white" ? "brightness(0) invert(1)" : "",
            }}
            height={15}
            alt="global"
            src="/images/global.png"
          />

          <Menu
            id="basic-menu"
            anchorEl={anchorLanguageEl}
            open={anchorLanguageEl !== null}
            onClose={() => setAnchorLanguageEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {[
              {
                name: "🇬🇧\tEnglish",
                locale: "en",
              },
              {
                name: "🇪🇸\tEspañol",
                locale: "es",
              },
              {
                name: "🇫🇷\tFrançais",
                locale: "fr",
              },
              {
                //japenese
                name: "🇯🇵\t日本語",
                locale: "ja",
              },
              {
                name: "🇮🇱\tעברית",
                locale: "iw",
              },
            ]
              .filter(({ locale }) => locale !== router.locale)
              .map(({ locale, name }, index) => (
                <MenuItem
                  onClick={async () => {
                    //console.log("new local :" + code);
                    setAnchorLanguageEl(null);
                    const { pathname, asPath, query, push } = router;
                    return await push({ pathname, query }, asPath, {
                      locale,
                    });
                  }}
                  key={index}
                >
                  {name}
                </MenuItem>
              ))}
          </Menu>
        </div>
      </div>
    </div>
  );
}
