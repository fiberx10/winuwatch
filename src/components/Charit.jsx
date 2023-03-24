import styles from "@/styles/Charity.module.css";
import Image from "next/image";

const Charit = () => {
  const data = [
    {
      img: "/images/woodland.png",
      name: "Woodland trust UK",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
    {
      img: "/images/cancerRes.png",
      name: "Cancer research uk",
      amount: 2346,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et sollicitudin eros. ",
    },
  ];
  return (
    <div className={styles.CharityMain}>
      <div className={styles.CharityHeader}>
        <div className={styles.CharityH1}>
          <h1>Total Raised For Charity</h1>
        </div>
        <h3>£594,828</h3>
      </div>
      <div className={styles.CharityGrid}>
        {data.map((charity, i) => {
          return (
            <div className={styles.charity} key={i}>
              <div className={styles.charityTop}>
                <Image
                  width={355}
                  height={355}
                  alt="charity"
                  src={charity.img}
                />
              </div>
              <div className={styles.CharityBot}>
                <div>
                  <h4>DONATIONS</h4>
                  <p className={styles.amount}>${charity.amount}</p>
                </div>
                <h3>{charity.name}</h3>
                <p>{charity.desc}</p>
                <button>READ MORE</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Charit;
