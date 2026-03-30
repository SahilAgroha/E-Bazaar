import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Divider
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
  CartesianGrid
} from "recharts";
import {
  MonetizationOn,
  ShoppingCart,
  Cancel,
  ReceiptLong,
} from "@mui/icons-material";
import { fetchSellerReport } from "../../../State/seller/sellerSlice";

// Sophisticated SaaS Chart Palette
const COLORS = ["#00927c", "#f43f5e", "#6366f1", "#f59e0b"];

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
        <CircularProgress sx={{ color: '#00927c' }} />
      </div>
    );
  }

  // Pie Chart Data
  const orderData = [
    { name: "Total Orders", value: report.totalOrders || 0 },
    { name: "Cancelled", value: report.cancelOrders || 0 },
  ];

  // Bar Chart Data
  const salesData = [
    { name: "Total Sales", value: report.totalSales || 0 },
    { name: "Refunds", value: report.totalRefunds || 0 },
    { name: "Tax", value: report.totalTax || 0 },
    { name: "Net Earnings", value: report.netEarning || 0 },
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

  // Premium Card Component
  const StatCard = ({ title, value, icon, colorTheme, bgTheme }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #f3f4f6',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Typography variant="overline" sx={{ color: '#6b7280', fontWeight: 700, letterSpacing: 1, lineHeight: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
          </div>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: bgTheme,
            color: colorTheme
          }}>
            {icon}
          </Box>
        </div>
      </CardContent>
      {/* Decorative subtle bottom border line */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: colorTheme }} />
    </Card>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.025em' }}>
          Seller Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
          Welcome back. Here is what's happening with your store today.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Earnings"
            value={`₹${report.totalEarning || 0}`}
            colorTheme="#0ea5e9"
            bgTheme="#e0f2fe"
            icon={<MonetizationOn sx={{ fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={report.totalOrders || 0}
            colorTheme="#8b5cf6"
            bgTheme="#ede9fe"
            icon={<ShoppingCart sx={{ fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Cancelled"
            value={report.cancelOrders || 0}
            colorTheme="#f43f5e"
            bgTheme="#ffe4e6"
            icon={<Cancel sx={{ fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Transactions"
            value={report.totalTransactions || 0}
            colorTheme="#f59e0b"
            bgTheme="#fef3c7"
            icon={<ReceiptLong sx={{ fontSize: 32 }} />}
          />
        </Grid>
      </Grid>

      {/* Charts Array */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
         {/* Orders Distribution Pie Chart */}
         <Grid item xs={12} md={5} lg={4}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                Orders Distribution
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                Successful vs cancelled orders analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Trend Line Chart */}
        <Grid item xs={12} md={7} lg={8}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                Revenue Trend
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                Monthly gross revenue trajectory
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00927c"
                    strokeWidth={4}
                    dot={{ r: 0 }}
                    activeDot={{ r: 8, fill: '#00927c', stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Breakdown Bar Chart */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                Earnings Breakdown
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                Gross sales compared to deductions and net earning
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10}/>
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle"/>
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
};

export default SellerDashboard;
