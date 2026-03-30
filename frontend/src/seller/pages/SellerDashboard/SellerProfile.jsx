import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Divider,
  Box,
  Avatar,
  Paper,
  Stack,
  Chip
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerProfile,
  deleteSeller,
  fetchAllSellers,
} from "../../../State/seller/sellerSlice";
import EditSellerDialog from "./EditSellerDialog";
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function SellerProfile() {
  const dispatch = useAppDispatch();
  const { profile,sellers } = useAppSelector((s) => s.seller);
  const jwt = localStorage.getItem("jwt");
  console.log("Sellers - - ", sellers);

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchSellerProfile(jwt));
      dispatch(fetchAllSellers());
    }
  }, [dispatch, jwt]);

  const handleDelete = () => {
    if (jwt && profile?.id) {
      dispatch(deleteSeller({ sellerId: profile.id, jwt }));
      localStorage.removeItem("jwt");
      window.location.href = "/";
    }
  };

  if (!profile) {
    return <p className="p-4">Loading your profile...</p>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Banner + Profile */}
      <Paper elevation={0} sx={{ mb: 4, position: "relative", borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}>
        {/* Banner */}
        <Box
          sx={{
            height: 240,
            background: profile.businessDetails?.banner 
              ? `url(${profile.businessDetails.banner})` 
              : 'linear-gradient(135deg, #00695c 0%, #4db6ac 100%)',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Avatar */}
        <Avatar
          src={profile.businessDetails?.logo}
          sx={{
            width: 140,
            height: 140,
            fontSize: 48,
            color: '#00695c',
            bgcolor: "white",
            border: "6px solid white",
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            position: "absolute",
            top: 170,
            left: { xs: 20, md: 40 },
          }}
        >
          {profile.sellerName?.[0] || "S"}
        </Avatar>
        
        {/* Info Container */}
        <Box sx={{ 
          mt: { xs: 8, md: 9 }, 
          pl: { xs: 3, md: 5 }, 
          pr: { xs: 3, md: 5 }, 
          pb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          gap: 3 
        }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1f2937' }}>
              {profile.sellerName}
              <VerifiedUserIcon sx={{ color: '#00927c', fontSize: 24 }} />
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', mt: 0.5, fontWeight: 500 }}>
              {profile.email} • {profile.mobile}
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Chip 
                  label={profile.accountStatus || 'ACTIVE'} 
                  sx={{ 
                    bgcolor: (profile.accountStatus || 'ACTIVE') === 'ACTIVE' ? '#e0f2f1' : '#fee2e2', 
                    color: (profile.accountStatus || 'ACTIVE') === 'ACTIVE' ? '#00695c' : '#dc2626',
                    fontWeight: 800,
                    letterSpacing: 1,
                    px: 1
                  }} 
                  size="small"
                />
            </Box>
          </Box>
          
          {/* Actions */}
          <Stack direction="row" spacing={2} sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}>
            <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => setOpenEdit(true)}
                fullWidth
                sx={{ 
                    borderColor: '#00695c', 
                    color: '#00695c',
                    fontWeight: 600,
                    borderRadius: 2,
                    p: '8px 24px',
                    '&:hover': { borderColor: '#004d40', backgroundColor: '#e0f2f1' }
                }}
            >
              Edit Profile
            </Button>
            <Button 
                variant="contained" 
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                fullWidth
                sx={{ 
                    bgcolor: '#ef4444', 
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    p: '8px 24px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#dc2626', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)' }
                }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Details Section */}
      <Grid container spacing={4}>
        {/* Business Details */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#00695c', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e0f2f1', display: 'flex' }}>
                <BusinessIcon />
              </Box>
              <Typography variant="h6" fontWeight="800" color="#1f2937">Business Details</Typography>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Business Name</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.businessDetails?.businessName || 'Not Provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Email</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.businessDetails?.businessEmail || 'Not Provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Mobile</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.businessDetails?.businessMobile || 'Not Provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Address</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.businessDetails?.businessAddress || 'Not Provided'}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#00695c', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e0f2f1', display: 'flex' }}>
                <AccountBalanceIcon />
              </Box>
              <Typography variant="h6" fontWeight="800" color="#1f2937">Bank Details</Typography>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Account Number</Typography>
                <Typography variant="body1" fontWeight="600" color="#111827" mt={0.5} sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  {profile.bankDetails?.accountNumber || 'Not Provided'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Holder Name</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.bankDetails?.accountHolderName || 'Not Provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">IFSC Code</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5} sx={{ textTransform: 'uppercase' }}>
                  {profile.bankDetails?.ifscCode || 'Not Provided'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Pickup Address */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#00695c', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e0f2f1', display: 'flex' }}>
                <LocationOnIcon />
              </Box>
              <Typography variant="h6" fontWeight="800" color="#1f2937">Pickup Address</Typography>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Contact Person</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5}>{profile.pickupAddress?.name || 'Not Provided'}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{profile.pickupAddress?.mobile || "N/A"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={1} textTransform="uppercase">Location</Typography>
                <Typography variant="body1" fontWeight="500" color="#111827" mt={0.5} sx={{ lineHeight: 1.6 }}>
                  {profile.pickupAddress?.address || "N/A"}<br/>
                  {profile.pickupAddress?.city ? `${profile.pickupAddress.city}, ` : ''}
                  {profile.pickupAddress?.state ? `${profile.pickupAddress.state} - ` : ''}
                  <span style={{ fontWeight: 800 }}>{profile.pickupAddress?.pinCode || ''}</span>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {openEdit && (
        <EditSellerDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          seller={profile}
        />
      )}
    </Box>
  );
}
