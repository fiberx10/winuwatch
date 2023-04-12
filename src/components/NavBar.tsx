/* eslint-disable  @typescript-eslint/no-misused-promises */
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Drawer, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useCart } from "./Store";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import { useTranslations } from "next-intl";

export default function NavBar() {
  const t = useTranslations("navitems");
  const [open, setOpen] = useState(false);
  const [navColor, setNavColor] = useState("");
  const router = useRouter();
  const { cardDetails } = useCart();

  const [anchorLanguageEl, setAnchorLanguageEl] = useState<null | HTMLElement>(
    null
  );

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
          onClick={async () =>
            typeof window !== "undefined" && location.pathname !== "/"
              ? await router.push("/")
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
          {t("comp")}
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
          {t("howto")}
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
            <MdClose className={styles.closeBut} />
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
              {t("comp")}
            </span>
            <span onClick={() => router.push("/Philosophy")}>{t("phil")}</span>
            <span onClick={() => router.push("/Charity")}>{t("charity")}</span>
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
              {t("howto")}
            </span>
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
          {t("phil")}
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
          {t("charity")}
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
