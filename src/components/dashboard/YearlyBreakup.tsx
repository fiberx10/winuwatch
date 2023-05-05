import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft, IconArrowDownRight } from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";
import { api } from "@/utils";

function getUniqueRandomHexColors(length: number) {
  const hexChars = "0123456789ABCDEF";
  const colors: Array<string> = [];

  while (colors.length < length) {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += hexChars[Math.floor(Math.random() * 16)];
    }
    if (!colors.includes(color)) {
      colors.push(color);
    }
  }

  return colors;
}

const YearlyBreakup = () => {
  const currentYear = new Date().getFullYear();
  const { data } = api.Charts.yearlyEarnings.useQuery() || {};
  const { data: clientsCountry } = api.Charts.clientsCountry.useQuery() || {};
  // chart color
  const theme = useTheme();
  const primary = "#a8957e";
  const primarylight = "rgba(168, 149, 126, 0.3)";
  const successlight = "rgba(3, 201, 169, 0.2)";
  const dangerlight = "rgba(255, 94, 87, 0.2)";

  const seriescolumnchart =
    clientsCountry?.map((item) => Number(item.total)) || [];
  const seriesChartColor = getUniqueRandomHexColors(
    clientsCountry?.length || 0
  );

  return (
    <DashboardCard title="Yearly Earnings">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography
            style={{
              fontSize: "40px",
            }}
            variant="h3"
            fontWeight="700"
          >
            {/* £ */}
            {data?.current_year.toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            {data && data?.current_year > data?.last_year ? (
              <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                <IconArrowUpLeft width={20} color="#39B69A" />
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: dangerlight, width: 27, height: 27 }}>
                <IconArrowDownRight width={20} color="#FF5E57" />
              </Avatar>
            )}
            <Typography variant="subtitle2" fontWeight="600">
              {data
                ? data?.last_year === 0
                  ? 100
                  : Math.round(
                      ((data?.current_year - data?.last_year) /
                        data?.last_year) *
                        100
                    )
                : 0}
              %
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {currentYear - 1}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primarylight,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {currentYear}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            title="Clients Country"
            options={{
              chart: {
                type: "donut",
                fontFamily: "'Plus Jakarta Sans', sans-serif;",
                foreColor: "#adb0bb",
                toolbar: {
                  show: false,
                },
                height: 155,
              },
              colors: seriesChartColor,
              labels:
                clientsCountry?.map((item) => item.country || "Unknown") || [],
              plotOptions: {
                pie: {
                  startAngle: 0,
                  endAngle: 360,
                  donut: {
                    size: "75%",
                    background: "transparent",
                  },
                },
              },
              tooltip: {
                theme: theme.palette.mode === "dark" ? "dark" : "light",
                fillSeriesColor: false,
              },
              stroke: {
                show: false,
              },
              dataLabels: {
                enabled: false,
              },
              legend: {
                show: false,
              },
              responsive: [
                {
                  breakpoint: 991,
                  options: {
                    chart: {
                      width: 120,
                    },
                  },
                },
              ],
            }}
            series={seriescolumnchart}
            type="donut"
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
