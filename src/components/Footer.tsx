import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("home");
  const t_footer = useTranslations("footeritems");
  const [windowLocation, setLocation] = useState("");
  const [size, setSize] = useState("45px");
  const router = useRouter();
  const Tabs = [
    [
      {
        name: t_footer("comp"),
        link: "/#theComp",
      },
      {
        name: t_footer("howto"),
        link: "/#Howtoplay",
      },
      {
        name: t_footer("contact"),
        mail: "mailto:info@winuwatch.uk",
      },
    ],
    [
      {
        name: t_footer("phil"),
        link: "/Philosophy",
      },
      {
        name: t_footer("trustpilot"),
        link: "/#trustpilot",
      },
      {
        name: t_footer("charity"),
        link: "/Charity",
      },
    ],
    [
      {
        name: t_footer("acceptableuse"),
        link: "/Acceptable_Use_Policy",
      },
      {
        name: t_footer("faq"),
        link: "/FAQ",
      },
    ],
    [
      {
        name: t_footer("returnpolicy"),
        link: "/Return_Policy",
      },
      {
        name: t_footer("terms"),
        link: "/TermsAndConditions",
      },
      {
        name: t_footer("privacypolicy"),
        link: "/Privacy_Policy",
      },
    ],
  ];
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background5 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "-124px" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    typeof window !== "undefined" && setLocation(window.location.pathname);
    typeof window !== "undefined" && window.location.pathname === "/ja"
      ? setSize("25px")
      : typeof window !== "undefined" &&
        window.location.pathname === "/ja/Philosophy"
      ? setSize("25px")
      : setSize("45px");
  }, [
    windowLocation,
    typeof window !== "undefined" && window.location.pathname,
  ]);

  return (
    <>
      <div
        style={{
          background:
            typeof window !== "undefined" &&
            (windowLocation === "/es/AboutUs" ||
              windowLocation === "/fr/AboutUs" ||
              windowLocation === "/il/AboutUs" ||
              windowLocation === "/ja/AboutUs" ||
              windowLocation === "/es/Philosophy" ||
              windowLocation === "/fr/Philosophy" ||
              windowLocation === "/il/Philosophy" ||
              windowLocation === "/ja/Philosophy")
              ? "#a8957e"
              : typeof window !== "undefined" &&
                windowLocation === "/Philosophy"
              ? "#a8957e"
              : typeof window !== "undefined" && windowLocation === "/AboutUs"
              ? "#a8957e"
              : "#cbb9ac",
        }}
        className={styles.FooterInsta}
      >
        <h1
          style={{
            fontSize: size,
          }}
          className={styles.background5}
        >
          {t("followus")}
        </h1>
        <p>{t("followusdesc")}</p>
        <Link href="https://www.instagram.com/winuwatch/">
          <Image
            width={250}
            height={52}
            alt="instaFollow"
            src="/images/InstaFooter.svg"
          />
        </Link>
      </div>
      <div className={styles.Footer}>
        <div className={styles.FooterTop}>
          <Image
            className={styles.footerLogo}
            width={144}
            height={76}
            src="/images/newLogo.png"
            alt="logo"
          />

          <div className={styles.menusGrid}>
            {Tabs.map((menu, i) => (
              <div
                style={{
                  marginRight: i === 2 ? "30px" : "initial",
                  width: i === 3 ? "fit-content" : "130px",
                }}
                className={styles.menusGridItem}
                key={i}
              >
                {menu.map(({ name, link, mail }, j) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      width:
                        link === "/Acceptable_Use_Policy"
                          ? "79%"
                          : link === "/FAQ"
                          ? "100%"
                          : "initial",
                    }}
                    key={i + j}
                  >
                    {mail ? (
                      <a href={mail}>{name}</a>
                    ) : (
                      link && (
                        <Link
                          style={{
                            width:
                              link === "/FAQ" && router.locale === "il"
                                ? "79%"
                                : "fit-content",
                          }}
                          href={link}
                        >
                          <span>{name}</span>
                        </Link>
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.FooterTopRight}>
            <div
              style={{
                flexDirection: router.locale === "il" ? "row-reverse" : "row",
              }}
              className={styles.emails}
            >
              <p
                style={{
                  width: "59.7%",
                }}
              >
                {t("enquiries")}
              </p>
              <a href="mailto:info@winuwatch.uk">
                <u>info@winuwatch.uk</u>
              </a>
            </div>
            <div className={styles.payment}>
              <p>{t("securepay")}</p>
              <div className={styles.paymentIcons}>
                <div className={styles.visa}>visa</div>
                <div className={styles.visaicons}>
                  <Image
                    width={14}
                    height={14}
                    src="/images/visacircdark.png"
                    alt="visarecdark"
                  />
                  <Image
                    width={14}
                    height={14}
                    src="/images/viacirclight.png"
                    alt="visareclight"
                    style={{ marginLeft: "-3px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.FooterBot}>
          <h3>Win U Watch © 2023</h3>
          <p>
            Lisam Watch Ltd is registered at 63-66 Hatton Gardens, London, EC1N
            8LE, UK
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
