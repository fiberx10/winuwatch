import DashboardComp from "@/components/dashboard/DashboardComp";
import styles from "@/styles/Dashboard.module.css";
import DashboardMainNav from "@/components/dashboard/DashboardMainNav";
import { useStore as UseStore } from "@/components/Store";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardCompetitions from "@/components/dashboard/DashboardCompetitions";
import DashboardWatches from "@/components/dashboard/DashboardWatches";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

const index = () => {
  const { menu } = UseStore();

  return (
    <div className={styles.MainCon}>
      <Head>
        <title>Win u Watch - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardMainNav />
      <div className={styles.dashBody}>
        <DashboardNav />
        <div className={styles.Body}>
          {menu === "Dashboard" ? (
            <DashboardComp />
          ) : menu === "Competitions" ? (
            <DashboardCompetitions />
          ) : menu === "Watches" ? (
            <DashboardWatches />
          ) : menu === "Orders" ? (
            <DashboardOrders />
          ) : (
            <h1>Competitions</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
