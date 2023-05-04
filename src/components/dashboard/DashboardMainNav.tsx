import styles from "@/styles/Dashboard.module.css";
import { HomeOutlined } from "@ant-design/icons";
import {
  MessageOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  GiftOutlined,
} from "@ant-design/icons/lib/icons";
import Image from "next/image";
import { useStore, Dashmenus } from "@/components/Store";

const DashboardMainNav = () => {
  const { menu: Menu, selectMenu } = useStore();
  return (
    <div className={styles.Dashboard}>
      <div className={styles.menusWrap}>
        <div className={styles.Dashmenus}>
          <span>Main</span>
          {Dashmenus.map((menu, i) => {
            return (
              <div
                style={{
                  color: Menu === menu ? "white" : "hsla(0, 0%, 100%, 0.4)",
                }}
                onClick={() => selectMenu(menu)}
                className={styles.Menu}
                key={i}
              >
                {i === 0 ? (
                  <HomeOutlined />
                ) : i === 1 ? (
                  <ReconciliationOutlined />
                ) : i === 2 ? (
                  <TrophyOutlined />
                ) : i === 3 ? (
                  <BookOutlined />
                ) : i === 4 ? (
                  <UsergroupAddOutlined />
                ) : (
                  <GiftOutlined />
                )}
                <p>{menu}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.Dashmenus}>
          <span>Other</span>

          {["Communication", "Settings"].map((menu, i) => {
            return (
              <div
                style={{
                  color: Menu === menu ? "white" : "hsla(0, 0%, 100%, 0.4)",
                }}
                //onClick={() => {}}

                className={styles.Menu}
                key={i}
              >
                {i === 0 ? <MessageOutlined /> : <SettingOutlined />}
                <p>{menu}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.logo}>
        <Image
          width={120}
          height={50}
          alt="logo"
          src="/images/FooterLogo.png"
        />
      </div>
    </div>
  );
};

export default DashboardMainNav;
