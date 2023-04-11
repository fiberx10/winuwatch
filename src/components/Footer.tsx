import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";


const Footer = () => {
  const t = useTranslations("home");
  const [windowLocation, setLocation] = useState("");
  const data = [
    { names: ["COMPETITIONS", "how to play", "contact"] },
    { names: ["PHILOSOPHY", "trustpilot", "Charity"] },
    { names: ["Acceptable Use Policy", "faq"] },
    { names: ["Return Policy", "terms & conditions", "Privacy Policy"] },
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
  const router = useRouter();

  const howTo =
    typeof window !== "undefined" && document.getElementById("Howtoplay");
  const theComp =
    typeof window !== "undefined" && document.getElementById("theComp");
  const trustpilot =
    typeof window !== "undefined" && document.getElementById("trustpilot");
  useEffect(() => {
    typeof window !== "undefined" && setLocation(window.location.pathname);
  }, [windowLocation]);

  return (
    <>
      <div
        style={{
          background:
            typeof window !== "undefined" && location.pathname !== "/Philosophy"
              ? "#cbb9ac"
              : "#a8957e",
        }}
        className={styles.FooterInsta}
      >
        <h1 className={styles.background5}>{
          t("followus")
        }</h1>
        <p>
          {
            t("followusdesc")
          }
        </p>
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
            {data.map((menu, i) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                  key={i}
                >
                  <span
                    onClick={
                      windowLocation !== "/" && menu.names[0] === "COMPETITIONS"
                        ? async () => {
                            await router.push("/#theComp");
                          }
                        : menu.names[0] === "PHILOSOPHY"
                        ? async () => {
                            await router.push("/Philosophy");
                          }
                        : menu.names[0] === "Acceptable Use Policy"
                        ? async () => {
                            await router.push("/Acceptable_Use_Policy");
                          }
                        : menu.names[0] === "Return Policy"
                        ? async () => {
                            await router.push("/Return_Policy");
                          }
                        : () => {
                            window.scrollTo({
                              top:
                                theComp !== null &&
                                theComp instanceof HTMLElement
                                  ? theComp.offsetTop
                                  : 400,
                              behavior: "smooth",
                            });
                          }
                    }
                  >
                    {menu.names[0]}
                  </span>
                  <span
                    onClick={
                      windowLocation !== "/" && menu.names[1] === "how to play"
                        ? async () => {
                            await router.push("/#Howtoplay");
                          }
                        : windowLocation !== "/" &&
                          menu.names[1] === "trustpilot"
                        ? async () => {
                            await router.push("/#trustpilot");
                          }
                        : menu.names[1] === "faq"
                        ? async () => {
                            await router.push("/FAQ");
                          }
                        : menu.names[1] === "terms & conditions"
                        ? async () => {
                            await router.push("/TermsAndConditions");
                          }
                        : menu.names[1] === "trustpilot"
                        ? () => {
                            window.scrollTo({
                              top:
                                trustpilot !== null &&
                                trustpilot instanceof HTMLElement
                                  ? trustpilot.offsetTop
                                  : 400,
                              behavior: "smooth",
                            });
                          }
                        : () => {
                            window.scrollTo({
                              top:
                                howTo !== null && howTo instanceof HTMLElement
                                  ? howTo.offsetTop
                                  : 400,
                              behavior: "smooth",
                            });
                          }
                    }
                  >
                    {menu.names[1]}
                  </span>
                  <Link
                    href={
                      menu.names[2] === "Charity"
                        ? "/Charity"
                        : menu.names[2] === "Privacy Policy"
                        ? "/Privacy_Policy"
                        : menu.names[2] === "contact"
                        ? "mailto:info@winuwatch.uk"
                        : ""
                    }
                  >
                    {menu.names[2]}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className={styles.FooterTopRight}>
            <div className={styles.emails}>
              <p>{
                t("enquiries")
                }</p>
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
