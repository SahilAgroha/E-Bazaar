import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../State/Store';
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Avatar,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import { formatCurrency } from '../../Util/formateCurrency';
import { fetchAllTransaction } from '../../State/seller/transactionSlice';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaidIcon from '@mui/icons-material/Paid';
import StorefrontIcon from '@mui/icons-material/Storefront';

const AdminAllTransactions = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector(store => store.transactions);
  const jwt = localStorage.getItem('jwt');
  const theme = useTheme();

  useEffect(() => {
    if (jwt) {
      dispatch(fetchAllTransaction());
    }
  }, [dispatch, jwt]);

  // Calculate total amount from all transactions
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + transaction.order.totalSellingPrice, 0);
  }, [transactions]);

  if (loading) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#f0f4f8">
        <CircularProgress size={70} thickness={5} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#fff3f2"
        px={4}
        py={3}
        borderRadius={2}
      >
        <Typography color="error" fontWeight="bold" fontSize={18}>
          Error loading transactions: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box px={{ xs: 3, md: 8, lg: 20 }} py={{ xs: 5, md: 10 }} bgcolor="#f9fafb" minHeight="100vh">
      <Typography variant="h4" fontWeight="700" textAlign="center" color="primary.dark" mb={3} letterSpacing={1}>
        All Transactions
      </Typography>

      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          p: 3,
          mb: 6,
          maxWidth: 400,
          mx: 'auto',
          background: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
          boxShadow: theme.shadows[6],
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Total Transactions Amount
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {formatCurrency(totalAmount)}
        </Typography>
      </Paper>

      {transactions.length === 0 ? (
        <Typography variant="h6" color="textSecondary" textAlign="center" mt={6}>
          No transactions found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {transactions.map(transaction => (
            <Grid item xs={12} sm={6} md={4} key={transaction.id}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  bgcolor: theme.palette.background.paper,
                  '&:hover': { boxShadow: theme.shadows[8], cursor: 'pointer' },
                }}
                aria-label={`Transaction ${transaction.id}`}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">
                    Transaction #{transaction.id}
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight="bold" flex={1}>
                      Order ID:
                    </Typography>
                    <Typography>{transaction.order.id}</Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon color="action" />
                    <Typography noWrap>{transaction.customer.email}</Typography>
                  </Stack>

                  {/* Seller Details */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StorefrontIcon color="secondary" />
                    <Typography noWrap>
                      Seller: {transaction.seller?.sellerName || 'N/A'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PaidIcon color="success" />
                    <Typography fontWeight="bold" color="success.main">
                      {formatCurrency(transaction.order.totalSellingPrice)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayIcon color="disabled" />
                    <Typography>
                      {new Date(transaction.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminAllTransactions;
