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
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerProfile,
  deleteSeller,
  fetchAllSellers,
} from "../../../State/seller/sellerSlice";
import EditSellerDialog from "./EditSellerDialog";

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
    <Box sx={{ p: 3 }}>
      {/* Banner + Profile */}
      <Card sx={{ mb: 3, position: "relative", boxShadow: 4 }}>
        {/* Banner */}
        <Box
          sx={{
            height: 180,
            backgroundImage: `url(${profile.businessDetails?.banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px 8px 0 0",
          }}
        />
        {/* Avatar */}
        <Avatar
          src={profile.businessDetails?.logo}
          sx={{
            width: 100,
            height: 100,
            fontSize: 32,
            bgcolor: "primary.main",
            border: "4px solid white",
            position: "absolute",
            top: 120,
            left: 32,
          }}
        >
          {profile.sellerName?.[0] || "S"}
        </Avatar>
        {/* Info */}
        <CardContent sx={{ mt: 6, pl: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {profile.sellerName}
          </Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
          <Typography color="text.secondary">{profile.mobile}</Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, px: 1, py: 0.5, display: "inline-block", bgcolor: "primary.light", color: "white", borderRadius: "6px" }}
          >
            {profile.accountStatus}
          </Typography>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Grid container spacing={3}>
        {/* Business Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><b>Name:</b> {profile.businessDetails?.businessName}</Typography>
            <Typography><b>Email:</b> {profile.businessDetails?.businessEmail}</Typography>
            <Typography><b>Mobile:</b> {profile.businessDetails?.businessMobile}</Typography>
            <Typography><b>Address:</b> {profile.businessDetails?.businessAddress}</Typography>
          </Paper>
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bank Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><b>Account Number:</b> {profile.bankDetails?.accountNumber}</Typography>
            <Typography><b>Holder Name:</b> {profile.bankDetails?.accountHolderName}</Typography>
            <Typography><b>IFSC:</b> {profile.bankDetails?.ifscCode}</Typography>
          </Paper>
        </Grid>

        {/* Pickup Address */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pickup Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography><b>Name:</b> {profile.pickupAddress?.name}</Typography>
                <Typography><b>Mobile:</b> {profile.pickupAddress?.mobile || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography><b>Address:</b> {profile.pickupAddress?.address || "N/A"}</Typography>
                <Typography><b>City:</b> {profile.pickupAddress?.city}</Typography>
                <Typography><b>State:</b> {profile.pickupAddress?.state}</Typography>
                <Typography><b>Pincode:</b> {profile.pickupAddress?.pinCode}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenEdit(true)}>
          Edit Profile
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete Account
        </Button>
      </Stack>

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
