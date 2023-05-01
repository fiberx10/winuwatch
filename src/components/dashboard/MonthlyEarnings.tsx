/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight } from "@tabler/icons-react";
import DashboardCard from "@/components/shared/DashboardCard";
import { IconCurrencyEuro } from "@tabler/icons-react";
import { api } from "@/utils";
import { light } from "@mui/material/styles/createPalette";


const MonthlyEarnings = () => {
  const { data: dataObj } = api.Order.ticketSoldPerDay.useQuery() || {};

  // chart color
  const theme = useTheme();
  const secondary = "rgba(168, 149, 126, 0.7)";
  const secondarylight = "rgba(168, 149, 126, 0.1)";
  const errorlight = "#fdede8";
  return (
    <DashboardCard
      title="Monthly Sold Tickets"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <IconCurrencyEuro width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={{
            chart: {
              type: "area",
              fontFamily: "'Plus Jakarta Sans', sans-serif;",
              foreColor: "rgba(168, 149, 126, 0.3)",
              toolbar: {
                show: false,
              },
              height: 60,
              sparkline: {
                enabled: true,
              },
              group: "sparklines",
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            fill: {
              colors: ["#fff"],
              type: "solid",
              opacity: 0.05,
            },
            markers: {
              size: 0,
            },
            tooltip: {
              theme: theme.palette.mode === "dark" ? "dark" : "light",
            },
          }}
          series={[
            {
              name: "Count",
              color: secondary,
              data: dataObj?.data.map((item) => item.total_tickets) || [],
            }
          ]}
          type="area"
          height="60px"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {dataObj?.totalNumber ? dataObj?.totalNumber : 0}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
            <IconArrowDownRight width={20} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            {dataObj?.totalNumber ? dataObj?.totalNumber : 0}%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Yesterday
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
