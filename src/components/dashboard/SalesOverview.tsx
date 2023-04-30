/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { api } from "@/utils";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });



const SalesOverview = () => {
  // select
  const [month, setMonth] = useState("1");
  const { data } = api.Order.getperMonthforYear.useQuery();

  // chart color
  const theme = useTheme();

  return (
    <DashboardCard
      title="Sales Overview"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={(event) => {
            setMonth(event.target.value);
          }}
        >
          <MenuItem value={1}>March 2023</MenuItem>
          <MenuItem value={2}>April 2023</MenuItem>
          <MenuItem value={3}>May 2023</MenuItem>
        </Select>
      }
    >
      <Chart
        options={{
          chart: {
            type: "bar",
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: "#adb0bb",
            toolbar: {
              show: true,
            },
            height: 370,
          },
          colors: ["#A8957E", "rgba(0,0,0, 0.4)"],
          plotOptions: {
            bar: {
              horizontal: false,
              barHeight: "60%",
              columnWidth: "42%",
              borderRadius: 6,
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "all",
            },
          },

          stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          grid: {
            borderColor: "rgba(0,0,0,0.1)",
            strokeDashArray: 3,
            xaxis: {
              lines: {
                show: false,
              },
            },
          },
          yaxis: {
            tickAmount: 4,
          },
          xaxis: {
            categories: data?.map((item) => item.month),
            axisBorder: {
              show: false,
            },
          },
          tooltip: {
            theme: theme.palette.mode === "dark" ? "dark" : "light",
            fillSeriesColor: false,
          },
        }}
        series={[
          {
            name: "Confirmed earnings",
            data: data?.map((item) => item.confirmed_total),
          },
          {
            name: "Refunded earnings",
            data: data?.map((item) => item.refunded_total)
          },
        ]}
        type="bar"
        height="417px"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
