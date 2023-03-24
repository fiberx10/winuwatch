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
  const { Menu, selectMenu } = useStore();

  const Dashmenus = ["Vue d'ensemble", "Concours", "Prix"];
  const secMenus = ["Participants", "Communication", "Paramètres"];
  return (
    <div className={styles.Dashboard}>
      <div className={styles.logo}>
        <Image
          width={100}
          height={40}
          alt="logo"
          src="/images/FooterLogo.png"
        />
      </div>
      <div className={styles.Dashmenus}>
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
  );
};

export default DashboardMainNav;
