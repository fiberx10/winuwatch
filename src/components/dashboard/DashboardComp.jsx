import { Grid } from "@mui/material";
import SalesOverview from "@/components/dashboard/SalesOverview";
import YearlyBreakup from "@/components/dashboard/YearlyBreakup";
import ProductPerformance from "@/components/dashboard/ProductPerformance";
import MonthlyEarnings from "@/components/dashboard/MonthlyEarnings";
import Box from "@mui/material/Box";

const DashboardComp = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7.7}>
          <SalesOverview />
        </Grid>
        <Grid item xs={12} lg={4.3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <YearlyBreakup />
            </Grid>
            <Grid item xs={12}>
              <MonthlyEarnings />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <ProductPerformance />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardComp;
