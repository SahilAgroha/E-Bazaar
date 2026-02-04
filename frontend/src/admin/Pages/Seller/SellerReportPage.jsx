import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchSellerReport } from "../../../State/admin/SellerSlice";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
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

const SellerReportPage = () => {
  const { id } = useParams(); // sellerId
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchSellerReport(id));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>No report available.</p>;

  // Example data for charts
  const revenueTrend = [
    { name: "Jan", earning: 4000, refund: 240 },
    { name: "Feb", earning: 3000, refund: 300 },
    { name: "Mar", earning: 5000, refund: 200 },
    { name: "Apr", earning: 4780, refund: 278 },
    { name: "May", earning: 5890, refund: 189 },
  ];

  const salesData = [
    { name: "Sales", value: report.totalSales },
    { name: "Orders", value: report.totalOrders },
    { name: "Cancelled", value: report.cancelOrders },
  ];

  const sellerStatus = [
    { name: "Active", value: 12 },
    { name: "Pending", value: 5 },
    { name: "Blocked", value: 3 },
  ];

  return (
    <Grid container spacing={3}>
      {/* KPIs */}
      <Grid item xs={12}>
        <Typography variant="h5">Seller Report Dashboard</Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Earnings" value={report.totalEarning} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Net Earnings" value={report.netEarning} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Sales" value={report.totalSales} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Orders" value={report.totalOrders} />
      </Grid>

      {/* Line Chart: Revenue vs Refunds */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="earning" stroke="#4caf50" />
                <Line type="monotone" dataKey="refund" stroke="#f44336" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart: Sales vs Orders */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sales vs Orders</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart: Seller Status Distribution */}
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
    </Grid>
  );
};

export default SellerReportPage;
