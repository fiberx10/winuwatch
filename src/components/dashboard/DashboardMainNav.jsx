import styles from "@/styles/Dashboard.module.css";
import { HomeOutlined } from "@ant-design/icons";
import {
  MessageOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons/lib/icons";
import Image from "next/image";
import { useStore } from "@/components/Store";

const DashboardMainNav = () => {
  const { menu: Menu, selectMenu } = useStore();

  const Dashmenus = ["Vue d'ensemble", "Concours", "Prix"];
  const secMenus = ["Participants", "Communication", "Paramètres"];
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
                ) : (
                  <TrophyOutlined />
                )}
                <p>{menu}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.Dashmenus}>
          <span>Other</span>

          {secMenus.map((menu, i) => {
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
                  <UsergroupAddOutlined />
                ) : i === 1 ? (
                  <MessageOutlined />
                ) : (
                  <SettingOutlined />
                )}
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
