import styles from "@/styles/Charity.module.css";
import Image from "next/image";
import { Formater } from "@/utils";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

const Charit = () => {
  const t = useTranslations("charity");
  const { locale } = useRouter();
  const data = [
    {
      img: "/images/woodland.png",
      name: "Woodland trust UK",
      amount: 2346,
      desc: t("woodland"),
    },
    // {
    //   img: "/images/cancerRes.png",
    //   name: "Cancer research uk",
    //   amount: 2346,
    //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    // },
  ];
  return (
    <div className={styles.CharityMain}>
      <div className={styles.CharityHeader}>
        <div className={styles.CharityH1}>
          <h1>{t("charityheader")}</h1>
        </div>
        <h3> {Formater(594828, locale)}</h3>
      </div>
      <div className={styles.CharityGrid}>
        {data.map((charity, i) => (
          <div className={styles.charity} key={i}>
            <div className={styles.charityTop}>
              <Image
                width={300}
                height={300}
                alt="charity"
                src={charity.img}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.CharityBot}>
              <div>
                <h4>{t("donation")}</h4>
                <p className={styles.amount}>${charity.amount}</p>
              </div>
              <h3>{charity.name}</h3>
              <p>{charity.desc}</p>
              <button>{t("readmore")}</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.Join}>
        <h1>
          {t("inassociation")}

          <span
            style={{
              display: "flex",
            }}
          >
            <h1>{t("beinlist")}</h1>{" "}
            <a
              style={{ color: "#1e1e1e", textDecoration: "underline" }}
              href="mailto:info@winuwatch.uk"
            >
              {t("contactus")}
            </a>
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Charit;
