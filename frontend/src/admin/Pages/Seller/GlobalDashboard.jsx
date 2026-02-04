import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchAllSellers, fetchAllTransactions } from "../../../State/admin/SellerSlice";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336"]; // Active, Pending, Blocked

const StatCard = ({ title, value }) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="h6" color="primary">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const GlobalDashboard = () => {
  const dispatch = useAppDispatch();
  const { sellers, transactions, loading } = useAppSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchAllSellers());
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  // Aggregate stats
  const totalSellers = sellers.length;
  const active = sellers.filter((s) => s.accountStatus === "ACTIVE").length;
  const pending = sellers.filter((s) => s.accountStatus === "PENDING_VERIFICATION").length;
  const blocked = sellers.filter((s) => s.accountStatus === "BLOCKED").length;

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalOrders = sellers.reduce((sum, s) => sum + (s.sellerReport?.totalOrders || 0), 0);

  // Data for charts
  const sellerStatus = [
    { name: "Active", value: active },
    { name: "Pending", value: pending },
    { name: "Blocked", value: blocked },
  ];

  const topSellers = sellers
    .map((s) => ({
      name: s.sellerName,
      sales: s.sellerReport?.totalSales || 0,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const revenueTrend = [
    { name: "Jan", revenue: 5000 },
    { name: "Feb", revenue: 7000 },
    { name: "Mar", revenue: 6500 },
    { name: "Apr", revenue: 8000 },
  ]; // Ideally from backend

  return (
    <Grid container spacing={3}>
      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h5">Admin Global Dashboard</Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      {/* KPI Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Sellers" value={totalSellers} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Orders" value={totalOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Transactions" value={transactions.length} />
      </Grid>

      {/* Pie Chart - Seller Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Seller Status</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sellerStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sellerStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart - Top Sellers */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Top Sellers by Sales</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSellers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Line Chart - Revenue Trend */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Transactions Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Transactions</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, 10).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.seller?.sellerName}</TableCell>
                    <TableCell>₹{t.amount}</TableCell>
                    <TableCell>{t.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GlobalDashboard;
