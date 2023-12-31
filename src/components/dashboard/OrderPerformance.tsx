import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/components/shared/DashboardCard";
import { api } from "@/utils";

const OrderPerformance = () => {
  const { data: orders } = api.Charts.getLastOrders.useQuery();

  return (
    <DashboardCard title="Last Orders">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  #
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Client
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Number of Tickets
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Payment Method
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Totale
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {index}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                        }}
                        variant="subtitle2"
                        fontWeight={600}
                      >
                        {(order?.first_name !== (undefined || null)
                          ? order?.first_name.slice(1)
                          : " ") +
                          " " +
                          (order?.last_name !== (undefined || null)
                            ? order?.last_name.slice(1)
                            : " ")}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{
                          fontSize: "13px",
                        }}
                      >
                        {order?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    {order?.Ticket.length}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor:
                        order?.paymentMethod === "STRIPE"
                          ? "#00B0FF"
                          : order?.paymentMethod === "PAYPAL"
                          ? "#1d305f"
                          : "#5B33FF",
                      color: "#fff",
                    }}
                    size="small"
                    label={order?.paymentMethod}
                  ></Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor:
                        order?.status === "PENDING"
                          ? "#FF5E57"
                          : order?.status === "CONFIRMED"
                          ? "#00B87C"
                          : order?.status === "CANCELLED"
                          ? "#FFC107"
                          : "#00B0FF",
                      color: "#fff",
                    }}
                    size="small"
                    label={order?.status}
                  ></Chip>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {order?.totalPrice.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default OrderPerformance;
