/* eslint-disable react-hooks/rules-of-hooks */
import DashboardComp from "../../components/dashboard/DashboardComp";
import styles from "@/styles/Dashboard.module.css";
import DashboardMainNav from "../../components/dashboard/DashboardMainNav";
import useStore from "@/components/Store";
import DashboardNav from "../../components/dashboard/DashboardNav";

const index = () => {
  const Menu = useStore((state) => state.Menu);

  return (
    <div className={styles.MainCon}>
      <DashboardMainNav />
      <div className={styles.dashBody}>
        <DashboardNav />
        <div className={styles.Body}>
          {Menu === "Vue d'ensemble" ? (
            <DashboardComp />
          ) : (
            <h1>Competitions</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
