import React from 'react';
import { useAppSelector } from '../../State/Store';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Box,
  Card,
  Avatar,
  Stack,
  Icon,
  Tooltip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';

const AdminAccount = () => {
  const { user, loading, error } = useAppSelector(store => store.auth);
  console.log('Admin user data ', user);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f5f5f5"
      >
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#fdecea"
        borderRadius={2}
        p={4}
      >
        <Typography variant="h6" color="error">
          Error loading admin profile: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      px={{ xs: 3, md: 10, lg: 20 }}
      py={{ xs: 5, md: 10 }}
      bgcolor="#e3f2fd"
      minHeight="100vh"
    >
      <Paper
        elevation={10}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          background:
            'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
          color: 'white',
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Box textAlign="center" mb={6}>
          <Avatar
            sx={{ bgcolor: '#1565c0', margin: 'auto', width: 100, height: 100 }}
          >
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h3" fontWeight="700" mt={2}>
            Administrator Account
          </Typography>
          <Typography variant="subtitle1" mt={1} color="rgba(255,255,255,0.8)">
            Manage your personal and security information.
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 6 }} />

        <Card
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 3,
            p: 4,
            boxShadow: 4,
          }}
        >
          <Typography
            variant="h5"
            color="#1565c0"
            fontWeight={700}
            mb={4}
            letterSpacing={1}
            sx={{ borderBottom: '3px solid #1976d2', display: 'inline-block' }}
          >
            Personal Information
          </Typography>

          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Full Name">
                <AccountCircleIcon
                  sx={{ color: '#1976d2', fontSize: 32 }}
                />
              </Tooltip>
              <Typography variant="body1" fontSize={18}>
                <strong>Full Name:</strong> {user?.fullName || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Email Address">
                <EmailIcon sx={{ color: '#1976d2', fontSize: 32 }} />
              </Tooltip>
              <Typography variant="body1" fontSize={18}>
                <strong>Email:</strong> {user?.email || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Role">
                <SecurityIcon sx={{ color: '#1976d2', fontSize: 32 }} />
              </Tooltip>
              <Typography variant="body1" fontSize={18}>
                <strong>Role:</strong> {user?.role || 'N/A'}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Paper>
    </Box>
  );
};

export default AdminAccount;
