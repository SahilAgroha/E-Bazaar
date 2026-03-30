import React from 'react';
import { Button, CircularProgress, Divider, Typography, Box, Avatar, Paper } from '@mui/material';
import { useAppSelector } from '../../../State/Store';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Profile = () => {
  const { seller } = useAppSelector(store => store);

  if (seller.loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress sx={{ color: '#00695c' }} />
      </div>
    );
  }

  if (seller.error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500">
        <Typography variant="h6">Error loading seller profile: {seller.error}</Typography>
      </div>
    );
  }

  if (!seller.profile) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Typography variant="h6" className="text-gray-500">No seller profile found. Please log in as a seller.</Typography>
      </div>
    );
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'S';
  };

  return (
    <Box className='p-4 md:p-8 w-full max-w-5xl mx-auto'>
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Account Overview
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* Banner */}
        <Box 
          sx={{ 
            height: 160, 
            background: 'linear-gradient(135deg, #00695c 0%, #4db6ac 100%)',
            position: 'relative'
          }}
        >
          {/* Avatar placement */}
          <Box sx={{ position: 'absolute', bottom: -50, left: 40 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                border: '4px solid white', 
                backgroundColor: '#ffffff',
                color: '#00695c',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            >
              {getInitials(seller.profile.sellerName)}
            </Avatar>
          </Box>
        </Box>

        {/* Profile Details Container */}
        <Box sx={{ pt: 8, pb: 4, px: { xs: 3, md: 5 } }}>
          <Box className="flex justify-between items-start mb-6">
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 flex items-center gap-2">
                {seller.profile.sellerName}
                {seller.profile.role === 'ROLE_SELLER' && (
                  <VerifiedUserIcon sx={{ color: '#09927c', fontSize: 20 }} titleAccess="Verified Seller" />
                )}
              </Typography>
              <Typography variant="body1" className="text-gray-500 font-medium mt-1">
                {seller.profile.companyName || 'Independent Seller'}
              </Typography>
            </Box>
            <Button 
               variant="outlined" 
               sx={{ 
                 borderColor: '#00695c', 
                 color: '#00695c',
                 textTransform: 'none',
                 fontWeight: 600,
                 borderRadius: 2,
                 '&:hover': {
                   borderColor: '#004d40',
                   backgroundColor: '#e0f2f1'
                 }
               }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 tracking-wide uppercase text-sm">
            Contact & Business Info
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Field item */}
            <Box className="flex items-start gap-4">
              <Box className="p-3 rounded-full bg-teal-50 text-teal-700">
                <EmailIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-500 font-medium">Email Address</Typography>
                <Typography variant="body1" className="text-gray-900 font-medium">{seller.profile.email}</Typography>
              </Box>
            </Box>

            <Box className="flex items-start gap-4">
              <Box className="p-3 rounded-full bg-teal-50 text-teal-700">
                <PhoneIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-500 font-medium">Mobile Number</Typography>
                <Typography variant="body1" className="text-gray-900 font-medium">{seller.profile.mobile || 'Not Provided'}</Typography>
              </Box>
            </Box>

            <Box className="flex items-start gap-4">
              <Box className="p-3 rounded-full bg-teal-50 text-teal-700">
                <BusinessIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-500 font-medium">Company Name</Typography>
                <Typography variant="body1" className="text-gray-900 font-medium">{seller.profile.companyName || 'Not Provided'}</Typography>
              </Box>
            </Box>

            <Box className="flex items-start gap-4">
              <Box className="p-3 rounded-full bg-teal-50 text-teal-700">
                <ReceiptIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-500 font-medium">GSTIN</Typography>
                <Typography variant="body1" className="text-gray-900 font-medium uppercase tracking-wider">{seller.profile.gstin || 'Not Provided'}</Typography>
              </Box>
            </Box>

            <Box className="flex items-start gap-4">
              <Box className="p-3 rounded-full bg-teal-50 text-teal-700">
                <BadgeIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-500 font-medium">Account Role</Typography>
                <Box mt={0.5}>
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold tracking-wide">
                        {seller.profile.role ? seller.profile.role.replace('ROLE_', '') : 'SELLER'}
                    </span>
                </Box>
              </Box>
            </Box>

          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;