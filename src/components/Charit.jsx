import styles from "@/styles/Charity.module.css";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Charit = () => {
  const t = useTranslations("charity");
  const data = [
    {
      img: "/images/woodland.png",
      name: "Woodland trust UK",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
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
        <h3>£594,828</h3>
      </div>
      <div className={styles.CharityGrid}>
        {data.map((charity, i) => {
          return (
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
          );
        })}
      </div>
      <div className={styles.Join}>
        <h1>{t("inassociation")}</h1>
        <h1>- {t("contactus")}</h1>
      </div>
    </div>
  );
};

export default Charit;
