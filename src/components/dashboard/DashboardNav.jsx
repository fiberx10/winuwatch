import styles from "@/styles/Dashboard.module.css";
import Image from "next/image";

const DashboardNav = () => {
  return (
    <div className={styles.Nav}>
      <Image
        className={styles.search}
        width={20}
        height={20}
        alt="search"
        src="/images/search.svg"
      />
      <div>
        <Image
          width={31}
          height={21}
          alt="search"
          src="/images/Notifications.svg"
        />
        <Image width={34} height={21} alt="search" src="/images/userDash.svg" />
      </div>
    </div>
  );
};

export default DashboardNav;
