import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  MonetizationOn,
  ShoppingCart,
  Cancel,
  ReceiptLong,
} from "@mui/icons-material";
import { fetchSellerReport } from "../../../State/seller/sellerSlice";

const COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800"];

const SellerDashboard = () => {
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((store) => store.seller);
  const { jwt } = useAppSelector((store) => store.sellerAuth);
  console.log("Report Data:", report);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchSellerReport(jwt));
    }
  }, [jwt, dispatch]);

  if (loading || !report) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  // Pie Chart Data
  const orderData = [
    { name: "Total Orders", value: report.totalOrders },
    { name: "Cancelled Orders", value: report.cancelOrders },
  ];

  // Bar Chart Data
  const salesData = [
    { name: "Total Sales", value: report.totalSales },
    { name: "Refunds", value: report.totalRefunds },
    { name: "Tax", value: report.totalTax },
    { name: "Net Earnings", value: report.netEarning },
  ];

  // Mock Line Chart Data (Revenue Trend)
  const revenueTrend = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 7000 },
    { month: "Mar", revenue: 6500 },
    { month: "Apr", revenue: 9000 },
    { month: "May", revenue: 12000 },
    { month: "Jun", revenue: 15000 },
  ];

  // Card component with icon
  const StatCard = ({ title, value, color, icon }) => (
    <Card
      className="shadow-xl rounded-2xl hover:scale-105 transition-transform duration-300"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`,
        color: "#fff",
      }}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h5" className="font-bold mt-2">
              {value}
            </Typography>
          </div>
          <div className="text-4xl opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold text-gray-700 mb-6">
        📊 Seller Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Earnings"
            value={`₹${report.totalEarning}`}
            color="#16a34a"
            icon={<MonetizationOn fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Orders"
            value={report.totalOrders}
            color="#2563eb"
            icon={<ShoppingCart fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Cancelled Orders"
            value={report.cancelOrders}
            color="#dc2626"
            icon={<Cancel fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Transactions"
            value={report.totalTransactions}
            color="#f59e0b"
            icon={<ReceiptLong fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Orders Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                🥧 Orders Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {orderData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                📦 Earnings Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Line Chart */}
        <Grid item xs={12}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                📈 Revenue Trend (Monthly)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SellerDashboard;
